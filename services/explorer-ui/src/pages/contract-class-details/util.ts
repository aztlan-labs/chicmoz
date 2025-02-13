import { type ChicmozL2ContractClassRegisteredEvent } from "@chicmoz-pkg/types";
import { routes } from "~/routes/__root";
import { API_URL, aztecExplorer } from "~/service/constants";

export const getContractClassKeyValueData = (
  data: ChicmozL2ContractClassRegisteredEvent
) => [
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
  },
  {
    label: "ARTIFACT HASH",
    value: data.artifactHash,
  },
  {
    label: "PRIVATE FUNCTIONS ROOT",
    value: data.privateFunctionsRoot,
  },
  {
    label: "API ENDPOINT",
    value: "View raw data",
    extLink: `${API_URL}/${aztecExplorer.getL2ContractClassByIdAndVersion(
      data.contractClassId,
      data.version.toString()
    )}`,
  },
  {
    label: "IS TOKEN CONTRACT",
    value: data.isToken ? "✅" : "❌",
  },
  {
    label: "WHY NOT TOKEN",
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    value: data.whyNotToken ? data.whyNotToken : "N/A",
  },
];
