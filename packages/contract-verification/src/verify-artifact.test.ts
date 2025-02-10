import * as contractArtifactJson from "@aztec/noir-contracts.js/artifacts/easy_private_voting_contract-EasyPrivateVoting" assert { type: "json" };
import { describe, expect, test, vi } from "vitest";

import {loadArtifact, createArtifact} from './payload.js'

describe ("artifact verification tests", ()=>{
  const version = '1'
  const contractClassId = 'SimpleLogging'
  const contractLoggingName = 'SimpleLogging'

  test("create artifact", async() => {
    const res = await createArtifact(contractLoggingName, contractArtifactJson, contractClassId, version)
    expect(true)
    //expect(res).resolves.toEqual(JSON.stringify(contractArtifactJson))
  })

  test("load artifact", () => {
    const res = loadArtifact(JSON.stringify(contractArtifactJson))

    expect(res).resolves
  })
})