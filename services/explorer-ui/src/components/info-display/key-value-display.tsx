import { FC } from "react";
import { KeyValueRow } from "./key-value-row";

export type DisplayData = {
  key: string;
  value: string;
}[];

interface KeyValueDisplayProps {
  data: DisplayData;
}

export const KeyValueDisplay: FC<KeyValueDisplayProps> = ({ data }) => (
  <div className="bg-white rounded-lg shadow-md p-4">
    {data.map((item, index) => (
      <KeyValueRow
        key={index}
        label={item.key}
        value={item.value}
        isLast={index === data.length - 1}
      />
    ))}
  </div>
);
