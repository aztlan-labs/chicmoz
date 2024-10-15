import { type ChicmozL2ContractInstanceDeluxe } from "@chicmoz-pkg/types";

export const getContractData = (data: ChicmozL2ContractInstanceDeluxe) => [
  {
    label: "ADDRESS",
    value: data.address,
  },
  {
    label: "BLOCK HASH",
    value: data.blockHash,
    link: `/blocks/${data.blockHash}`,
  },
  { label: "VERSION", value: data.version.toString() },
  { label: "DEPLOYER", value: data.deployer },
];
