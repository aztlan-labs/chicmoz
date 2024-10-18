import { type ChicmozL2ContractClassRegisteredEvent } from "@chicmoz-pkg/types";
import { routes } from "~/routes/__root";

export const getContractData = (
  data: ChicmozL2ContractClassRegisteredEvent
): { label: string; value: string; link?: string }[] => [
  {
    label: "BLOCK HASH",
    value: data.blockHash,
    link: `${routes.blocks.route}/${data.blockHash}`,
  },
  {
    label: "CLASS ID",
    value: data.contractClassId,
  },
  {
    label: "VERSION",
    value: data.version.toString(),
    // TODO: link: `${routes.contracts.route}/${routes.contracts.children.classes.route}/${data.contractClassId}/routes.contracts.children.versions.route/${data.version}`,
  },
  {
    label: "ARTIFACT HASH",
    value: data.artifactHash,
  },
  {
    label: "PRIVATE FUNCTIONS ROOT",
    value: data.privateFunctionsRoot,
  },
];
