import { Link, useNavigate } from "@tanstack/react-router";
import { Input, SearchInput } from "~/components/ui/input";
import { routes } from "~/routes/__root.tsx";
import { Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearch } from "~/hooks/search";
import { Button } from "./ui";
import { ChicmozHomeLink } from "./ui/chicmoz-home-link";

export const Header = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [hasNoResults, setHasNoResults] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const navigationItems = [
    { name: routes.home.title, path: routes.home.route },
    { name: routes.blocks.title, path: routes.blocks.route },
    { name: routes.txEffects.title, path: routes.txEffects.route },
    { name: routes.contracts.title, path: routes.contracts.route },
  ];
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
          to: `/contracts/classes/${contractClass.contractClassId}/versions/${contractClass.version}`,
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

  const handleSearch = () => {
    void refetch();
  };

  return (
    <div className="mx-auto px-4 mt-10 max-w-[1440px] md:px-[70px]">
      <div className="flex flex-row w-full items-center bg-purple-light rounded-[40px] py-4 pr-4 md:pl-10">
        <div
          className={`w-full transition-all duration-300 ease-in-out 
          ${isMenuOpen ? "rounded-b-3xl" : ""}`}
        >
          {/* Header */}
          <div className="max-w-7xl w-full mx-auto">
            {/* Desktop Navigation */}
            <div className="hidden md:flex md:w-full md:items-center md:justify-between ">
              <ChicmozHomeLink textClasses="hidden md:block" />
              <div className="flex  justify-center items-center">
                <SearchInput
                  placeholder="Search"
                  onIconClick={handleSearch}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  onChange={(e) => handleOnChange(e.target.value)}
                  isLoading={isLoading}
                  noResults={hasNoResults}
                />
              </div>

              <div className="flex space-x-6 justify-center items-center">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="text-secondary hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Navigation Header */}
            <div className="md:hidden flex items-center justify-between w-full px-4">
              <ChicmozHomeLink textClasses="block md:hidden" />
              <div className="flex items-center justify-between space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-transparent"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <span className="flex items-center">
                    {isMenuOpen ? (
                      <X className="h-6 w-6 mr-2" />
                    ) : (
                      <Menu className="h-6 w-6 mr-2" />
                    )}
                    Menu
                  </span>
                </Button>
              </div>
            </div>

            {/* Mobile Menu Content */}
            <div
              className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out
              ${
                isMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-4 py-4 space-y-6">
                {/* Search bar */}
                <div className="relative">
                  <Input
                    type="search"
                    placeholder="Search"
                    className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/70 h-12"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/70" />
                </div>

                {/* Navigation Items */}
                <div className="flex flex-col space-y-4">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-white text-lg py-1 hover:bg-white/10 transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide-down Search Bar for Mobile */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out
          ${isSearchVisible ? "max-h-20 opacity-100" : "max-h-0 opacity-0"}`}
        >
          <div className="px-4 py-2">
            <Input
              type="search"
              placeholder="Search"
              className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/70 h-12"
              autoFocus
            />
          </div>
        </div>
      </div>
    </div>
  );
};
