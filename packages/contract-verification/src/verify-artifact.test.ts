import * as contractArtifactJson from "@aztec/noir-contracts.js/artifacts/easy_private_voting_contract-EasyPrivateVoting" assert { type: "json" };
import { describe, expect, test } from "vitest";

import { NoirCompiledContract } from "@aztec/aztec.js";
import { createArtifact, loadArtifact } from "./payload.js";

describe("artifact verification tests", () => {
  const version = "1";
  const contractClassId = "SimpleLogging";
  const contractLoggingName = "SimpleLogging";

  test("create artifact", async () => {
    const res = await createArtifact(
      contractLoggingName,
      contractArtifactJson as unknown as NoirCompiledContract,
      contractClassId,
      parseInt(version)
    );
    expect(res, "artifact creation").toBeDefined();
    //expect(res).resolves.toEqual(JSON.stringify(contractArtifactJson))
  });

  test("load artifact", () => {
    const res = loadArtifact(JSON.stringify(contractArtifactJson));

    expect(res).resolves;
  });
});
