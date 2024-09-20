import { FC } from "react";

interface KeyValueRowProps {
  label: string;
  value: string;
  isClickable?: boolean;
  isLast?: boolean;
}

export const KeyValueRow: FC<KeyValueRowProps> = ({
  label,
  value,
  isLast,
  isClickable = false,
}) => (
  <div
    className={`flex items-center py-3 ${
      !isLast ? "border-b border-gray-200" : ""
    }`}
  >
    <span className="text-gray-600 w-1/5">{label}</span>
    <span
      className={`text-sm flex-grow ${
        isClickable ? "text-blue-600 cursor-pointer" : ""
      }`}
    >
      {value}
      {isClickable && <span className="ml-1">🔗</span>}
    </span>
  </div>
);
