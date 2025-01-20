import { CheckCircledIcon } from "@radix-ui/react-icons";
import { Link } from "@tanstack/react-router";
import { useParams } from "@tanstack/react-router";
import { type FC } from "react";
import { KeyValueDisplay } from "~/components/info-display/key-value-display";
import { useContractInstance } from "~/hooks/";
import { getContractData, getVerifiedContractInstanceData } from "./util";
import { routes } from "~/routes/__root";
import { CustomTooltip } from "~/components/custom-tooltip";
import {useSubTitle} from "~/hooks/sub-title";

export const ContractInstanceDetails: FC = () => {
  const { address } = useParams({
    from: "/contracts/instances/$address",
  });
  useSubTitle(`Ctrct inst ${address}`);
  const {
    data: contractInstanceDetails,
    isLoading,
    error,
  } = useContractInstance(address);

  if (!address) <div> No contract address</div>;
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;
  if (!contractInstanceDetails) return <div>No data</div>;

  const verfiedData = getVerifiedContractInstanceData(contractInstanceDetails);

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
        {verfiedData && (
          <div className="mt-20">
            <div>
              <h2 className="flex items-center gap-2">
                Verified contract instance data
                <div className="relative group">
                  <Link to={routes.verifiedContractInstances.route}>
                    <CustomTooltip content="Read more about verified contract instances here">
                      <CheckCircledIcon className="size-10 stroke-lime-700" />
                    </CustomTooltip>
                  </Link>
                </div>
              </h2>
            </div>
            <div className="flex flex-col gap-4 mt-8">
              <div className="bg-white rounded-lg shadow-md p-4">
                <KeyValueDisplay data={verfiedData} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
