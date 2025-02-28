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
  TEXTAREA = "textarea",
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
  else if (label === "data") displayType = DisplayType.TEXTAREA;
  else if (value.startsWith("0x")) displayType = DisplayType.HEX;
  else if (extLink) displayType = DisplayType.EXTERNAL_LINK;

  const commonTextClasses = "text-sm flex-grow text-end justify-end";
  return (
    <div
      key={label}
      className={`flex items-center gap-2 py-3 ${
        !isLast ? "border-b border-gray-200" : ""
      }`}
    >
      <span className="text-gray-600 w-1/3">{label}</span>
      {displayType === DisplayType.TEXT && (
        <span className={commonTextClasses}>{value}</span>
      )}
      {displayType === DisplayType.LINK && (
        <Link
          to={link}
          className={`${commonTextClasses} text-primary-600 text-primary cursor-pointer`}
        >
          {value.startsWith("0x") ? truncateHashString(value) : value}
          <span className="ml-1">🔗</span>
        </Link>
      )}
      {displayType === DisplayType.HEX && (
        <span className={commonTextClasses}>
          <CopyableText
            text={truncateHashString(value)}
            toCopy={value}
            additionalClassesIcon="justify-end"
          />
        </span>
      )}
      {displayType === DisplayType.EXTERNAL_LINK && (
        <a
          href={extLink}
          target="_blank"
          rel="noreferrer"
          className={`${commonTextClasses} text-primary-600 text-primary cursor-pointer`}
        >
          {value}
          <span className="ml-1">↗️</span>
        </a>
      )}
      {displayType === DisplayType.TEXTAREA && (
        <CopyableText text={value} toCopy={value} textArea />
      )}
    </div>
  );
};
