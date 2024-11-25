import { Link } from "@tanstack/react-router";
import { type FC } from "react";
import { truncateHashString } from "~/lib/create-hash-string";
import { CopyableText } from "../copy-text";

interface KeyValueRowProps {
  label: string;
  value: string;
  link?: string;
  isLast?: boolean;
  extLink?: string;
}

enum DisplayType {
  TEXT = "text",
  LINK = "link",
  HEX = "hex",
  EXTERNAL_LINK = "external-link",
}

export const KeyValueRow: FC<KeyValueRowProps> = ({
  label,
  value,
  isLast,
  link,
  extLink,
}) => {
  let displayType = DisplayType.TEXT;
  if (link) displayType = DisplayType.LINK;
  else if (value.startsWith("0x")) displayType = DisplayType.HEX;
  else if (extLink) displayType = DisplayType.EXTERNAL_LINK;

  return (
    <div
      key={label}
      className={`flex flex-col justify-between gap-2 py-3 ${
        !isLast ? "border-b border-gray-200" : ""
      } md:flex-row md:items-center`}
    >
      <span className="text-gray-600 w-1/3">{label}</span>
      {displayType === DisplayType.TEXT && (
        <span className={`text-sm flex-grow md:text-end`}>{value}</span>
      )}
      {displayType === DisplayType.LINK && (
        <Link
          to={link}
          className="text-sm flex-grow text-primary-600 text-primary cursor-pointer md:text-end"
        >
          {value}
          <span className="ml-1">🔗</span>
        </Link>
      )}
      {displayType === DisplayType.HEX && (
        <span className={`text-sm flex-grow md:text-end`}>
          <CopyableText
            text={truncateHashString(value)}
            toCopy={value}
            additionalClasses="md:justify-end md:text-end"
          />
        </span>
      )}
      {displayType === DisplayType.EXTERNAL_LINK && (
        <a
          href={extLink}
          target="_blank"
          rel="noreferrer"
          className="text-sm flex-grow text-primary-600 text-primary cursor-pointer md:text-end"
        >
          {value}
          <span className="ml-1">↗️</span>
        </a>
      )}
    </div>
  );
};
