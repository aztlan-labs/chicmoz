import { Link } from "@tanstack/react-router";
import { AztecIconWhite } from "~/assets";
import { routes } from "~/routes/__root";

export function ChicmozHomeLink({
  className = "",
  textClasses = "",
  iconClasses = "",
}) {
  return (
    <div className={className}>
      <Link to={routes.home.route} className="flex flex-row items-center">
        <AztecIconWhite className={iconClasses} />
        <p className={`${textClasses} text-white ml-1 font-bold text-[24px]`}>
          Chicmoz
        </p>
      </Link>
    </div>
  );
}
