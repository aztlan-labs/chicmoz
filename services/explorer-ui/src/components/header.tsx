import { Link, useNavigate } from "@tanstack/react-router";
import { AztecIconWhite, AztecLogoWhite } from "~/assets";
import { Input } from "~/components/ui/input";
import { routes } from "~/routes/__root.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui";
import { ChicmozHomeLink } from "./ui/chicmoz-home-link";

export const Header = () => {
  const navigate = useNavigate();

  const getSelectedItem = (value: string) => {
    void navigate({
      to: value,
    });
  };

  return (
    <div className="mx-auto px-4 mt-10 max-w-[1440px] md:px-[70px]">
      <div className="flex flex-row w-full items-center bg-purple-light rounded-[40px] pl-7 py-4 pr-4 md:pl-10">
        <div className="mr-auto flex flex-row items-center">
          <ChicmozHomeLink textClasses="hidden md:block" />
        </div>

        <div className="md:hidden">
          <Select onValueChange={getSelectedItem}>
            <SelectTrigger className="h-8 w-40 text-gray-50">
              <SelectValue placeholder="Menu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={routes.home.route}>
                {routes.home.title}
              </SelectItem>
              <SelectItem value={routes.blocks.route}>
                {routes.blocks.title}
              </SelectItem>
              <SelectItem value={routes.txEffects.route}>
                {routes.txEffects.title}
              </SelectItem>
              <SelectItem value={routes.contracts.route}>
                {routes.contracts.title}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="hidden md:block">
          <Link
            to={routes.home.route}
            className="[&.active]:text-white mr-[30px] [&.active]:font-bold text-grey-light hover:text-white"
          >
            {routes.home.title}
          </Link>
          <Link
            to={routes.blocks.route}
            className="[&.active]:text-white mr-[30px] [&.active]:font-bold text-grey-light hover:text-white"
          >
            {routes.blocks.title}
          </Link>
          <Link
            to={routes.txEffects.route}
            className="[&.active]:text-white mr-[30px] [&.active]:font-bold text-grey-light hover:text-white"
          >
            {routes.txEffects.title}
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
      <Input className="bg-white hidden lg:w-[450px]" />
    </div>
  );
};
