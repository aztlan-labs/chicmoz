import { useParams } from "@tanstack/react-router";
import { type FC } from "react";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import { KeyValueDisplay } from "~/components/info-display/key-value-display";
import { useContractInstance } from "~/hooks/";
import { getContractData } from "./util";

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

  // TODO: link to a page on verified contracts and what verified means
  const verifiedIcon = contractInstanceDetails.aztecScoutVerified ? (
    <div className="relative group">
      <CheckCircledIcon className="size-10 stroke-lime-700" />
      <div className="absolute hidden group-hover:block bg-gray-800 text-white text-sm rounded py-1 px-2 bottom-full mb-2 left-1/2 transform -translate-x-1/2">
        Contract verified by Aztec Scout
      </div>
    </div>
  ) : (
    <div>Not verified</div>
  );
  return (
    <div className="mx-auto px-[70px] max-w-[1440px]">
      <div className="flex flex-col gap-4 mt-8">
        <div>
          <div>
            <h2 className="flex items-center gap-2">
              Contract instance details {verifiedIcon}
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
      </div>
    </div>
  );
};
