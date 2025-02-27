import { type FC } from "react";
import { type SimpleArtifactData, type SimplifiedViewOfFunc } from "../util";

interface JsonTabProps {
  data: SimpleArtifactData | SimplifiedViewOfFunc;
}
export const JsonTab: FC<JsonTabProps> = ({ data }) => {
  return <pre className="overflow-auto">{JSON.stringify(data, null, 2)}</pre>;
};
