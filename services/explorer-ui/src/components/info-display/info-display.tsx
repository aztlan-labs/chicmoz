import { FC } from "react";
import { KeyValueDisplay } from "./key-value-display";

interface InfoDisplayProps {
  blockData: {
    key: string;
    value: string;
  }[];
}

const InfoDisplay: FC<InfoDisplayProps> = ({ blockData }) => {
  return (
    <div className="p-4">
      <KeyValueDisplay data={blockData} />
    </div>
  );
};
