import { CheckCircledIcon } from "@radix-ui/react-icons";
import { Link } from "@tanstack/react-router";
import { useParams } from "@tanstack/react-router";
import { type FC } from "react";
import { KeyValueDisplay } from "~/components/info-display/key-value-display";
import { useContractInstance } from "~/hooks/";
import { getContractData, getVerifiedContractData } from "./util";
import { routes } from "~/routes/__root";
import { CustomTooltip } from "~/components/custom-tooltip";

export const ContractInstanceDetails: FC = () => {
  const { address } = useParams({
    from: "/contracts/instances/$address",
  });
  const {
    data: contractInstanceDetails,
    isLoading,
    error,
  } = useContractInstance(address);

  if (!address) <div> No contract address</div>;
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;
  if (!contractInstanceDetails) return <div>No data</div>;

  const verfiedContractData = getVerifiedContractData(contractInstanceDetails);

  return (
    <div className="mx-auto px-[70px] max-w-[1440px]">
      <div className="flex flex-col gap-4 mt-8">
        <div>
          <div>
            <h2 className="flex items-center gap-2">
              Contract instance details
            </h2>
          </div>
          <div className="flex flex-col gap-4 mt-8">
            <div className="bg-white rounded-lg shadow-md p-4">
              <KeyValueDisplay
                data={getContractData(contractInstanceDetails)}
              />
            </div>
          </div>
        </div>
        {verfiedContractData && (
          <div className="mt-20">
            <div>
              <h2 className="flex items-center gap-2">
                Verified contract data
                <div className="relative group">
                  <Link to={routes.verifiedContracts.route}>
                    <CustomTooltip content="Read more about verified contracts here">
                      <CheckCircledIcon className="size-10 stroke-lime-700" />
                    </CustomTooltip>
                  </Link>
                </div>
              </h2>
            </div>
            <div className="flex flex-col gap-4 mt-8">
              <div className="bg-white rounded-lg shadow-md p-4">
                <KeyValueDisplay data={verfiedContractData} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
