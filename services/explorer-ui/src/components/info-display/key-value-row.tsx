import { FC } from "react";

interface KeyValueRowProps {
  label: string;
  value: string;
  isLast?: boolean;
}

export const KeyValueRow: FC<KeyValueRowProps> = ({ label, value, isLast }) => (
  <div
    className={`flex items-center py-3 ${
      !isLast ? "border-b border-gray-200" : ""
    }`}
  >
    <span className="text-gray-600 w-1/5">{label}</span>
    <span className="font-medium text-right">{value}</span>
  </div>
);
