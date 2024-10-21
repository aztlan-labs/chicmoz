import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  scenarios: {
    constant_load: {
      executor: "constant-arrival-rate",
      rate: 5,
      timeUnit: "1s",
      duration: "30s",
      preAllocatedVUs: 5,
      gracefulStop: "0s",
    },
    ramping_load: {
      executor: "ramping-arrival-rate",
      startRate: 1,
      timeUnit: "1s",
      stages: [
        { duration: "30s", target: 2 },
        { duration: "30s", target: 2 },
        { duration: "30s", target: 5 },
        { duration: "30s", target: 5 },
        { duration: "30s", target: 0 },
      ],
      preAllocatedVUs: 20,
      maxVUs: 50,
    },
    spike_test: {
      executor: "ramping-arrival-rate",
      startRate: 1,
      timeUnit: "1s",
      stages: [
        { duration: "30s", target: 2 },
        { duration: "30s", target: 5 },
        { duration: "30s", target: 2 },
      ],
      preAllocatedVUs: 20,
      maxVUs: 50,
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.05'], // 5% error rate
    http_req_duration: ['p(95)<5000'], // 95% of requests should be below 5s
  },
};

const BASE_URL = "https://api.chicmoz.info/v1/d1e2083a-660c-4314-a6f2-1d42f4b944f4";

let VALID_BLOCK_HEIGHT = 2;

const ENDPOINTS = {
  latestHeight: "/l2/latest-height",
  latestBlock: "/l2/blocks/latest",
  blocks: "/l2/blocks",
  specificBlock: `/l2/blocks/${VALID_BLOCK_HEIGHT}`,
  txEffects: `/l2/blocks/${VALID_BLOCK_HEIGHT}/tx-effects`,
  search: "/l2/search?q=0x256d4cc63603a15ffc541fee143d232c23387d2e455eebaf26d89abf024fa7ea",
  statsTotalTxEffects: "/l2/stats/total-tx-effects",
  statsAverageFees: "/l2/stats/average-fees",
};

export default function () {
  const requests = Object.entries(ENDPOINTS).map(([name, path]) => ({
    method: "GET",
    url: `${BASE_URL}${path}`,
    params: {
      tags: { name: name },
      timeout: 10000, // 10 second timeout
    },
  }));

  const responses = http.batch(requests);

  for (let i = 0; i < responses.length; i++) {
    const [name, ] = Object.entries(ENDPOINTS)[i];
    check(responses[i], {
      [`${name} status is 200 or 404`]: (r) => r.status === 200 || r.status === 404,
      [`${name} status is not 500`]: (r) => r.status !== 500,
      [`${name} response time < 5000ms`]: (r) => r.timings.duration < 5000,
    });
  }

  sleep(3);
}
