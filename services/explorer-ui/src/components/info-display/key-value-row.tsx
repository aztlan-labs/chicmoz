import { Link } from "@tanstack/react-router";
import { FC } from "react";

interface KeyValueRowProps {
  label: string;
  value: string;
  link?: string;
  isLast?: boolean;
}

export const KeyValueRow: FC<KeyValueRowProps> = ({
  label,
  value,
  isLast,
  link,
}) => (
  <div
    className={`flex items-center py-3 ${
      !isLast ? "border-b border-gray-200" : ""
    }`}
  >
    <span className="text-gray-600 w-1/5">{label}</span>
    {link ? (
      <Link
        to={link}
        className="text-sm flex-grow text-primary-600 text-primary cursor-pointer"
      >
        {value}
        <span className="ml-1">🔗</span>
      </Link>
    ) : (
      <span className={`text-sm flex-grow `}>{value}</span>
    )}
  </div>
);
