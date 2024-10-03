import { FC } from "react";
import { KeyValueDisplay } from "~/components/info-display/key-value-display";
import { useContractInstance } from "~/hooks/";
import { useParams } from "@tanstack/react-router";
import { getContractData } from "./util";

export const ContractDetails: FC = () => {
  const { contractAddress } = useParams({
    from: "/contracts/$contractAddress",
  });
  const {
    data: contractDetails,
    isLoading,
    error,
  } = useContractInstance(contractAddress);

  if (!contractAddress) <div> No transaction id</div>;
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;
  if (!contractDetails) return <div>No data</div>;

  return (
    <div className="mx-auto px-[70px] max-w-[1440px]">
      <div>
        <div>
          <h2>Contract details</h2>
        </div>
        <div className="flex flex-col gap-4 mt-8">
          <div className="bg-white rounded-lg shadow-md p-4">
            <KeyValueDisplay data={getContractData(contractDetails)} />
          </div>
        </div>
      </div>
    </div>
  );
};
