// TODO: this is not tested
import http from "k6/http";

/** @type {import("k6/options").Options} */
export const options = {
  scenarios: {
    constant_request_rate: {
      executor: "constant-arrival-rate",
      rate: 100,
      timeUnit: "1s",
      duration: "1m",
      preAllocatedVUs: 100,
      gracefulStop: "0s",
    },
  },
};

export default function () {
  http.get("https://dev.chicmoz.build/metrics/health");
}
