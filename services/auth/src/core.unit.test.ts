import { Logger } from "@chicmoz-pkg/logger-server";
import { describe, expect, test, vi } from "vitest";
import { Core } from "./core.js";
import { DB } from "./database/db.js";
import { RateLimitDb } from "./database/rate-limit.js";

describe("core unit tests", () => {
  // FIXME: Mock these things better most likely
  const infoMock = vi.fn(() => "");
  
  const logger = {
    info: infoMock,
  } as unknown as Logger;
  
  const mockApiKey = "9ccca684-28f8-4897-af71-5f85fcbd60bd";
  
  const registerMock = vi.fn(() => [{ id: "1", apiKey: mockApiKey }, true]);
  const registerWithDiscordIdMock = vi.fn(() => [{ id: "2", apiKey: mockApiKey }, true]);
  const deleteMock = vi.fn(() => 1);
  const deleteMockRateLimitDb = vi.fn(() => Promise<void>);

  const setApiKeySubscriptionMock = vi.fn();
  
  const rateLimitDb = {
    setApiKeySubscription: setApiKeySubscriptionMock,
    deleteApiKey: deleteMockRateLimitDb,
  } as unknown as RateLimitDb;

  const db = {
    register: registerMock,
    registerWithDiscordId: registerWithDiscordIdMock,
    delete: deleteMock,
  } as unknown as DB;


  describe("extractApiKey", () => {
    test("success; multiple sub-paths", () => {
      const url = "/v1/4aedfbf7-4d0f-4033-9bc8-50443d5be2cd/latest/height";
      const core = new Core({ logger, db, rateLimitDb });

      const [found, apiKey] = core.extractApiKey(url);
      expect(apiKey).toStrictEqual("4aedfbf7-4d0f-4033-9bc8-50443d5be2cd");
      expect(found).toStrictEqual(true);
    });

    test("success; no sub-path", () => {
      const url = "/v1/4aedfbf7-4d0f-4033-9bc8-50443d5be2cd/";
      const core = new Core({ logger, db, rateLimitDb });

      const [found, apiKey] = core.extractApiKey(url);
      expect(apiKey).toStrictEqual("4aedfbf7-4d0f-4033-9bc8-50443d5be2cd");
      expect(found).toStrictEqual(true);
    });

    test("success; one sub-path", () => {
      const url = "/v1/4aedfbf7-4d0f-4033-9bc8-50443d5be2cd/latest";
      const core = new Core({ logger, db, rateLimitDb });

      const [found, apiKey] = core.extractApiKey(url);
      expect(apiKey).toStrictEqual("4aedfbf7-4d0f-4033-9bc8-50443d5be2cd");
      expect(found).toStrictEqual(true);
    });

    test("success; no end slash", () => {
      const url = "/v1/4aedfbf7-4d0f-4033-9bc8-50443d5be2cd";
      const core = new Core({ logger, db, rateLimitDb });

      const [found, apiKey] = core.extractApiKey(url);
      expect(apiKey).toStrictEqual("4aedfbf7-4d0f-4033-9bc8-50443d5be2cd");
      expect(found).toStrictEqual(true);
    });

    test("success; v1 in api key", () => {
      const url = "/v1/v1edfbv1-4d0f-4033-9bc8-50443d5be2v1/latest";
      const core = new Core({ logger, db, rateLimitDb });

      const [found, apiKey] = core.extractApiKey(url);
      expect(apiKey).toStrictEqual("v1edfbv1-4d0f-4033-9bc8-50443d5be2v1");
      expect(found).toStrictEqual(true);
    });
  });

  describe("isUUID", () => {
    const validUUIDs = [
      "9ccca684-28f8-4897-af71-5f85fcbd60bd",
      "94083334-1e63-41d8-82a4-bf8921f48e3c",
      "e9cc120d-4999-4379-8262-439b2d48c42a",
      "d08fd75d-6c23-497e-97c4-fe59b12aa8fe",
      "e25d8685-ff44-4815-b9d7-d70f892938a2",
      "b4178d28-0330-4313-8c42-14fee636c02d",
      "2361ef86-5546-4868-8c5f-7dc61807f6ab",
      "77998641-436f-402b-abd5-b0785e854387",
      "7070eac7-8217-42bc-b50e-1297a33b5cdb",
      "55028060-54bb-40ee-952e-d4dac5be0527",
      "b429f18d-635e-4a2f-b050-5bb6d2cba5ed",
      "78743c5d-106f-4f02-b8b9-17af9f38ed3c",
      "bcc4572a-fa8a-4988-b579-3d92df58691d",
      "d81cc18f-7b0f-49a2-bb99-fa4ed5f56557",
      "b0812346-98d4-498a-9406-3cf7e87d2366",
      "8e0121f5-98e0-4eb0-a76e-d9e73cf7dcb9",
      "1b617368-2f50-4892-a03f-9a413b5603f9",
      "58d1638f-93b2-42e5-864b-ca1fdacee160",
      "f43aa41f-2185-44b9-8d8c-db7989de0f07",
      "625faf24-52b8-4c73-a56d-a8ea6dfdf090",
      "1e608751-e385-4a3f-a6d2-7ccb8fa36d55",
      "ca432efc-4963-400e-9318-d357bb1377d5",
      "3a29e3f2-aedc-4011-9a13-edf9b81d8217",
      "e61f3e47-2adc-4e25-803b-c0858ba4c845",
      "cfbda34d-671a-45db-b926-876e4413c70d",
      "61063c4b-34c4-49f9-aaaa-9e17b8276a0d",
      "13cb7ad1-afda-41a0-a64c-cfb46f01bc06",
      "b2320b6c-a587-4dd3-be48-d011b17c9625",
      "900c3b56-4050-4649-b6ab-a271a9591021",
      "5cd003f4-7562-4f08-98ca-abef8cf85fec",
      "a3fd1a3a-3cfc-493a-bb79-3ff0fc591242",
      "09cf75e2-3d3d-42be-9a8a-138c6c40be38",
      "217b6a3d-a68a-44ea-8e4d-f7cd4f4032e6",
      "70bcf385-fec1-453e-8b4c-97c88a16cbd5",
      "1e3405c0-f0ba-4c15-a570-e7b93f9f56e5",
      "241f3a0d-9086-44c7-bc9d-af322691b86d",
      "212dd5bd-6578-45ad-8c0b-6c3b015b10d9",
      "5206c6f0-2618-41e0-9d5e-642d01ba4390",
      "97ef00c6-0d91-4fef-a412-85382c020f87",
      "440141a0-86d0-4ece-8b70-403f5c05d060",
      "735f736a-bb0c-43e7-bbc6-cb4ebf2f9baf",
      "e252f708-5726-4177-a248-753bae627ede",
      "e573ef17-8b37-4988-9a5a-028eb3b4f123",
      "f850bf8d-609d-4f2d-b02d-2b5956d86dc2",
      "8e416527-a317-445c-8fdd-01d740ea123e",
      "3667fec0-3b39-4d3c-b11e-1ae8246a4aed",
      "70e44e3e-3b9b-4342-a41a-afef7f612853",
      "0389407e-5cad-4891-a67a-f6e41f476fc6",
      "e8e057f4-a7dd-452b-a8b3-65a74fa23cdb",
      "76e589aa-7479-4da1-b304-a0baafdb3ef1",
    ];

    for (const uuid of validUUIDs) {
      test(`success; ${uuid}`, () => {
        const core = new Core({ logger, db, rateLimitDb });
        expect(core.isUUID(uuid)).toStrictEqual(true);
      });
    }

    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < validUUIDs.length; i++) {
      const s = (Math.random() + 1).toString(36).substring(7);
      test(`failure; ${s}`, () => {
        const core = new Core({ logger, db, rateLimitDb });
        expect(core.isUUID(s)).toStrictEqual(false);
      });
    }
  });
});
