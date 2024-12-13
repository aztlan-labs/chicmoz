import { ChicmozL2VerifiedContractAddressData } from "@chicmoz-pkg/types";

export const CHAIN_NAME = "AZTEC";
export const SERVICE_NAME = "explorer-api";

export const DEFAULT_VERIFIED_CONTRACT_ADDRESSES_DEV: ChicmozL2VerifiedContractAddressData[] =
  [
    {
      contractInstanceAddress:
        "0x0e5fe9a23c854f14262bb3b3e88dab8e33412d6db17baa199506f865ed746a0c",
      name: "Deployed by Sandbox",
      details:
        "This contract was deployed by the sandbox environment. Hardcoded address is at least valid for 0.66.0",
      contact: "email: test@test.com, discord: test#1234, telegram: @test",
      uiUrl: "https://aztec.network",
      repoUrl: "https://github.com/AztecProtocol/aztec-packages",
    },
  ];

export const DEFAULT_VERIFIED_CONTRACT_ADDRESSES_PROD: ChicmozL2VerifiedContractAddressData[] =
  [
    // TODO: Add verified contract addresses for production
  ];
