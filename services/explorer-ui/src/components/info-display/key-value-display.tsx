import { FC } from "react";
import { KeyValueRow } from "./key-value-row";

export interface DetailItem {
  label: string;
  value: string;
  isClickable?: boolean;
}

interface KeyValueDisplayProps {
  data: DetailItem[];
}

export const KeyValueDisplay: FC<KeyValueDisplayProps> = ({ data }) => (
  <>
    {data.map((item, index) => (
      <KeyValueRow
        key={index}
        label={item.label}
        value={item.value}
        isLast={index === data.length - 1}
        isClickable={item.isClickable}
      />
    ))}
  </>
);
