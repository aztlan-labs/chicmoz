import { Logger } from "@chicmoz-pkg/logger-server";
import autoBind from "auto-bind";
import { BSON } from "bson";
import kafkaJS, {
  Consumer,
  Kafka,
  KafkaConfig,
  Message,
  Producer,
  SASLOptions,
} from "kafkajs";

export { SASLOptions } from "kafkajs";

export interface MBOptions {
  logger: Logger;
  clientId: string;
  connection: string;
  saslConfig: SASLOptions;
  ssl?: boolean;
}
export type MBConsumer = {
  consumer: Consumer;
  topicCallbacks: Record<string, (event: object) => Promise<void>>;
};

export class MessageBus {
  #client: Kafka;
  #producer: Producer | undefined;
  #consumers: Record<string, MBConsumer | undefined>;
  #shutdown = false;
  logger: Logger;

  constructor(options: MBOptions) {
    this.logger = options.logger;
    const kafkaConfig: KafkaConfig = {
      clientId: options.clientId,
      brokers: options.connection.split(","),
      sasl: options.saslConfig,
      logCreator: () => {
        return ({ log }) => {
          const { message, error, stack, retryCount } = log;
          const msg = `Kafka: ${message}`;
          if (error || stack) this.logger.error(msg);
          else if (retryCount) this.logger.warn(msg);
          else this.logger.info(msg);
        };
      },
    };
    if (options.ssl) kafkaConfig.ssl = true;

    this.#client = new Kafka(kafkaConfig);
    this.#consumers = {};

    autoBind(this);
  }

  private shouldRestart(error: Error): boolean {
    const isNonRetriableError =
      error instanceof kafkaJS.KafkaJSNonRetriableError;
    const isNumberOfRetriesExceeded =
      error instanceof kafkaJS.KafkaJSNumberOfRetriesExceeded;
    const isCoordinatorError =
      error instanceof kafkaJS.KafkaJSGroupCoordinatorNotFound;

    return (
      isNonRetriableError && !isNumberOfRetriesExceeded && !isCoordinatorError
    );
  }

  private async connectProducer() {
    this.#producer = this.#client.producer();
    await this.#producer.connect();
  }

  private async connectConsumer(groupId: string) {
    this.#consumers[groupId] = {
      consumer: this.#client.consumer({ groupId }),
      topicCallbacks: {},
    };
    await this.#consumers[groupId]!.consumer.connect();
  }

  async publish<T>(topic: string, ...messages: T[]) {
    if (this.#shutdown) throw new Error("MessageBus is already shutdown");

    if (!this.#producer) await this.connectProducer();

    const kafkaMessages: Message[] = [];
    for (const m of messages)
      kafkaMessages.push({ value: Buffer.from(BSON.serialize({ data: m })) }); // double check

    await this.#producer!.send({ topic, messages: kafkaMessages });
  }

  // TODO: https://kafka.js.org/docs/consuming; probably need to look into manually committing instead in future
  async subscribe<T>(
    groupId: string,
    topic: string,
    cb: ((event: T) => Promise<void>) | ((event: T) => void)
  ) {
    this.logger.info(`Kafka: connecting to consumer group ${groupId}`);
    if (!this.#consumers[groupId]) await this.connectConsumer(groupId);

    this.logger.info(`Kafka: subscribing to topic ${topic}`);
    await this.#consumers[groupId]!.consumer.subscribe({
      topic,
      fromBeginning: true,
    });
    this.#consumers[groupId]!.topicCallbacks = {
      ...this.#consumers[groupId]?.topicCallbacks,
      [topic]: cb as unknown as (event: object) => Promise<void>,
    };
  }

  private nonRetriableWrapper(groupId: string) {
    // TODO: we should do this without promise
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.#consumers[groupId]!.consumer.on("consumer.crash", async (payload) => {
      if (!this.shouldRestart(payload.payload.error)) return;

      const currentTopics = this.#consumers[groupId]!.topicCallbacks;
      try {
        await this.#consumers[groupId]!.consumer.disconnect();
      } finally {
        // TODO: we should do this without promise
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        setTimeout(async () => {
          await this.connectConsumer(groupId);
          await Promise.all(
            Object.keys(currentTopics).map(async (topicName) => {
              await this.subscribe(
                groupId,
                topicName,
                currentTopics[topicName]
              );
            })
          );
          await this.runConsumer(groupId);
        }, 5000);
      }
    });
  }

  async runConsumer(groupId: string) {
    if (!this.#consumers[groupId])
      throw new Error(`No consumer exists with groupId: ${groupId}`);

    this.nonRetriableWrapper(groupId);

    await this.#consumers[groupId]!.consumer.run({
      eachMessage: async ({ topic, message }) => {
        // this.logger.info(
        //   `Kafka: received message from topic ${topic} in group ${groupId}`
        // );
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const data = BSON.deserialize(message.value!).data;
        const cb = this.#consumers[groupId]?.topicCallbacks[topic];
        if (cb) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            await cb(data);
          } catch (e) {
            if (e instanceof Error) {
              this.logger.error(
                `Provided callback for topic ${topic} failed: ${e.stack}`
              );
            } else {
              // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
              this.logger.warn(`Provided callback for topic ${topic} failed with non-Error: ${e}`);
            }
          }
        }
      },
    });
  }

  async disconnect() {
    this.#shutdown = true;
    await this.#producer?.disconnect();
    for (const consumer of Object.values(this.#consumers))
      await consumer?.consumer.disconnect();
  }
}
