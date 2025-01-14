import { startPoller } from "./svcs/poller/index.js";

// eslint-disable-next-line @typescript-eslint/require-await
export const start = async () => {
  await startPoller();
};
