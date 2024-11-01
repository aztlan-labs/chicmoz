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
      <Link to={routes.home.route} className="flex flex-col items-center">
        <div className="flex items-center">
          <AztecIconWhite className={iconClasses} />
          <p className={`${textClasses} text-white ml-1 font-bold text-[24px]`}>
            Chicmoz
          </p>
        </div>
        <p className="text-xs text-white">Aztec Block Explorer</p>
      </Link>
    </div>
  );
}
