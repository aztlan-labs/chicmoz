export const KAFKA_CONNECTION = process.env.KAFKA_CONNECTION ?? "kafka:9092";
export const KAFKA_SASL_USERNAME = process.env.KAFKA_SASL_USERNAME ?? "controller_user";
export const KAFKA_SASL_PASSWORD = process.env.KAFKA_SASL_PASSWORD ?? "test";

export const getConfigStr = () => {
  return `KAFKA
KAFKA_CONNECTION:    ${KAFKA_CONNECTION}
KAFKA_SASL_USERNAME: ${KAFKA_SASL_USERNAME}`;
};
