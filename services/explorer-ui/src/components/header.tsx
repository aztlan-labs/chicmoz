import { Link } from "@tanstack/react-router";
import { AztecLogoWhite } from "~/assets";
import { Input } from "~/components/ui/input";
import { routes } from "~/routes/__root.tsx";

export const Header = () => {
  return (
    <div className="mx-auto px-[70px] mt-10 max-w-[1440px]">
      <div className="flex flex-row w-full items-center bg-purple-light rounded-[40px] pl-10 py-4 pr-4">
        <Link to={routes.home.route} className="mr-auto">
          <AztecLogoWhite />
        </Link>
        <div className="hidden lg:block">
          <Link to={routes.home.route} className="[&.active]:text-white mr-[30px] [&.active]:font-bold text-grey-light hover:text-white">
            {routes.home.title}
          </Link>
          <Link to={routes.blocks.route} className="[&.active]:text-white mr-[30px] [&.active]:font-bold text-grey-light hover:text-white">
            {routes.blocks.title}
          </Link>
          <Link
            to={routes.transactions.route}
            className="[&.active]:text-white mr-[30px] [&.active]:font-bold text-grey-light hover:text-white"
          >
            {routes.transactions.title}
          </Link>
          <Link
            to={routes.contracts.route}
            className="[&.active]:text-white mr-[30px] [&.active]:font-bold text-grey-light hover:text-white"
          >
            {routes.contracts.title}
          </Link>
          <SearchBar />
        </div>
      </div>
    </div>
  );
};

export const SearchBar = () => {
  return (
    <div className="ml-[30px]">
        <Input className="bg-white hidden lg:w-[450px]"/>
    </div>
  );
}