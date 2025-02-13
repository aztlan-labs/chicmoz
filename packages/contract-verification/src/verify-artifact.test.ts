import * as contractArtifactJson from "@aztec/noir-contracts.js/artifacts/easy_private_voting_contract-EasyPrivateVoting" assert { type: "json" };
import { describe, expect, test } from "vitest";

import { Fr, AztecAddress, PublicKeys } from "@aztec/aztec.js";
import {computeInitializationHash,computeSaltedInitializationHash,computeContractAddressFromInstance,computePartialAddress} from"@aztec/circuits.js"
import { loadArtifact, loadCCFromArtifact } from "./payload.js";

describe("artifact verification tests", () => {
  const salt = "0x22a286727cc52b2af208b884a01858793d29d20e897df4b2a80237d96528c8de"
  const adminAddress = "0x2e16425c902f899df2b77bacc911e75e9acb5f0d4e3866303e372b2ed44545d9"
  const publicKeyValues = "0x01498945581e0eb9f8427ad6021184c700ef091d570892c437d12c7d90364bbd170ae506787c5c43d6ca9255d571c10fa9ffa9d141666e290c347c5c9ab7e34400c044b05b6ca83b9c2dbae79cc1135155956a64e136819136e9947fe5e5866c1c1f0ca244c7cd46b682552bff8ae77dea40b966a71de076ec3b7678f2bdb1511b00316144359e9a3ec8e49c1cdb7eeb0cedd190dfd9dc90eea5115aa779e287080ffc74d7a8b0bccb88ac11f45874172f3847eb8b92654aaa58a3d2b8dc7833019c111f36ad3fc1d9b7a7a14344314d2864b94f030594cd67f753ef774a1efb2039907fe37f08d10739255141bb066c506a12f7d1e8dfec21abc58494705b6f"
  
  const artifactStr = JSON.stringify(contractArtifactJson)
  const artifact = loadArtifact(artifactStr);

  test("compute initalization hash", async ()=>{
    const initFn = artifact.functions.find((fn)=> fn.name ==="constructor")
    const initHash = await computeInitializationHash(initFn, [adminAddress])
    expect(initHash)
  })

  test("compute salted initialization hash", async ()=>{
    const initFn = artifact.functions.find((fn)=> fn.name ==="constructor")
    const initializationHash = await computeInitializationHash(initFn, [adminAddress])
    const saltedHash = await computeSaltedInitializationHash({initializationHash, salt: Fr.fromString(salt), deployer: AztecAddress.fromString(adminAddress)})
    expect(saltedHash)
  })

  test("compute partial contract address", async () => {
    const initFn = artifact.functions.find((fn)=> fn.name ==="constructor")
    const initializationHash = await computeInitializationHash(initFn, [adminAddress])
    const saltedHash = await computeSaltedInitializationHash({initializationHash, salt: Fr.fromString(salt), deployer: AztecAddress.fromString(adminAddress)})

    const contractClass = await loadCCFromArtifact(artifactStr);


    const partAddr = await computePartialAddress({contractClassId: contractClass.id, saltedInitializationHash: saltedHash })
    expect(partAddr)
  })

  test("compute contract address", async () => {
    const initFn = artifact.functions.find((fn)=> fn.name ==="constructor")
    const initializationHash = await computeInitializationHash(initFn, [adminAddress])
    const saltedHash = await computeSaltedInitializationHash({initializationHash, salt: Fr.fromString(salt), deployer: AztecAddress.fromString(adminAddress)})

    const contractClass = await loadCCFromArtifact(artifactStr);


    const address = await computeContractAddressFromInstance({contractClassId: contractClass.id, saltedInitializationHash: saltedHash, publicKeys: PublicKeys.fromString(publicKeyValues) })
    expect(address)
  })
});
