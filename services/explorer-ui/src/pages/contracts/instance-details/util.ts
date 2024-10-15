import { type ChicmozL2ContractInstanceDeluxe } from "@chicmoz-pkg/types";
import {routes} from "~/routes/__root";

export const getContractData = (data: ChicmozL2ContractInstanceDeluxe) => [
  {
    label: "ADDRESS",
    value: data.address,
  },
  {
    label: "CLASS ID",
    value: data.contractClassId,
    link: `${routes.contracts.route}${routes.contracts.children.classes.route}/${data.contractClassId}`,
  },
  {
    label: "BLOCK HASH",
    value: data.blockHash,
    link: `/blocks/${data.blockHash}`,
  },
  { label: "VERSION", value: data.version.toString() },
  { label: "DEPLOYER", value: data.deployer },
];
