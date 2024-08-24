import { beforeAll, describe, expect, it } from "vitest";

const UNAUTHENTICATED_KEY = "81b9c1f5-37b5-437e-bcdc-589244c81a84";

const protectedUrl = (apiKey: string) => `http://node.localhost/v1/${apiKey}/test`;
const fetchProtectedUrl = (apiKey: string) => fetch(protectedUrl(apiKey));

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe("/_external-auth-*", () => {
  let authenticatedKey = "";

  beforeAll(async () => {
    const res = await fetch(`http://localhost/api-key/create`, {
      method: "POST",
      body: JSON.stringify({ cached: false }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      return res.text();
    });
    const jsonRes = JSON.parse(res) as { apiKey: string };
    authenticatedKey = jsonRes.apiKey;

    // waiting for api key to be processed by all the required services
    await wait(8000);
  });

  it("returns 200 if api key exists and rates are respected", async () => {
    const res = await fetchProtectedUrl(authenticatedKey);
    expect(res.status).toBe(200);
  });

  // TODO: test for 400 once it's fixed
  it("returns 500 if api key is malformed", async () => {
    const res = await fetchProtectedUrl("invalidkey");
    expect(res.status).toBe(500);
  });

  it("returns 403 if api key does not exist", async () => {
    const res = await fetchProtectedUrl(UNAUTHENTICATED_KEY);
    expect(res.status).toBe(403);
  });
});
