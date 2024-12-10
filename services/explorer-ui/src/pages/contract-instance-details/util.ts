import { type ChicmozL2ContractInstanceDeluxe } from "@chicmoz-pkg/types";
import { routes } from "~/routes/__root";
import { API_URL, aztecExplorer } from "~/service/constants";

const HARDCODED_DEPLOYER = "0x0000000000000000000000000000000000000000000000000000000000000000";

export const getContractData = (data: ChicmozL2ContractInstanceDeluxe) => {
  const link = `${routes.contracts.route}${routes.contracts.children.classes.route}/${data.contractClassId}/versions/${data.version}`;
  const isVerified = data.aztecScoutVerified ?? (process.env.NODE_ENV === "development" && data.deployer === HARDCODED_DEPLOYER);
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
      value: `/${aztecExplorer.getL2ContractInstance(data.address)}`,
      extLink: `${API_URL}/${aztecExplorer.getL2ContractInstance(data.address)}`,
    },
  ];
  if (isVerified) {
    displayData.push({
      label: "VERIFIED ✅",
      value: "Contract deployer verified by Aztec Scout.",
      link: routes.verifiedContracts.route,
    });
  }
  return displayData;
};
