import { ChicmozL2VerifiedContractInctanceData } from "@chicmoz-pkg/types";

export const CHAIN_NAME = "AZTEC";
export const SERVICE_NAME = "explorer-api";
export const ETHEREUM_CHAIN_NAME = "LOCAL_ETHEREUM";
export const ETHEREUM_NETWORK_ID = 31337;

export const DEFAULT_VERIFIED_CONTRACT_INSTANCES_DEV: ChicmozL2VerifiedContractInctanceData[] =
  [
    {
      address:
        "0x0e5fe9a23c854f14262bb3b3e88dab8e33412d6db17baa199506f865ed746a0c",
      contractIdentifier: "Some contract name/id",
      details: "This is a dummy verified contract instance",
      creatorName: "Test",
      creatorContact:
        "email: test@test.com, discord: test#1234, telegram: @test",
      appUrl: "https://aztec.network",
      repoUrl: "https://github.com/AztecProtocol/aztec-packages",
    },
  ];

export const DEFAULT_VERIFIED_CONTRACT_INSTANCES_PROD: ChicmozL2VerifiedContractInctanceData[] =
  [
    // TODO: Add verified contract instances for production
  ];
