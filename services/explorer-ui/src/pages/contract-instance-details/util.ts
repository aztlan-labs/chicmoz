import { type ChicmozL2ContractInstanceDeluxe } from "@chicmoz-pkg/types";
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
      link: routes.verifiedContracts.route,
    });
  }
  return displayData;
};

export const getVerifiedContractData = (data: ChicmozL2ContractInstanceDeluxe) => {
  return data.verifiedInfo
    ? [
        {
          label: "NAME",
          value: data.verifiedInfo.name,
        },
        {
          label: "DETAILS",
          value: data.verifiedInfo.details.slice(0, 50) + "...",
        },
        {
          label: "CONTACT",
          value: data.verifiedInfo.contact,
        },
        {
          label: "UI URL",
          value: data.verifiedInfo.uiUrl,
          extLink: data.verifiedInfo.uiUrl,
        },
        {
          label: "REPO URL",
          value: data.verifiedInfo.repoUrl,
          extLink: data.verifiedInfo.repoUrl,
        },
      ]
    : undefined;
};
