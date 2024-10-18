import { Link } from "@tanstack/react-router";
import { FC } from "react";
import { truncateHashString } from "~/lib/create-hash-string";
import { CopyableText } from "../copy-text";

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
  const truncatedValue = isHashSring ? truncateHashString(value) : value;
  return (
    <div
      className={`flex flex-col justify-between gap-2 py-3 ${
        !isLast ? "border-b border-gray-200" : ""
      } md:flex-row md:items-center`}
    >
      <span className="text-gray-600 w-1/3">{label}</span>
      {link ? (
        <Link
          to={link}
          className="text-sm flex-grow text-primary-600 text-primary cursor-pointer"
        >
          {value}
          <span className="ml-1">🔗</span>
        </Link>
      ) : (
        <>
          <span className={`text-sm flex-grow md:text-end`}>
            {isHashSring ? (
              <CopyableText text={truncatedValue} toCopy={value} />
            ) : (
              truncatedValue
            )}
          </span>
        </>
      )}
    </div>
  );
};
