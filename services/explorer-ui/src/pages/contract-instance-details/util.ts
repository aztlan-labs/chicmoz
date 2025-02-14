import { type ChicmozL2ContractInstanceDeluxe } from "@chicmoz-pkg/types";
import { routes } from "~/routes/__root";
import { API_URL, aztecExplorer } from "~/service/constants";
import { ContactDetailsData, VerifiedDeploymentData } from "./types";

const HARDCODED_DEPLOYER =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

export const getContractData = (data: ChicmozL2ContractInstanceDeluxe) => {
  const link = `${routes.contracts.route}${routes.contracts.children.classes.route}/${data.contractClassId}/versions/${data.version}`;
  const displayData = [
    {
      label: "ADDRESS",
      value: data.address,
    },
    {
      label: "CLASS ID",
      value: data.contractClassId,
      link,
    },
    {
      label: "BLOCK HASH",
      value: data.blockHash,
      link: `/blocks/${data.blockHash}`,
    },
    { label: "VERSION", value: data.version.toString(), link },
    { label: "DEPLOYER", value: data.deployer },
    {
      label: "RAW DATA",
      value: "View raw data",
      extLink: `${API_URL}/${aztecExplorer.getL2ContractInstance(
        data.address,
      )}`,
    },
  ];
  const isDeployerContract =
    process.env.NODE_ENV === "development" &&
    data.deployer === HARDCODED_DEPLOYER;
  if (isDeployerContract && !data.verifiedInfo) {
    displayData.push({
      label: "DEPLOYER CONTRACT 🤖",
      value:
        "This is a contract deployed by the hard-coded deployer. This message will only appear in development mode. But linking to verified contracts for good measure.",
      link: routes.verifiedContractInstances.route,
    });
  }
  return displayData;
};

export const tempVerifiedContractInstanceData = (): {
  contractDetails: VerifiedDeploymentData;
  DeployerDetails: ContactDetailsData;
} => {
  return {
    contractDetails: {
      deployer: {
        data: [
          {
            label: "address",
            value:
              "0x0000000000000000000000000000000000000000000000000000000000000000",
          },
        ],
      },
      salt: { data: [{ label: "value", value: "0eieieieie" }] },
      publicKeys: {
        data: [
          {
            label: "address 1",
            value:
              "0x0000000000000000000000000000000000000000000000000000000000000000",
          },
          {
            label: "address 2",
            value:
              "0x0000000000000000000000000000000000000000000000000000000000000000",
          },
        ],
      },
      args: {
        data: [
          {
            label: "Token name",
            value: "Aztec Hackerhouse Token",
          },
          {
            label: "Token Ticker",
            value: "AHT",
          },
        ],
      },
    },
    DeployerDetails: {
      appWebsiteUrl: {
        data: [
          {
            label: "url",
            value: "https://aztec.network",
            extLink: "aztec.network",
          },
        ],
      },
      externalUrls: {
        data: [
          {
            label: "twitter",
            value: "https://twitter.com/aztecnetwork",
            extLink: "https://twitter.com/aztecnetwork",
          },
          {
            label: "github",
            value: "https://github.com/AztecProtocol",
            extLink: "https://github.com/AztecProtocol",
          },
        ],
      },
      creatorName: { data: [{ label: "name", value: "Aztec Network" }] },
      contact: {
        data: [{ label: "email", value: "help@aztec.ui" }],
      },
    },
  };
};

export const getVerifiedContractInstanceData = (
  data: ChicmozL2ContractInstanceDeluxe,
) => {
  return data.verifiedInfo
    ? [
      {
        label: "CONTRACT IDENTIFIER",
        value: data.verifiedInfo.contractIdentifier,
      },
      {
        label: "DETAILS",
        value: data.verifiedInfo.details.slice(0, 50) + "...",
      },
      {
        label: "CREATOR NAME",
        value: data.verifiedInfo.creatorName,
      },
      {
        label: "CREATOR CONTACT",
        value: data.verifiedInfo.creatorContact,
      },
      {
        label: "APP URL",
        value: data.verifiedInfo.appUrl,
        extLink: data.verifiedInfo.appUrl,
      },
      {
        label: "REPO URL",
        value: data.verifiedInfo.repoUrl,
        extLink: data.verifiedInfo.repoUrl,
      },
    ]
    : undefined;
};
