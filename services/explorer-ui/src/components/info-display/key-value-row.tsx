import { Link } from "@tanstack/react-router";
import { FC } from "react";
import { createHashString } from "~/lib/create-hash-string";

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
}) => {
  const isHashSring = value.includes("0x");
  value = isHashSring ? createHashString(value) : value;
  return (
    <div
      className={`flex flex-col justify-start gap-2 py-3 ${
        !isLast ? "border-b border-gray-200" : ""
      } md:flex-row md:items-center`}
    >
      <span className="text-gray-600 w-full">{label}</span>
      {link ? (
        <Link
          to={link}
          className="text-sm flex-grow text-primary-600 text-primary cursor-pointer"
        >
          {value}
          <span className="ml-1">🔗</span>
        </Link>
      ) : (
        <span
          className={`text-sm flex-grow overflow-hidden md:w-1/3  md:text-end`}
        >
          {value}
        </span>
      )}
    </div>
  );
};
