import { type ChicmozL2ContractInstanceDeluxe } from "@chicmoz-pkg/types";
import { DetailItem } from "~/components/info-display/key-value-display";
import { routes } from "~/routes/__root";
import { API_URL, aztecExplorer } from "~/service/constants";

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
        data.address
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
  DeployerDetails: DetailItem[];
} => {
  return {
    DeployerDetails: [
      {
        label: "url",
        value: "https://example.com",
        extLink: "https://example.com",
      },
      {
        label: "twitter",
        value: "https://twitter.com/example",
        extLink: "https://twitter.com/example",
      },
      {
        label: "github",
        value: "https://github.com/example",
        extLink: "https://github.com/example",
      },
      { label: "creatorname", value: "Mr. Mock" },
      { label: "email", value: "mock@example.com" },
    ],
  };
};
export const getVerifiedContractInstanceData = (
  data: ChicmozL2ContractInstanceDeluxe
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

export const getVerifiedContractInstanceDeploymentData = (
  data: ChicmozL2ContractInstanceDeluxe
) => {
  return data.verifiedDeploymentInfo
    ? [
        {
          label: "ADDRESS",
          value: data.verifiedDeploymentInfo.address,
        },
        {
          label: "SALT",
          value: data.verifiedDeploymentInfo.salt,
        },
        {
          label: "DEPLOYER",
          value: data.verifiedDeploymentInfo.deployer,
        },
        {
          label: "PUBLIC KEYS STRING",
          value: data.verifiedDeploymentInfo.publicKeysString,
        },
        {
          label: "CONSTRUCTOR ARGS",
          value: data.verifiedDeploymentInfo.constructorArgs,
        },
      ]
    : undefined;
};
