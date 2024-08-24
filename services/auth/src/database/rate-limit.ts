import autoBind from "auto-bind";
import { createClient, RedisClientType } from "redis";
import { z } from "zod";

/**
 * Rate limiting is based on the following mechanism: https://redis.com/glossary/rate-limiting/
 */

const tierSchema = z.object({
  id: z.string(),
  requestsPerMonth: z.number(),
  requestsPer10Seconds: z.number(),
});
type Tier = z.infer<typeof tierSchema>;

export type Period = "seconds" | "month";
type PeriodKey = "s" | "m";

const PERIOD_TO_KEY: Record<Period, PeriodKey> = {
  month: "m",
  seconds: "s",
} as const;

const PERIOD_TO_EXP: Record<Period, number> = {
  month: 60 * 60 * 24 * 31 - 1,
  seconds: 9,
} as const;

interface RateLimitDbConfig {
  host: string;
  port: number;
}

export class RateLimitDb {
  private readonly client: RedisClientType;

  constructor({ host, port }: RateLimitDbConfig) {
    autoBind(this);

    this.client = createClient({
      socket: {
        host,
        port,
      },
      database: 0,
    });
  }

  connect() {
    return this.client.connect();
  }

  disconnect() {
    return this.client.disconnect();
  }

  private tierRedisId(tierId: string, periodKey: PeriodKey) {
    return `tier:${tierId}:${periodKey}`;
  }

  private subscriptionTierRedisId(subscriptionId: string) {
    return `subscriptionTier:${subscriptionId}`;
  }

  private apiKeySubscriptionRedisId(apiKey: string) {
    return `apiKeySubscription:${apiKey}`;
  }

  private requestsRedisId(subscriptionId: string, periodKey: PeriodKey, periodNum: number) {
    return `requests:${subscriptionId}:${periodKey}:${periodNum}`;
  }

  private async getTier(tierId: string, periodKey: PeriodKey) {
    const redisId = this.tierRedisId(tierId, periodKey);
    const tier = await this.client.get(redisId);
    if (!tier) return 0;
    return Number(tier);
  }

  private async getSubscriptionTier(subscriptionId: string) {
    const redisId = this.subscriptionTierRedisId(subscriptionId);
    const tier = await this.client.get(redisId);
    return tier;
  }

  private async getApiKeySubscription(apiKey: string) {
    const redisId = this.apiKeySubscriptionRedisId(apiKey);
    const subscription = await this.client.get(redisId);
    return subscription;
  }

  async setTier(tier: Tier) {
    const { id, requestsPer10Seconds, requestsPerMonth } = tier;

    const redisIdMonth = this.tierRedisId(id, "m");
    const redisIdSeconds = this.tierRedisId(id, "s");

    await this.client.multi().set(redisIdMonth, requestsPerMonth).set(redisIdSeconds, requestsPer10Seconds).exec();
  }

  async setSubscriptionTier(subscriptionId: string, tierId: string) {
    const redisId = this.subscriptionTierRedisId(subscriptionId);
    await this.client.set(redisId, tierId);
  }

  async setApiKeySubscription(apiKey: string, subscriptionId: string) {
    const redisId = this.apiKeySubscriptionRedisId(apiKey);
    await this.client.set(redisId, subscriptionId);
  }

  async resetRequests(subscriptionId: string) {
    const redisIdMonth = this.requestsRedisId(subscriptionId, "m", this.getPeriodNum("month"));
    const redisIdSeconds = this.requestsRedisId(subscriptionId, "s", this.getPeriodNum("seconds"));

    await this.client.multi().set(redisIdMonth, 0).set(redisIdSeconds, 0).exec();
  }

  async deleteApiKey(apiKey: string) {
    const redisId = this.apiKeySubscriptionRedisId(apiKey);
    await this.client.del(redisId);
  }

  private getPeriodNum(period: Period) {
    if (period === "seconds") {
      const second = new Date().getSeconds();
      return Math.floor(second / 10);
    } else {
      return new Date().getMonth();
    }
  }

  async checkRequestLimitReached(period: Period, apiKey: string) {
    const periodKey = PERIOD_TO_KEY[period];
    const periodNum = this.getPeriodNum(period);

    const subscriptionId = await this.getApiKeySubscription(apiKey);
    if (!subscriptionId) return true;

    const redisId = this.requestsRedisId(subscriptionId, periodKey, periodNum);
    const requestsInPeriod = await this.client.get(redisId).then((val) => Number(val));
    const tierId = await this.getSubscriptionTier(subscriptionId);
    if (!tierId) return true;

    const periodLimit = await this.getTier(tierId, periodKey);
    if (requestsInPeriod >= periodLimit) return true;

    const expSeconds = PERIOD_TO_EXP[period];
    await this.client.multi().incr(redisId).expire(redisId, expSeconds).exec();

    return false;
  }
}
