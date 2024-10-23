import { Link, useNavigate } from "@tanstack/react-router";
import { SearchInput } from "~/components/ui/input";
import { routes } from "~/routes/__root.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui";
import { ChicmozHomeLink } from "./ui/chicmoz-home-link";
import { useEffect, useState } from "react";
import { useSearch } from "~/hooks/search";

export const Header = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [hasNoResults, setHasNoResults] = useState(false);
  const { data, isLoading, error, refetch, isSuccess, fetchStatus } =
    useSearch(searchValue);

  useEffect(() => {
    if (data) {
      const [block] = data.results.blocks;
      const [txEffect] = data.results.txEffects;
      const [instance] = data.results.contractInstances;
      const [contractClass] = data.results.registeredContractClasses;

      if (block) {
        void navigate({ to: `/blocks/${block.hash}` });
      } else if (txEffect) {
        void navigate({ to: `/tx-effects/${txEffect.hash}` });
      } else if (instance) {
        void navigate({ to: `/contracts/instances/${instance.address}` });
      } else if (contractClass) {
        void navigate({
          to: `/contracts/classes/${contractClass.contractClassId}`,
        });
      } else if (Object.values(data.results).every((arr) => !arr.length)) {
        setHasNoResults(true);
      }
    }
    if (error) setHasNoResults(true);
    if (!data && isSuccess) setHasNoResults(true);
  }, [data, error, isSuccess, navigate, fetchStatus]);

  const handleOnChange = (value: string) => {
    setHasNoResults(false);
    setSearchValue(value);
  };
  const getSelectedItem = (value: string) => {
    void navigate({
      to: value,
    });
  };

  const handleSearch = () => {
    void refetch();
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

        <div className="hidden md:flex flex-row justify-center items-center">
          <SearchInput
            placeholder="Search"
            onIconClick={handleSearch}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            onChange={(e) => handleOnChange(e.target.value)}
            isLoading={isLoading}
            noResults={hasNoResults}
          />
          <Link
            to={routes.home.route}
            className="[&.active]:text-white mr-8 [&.active]:font-bold text-grey-light hover:text-white md:mr-4"
          >
            {routes.home.title}
          </Link>
          <Link
            to={routes.blocks.route}
            className="[&.active]:text-white mr-8 [&.active]:font-bold text-grey-light hover:text-white md:mr-4"
          >
            {routes.blocks.title}
          </Link>
          <Link
            to={routes.txEffects.route}
            className="[&.active]:text-white mr-8 [&.active]:font-bold text-grey-light hover:text-white md:mr-4"
          >
            {routes.txEffects.title}
          </Link>
          <Link
            to={routes.contracts.route}
            className="[&.active]:text-white mr-8 [&.active]:font-bold text-grey-light hover:text-white md:mr-4"
          >
            {routes.contracts.title}
          </Link>
        </div>
      </div>
    </div>
  );
};
