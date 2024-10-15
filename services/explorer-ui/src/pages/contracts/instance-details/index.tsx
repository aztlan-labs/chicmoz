import { useParams } from "@tanstack/react-router";
import { type FC } from "react";
import { KeyValueDisplay } from "~/components/info-display/key-value-display";
import { useContractInstance } from "~/hooks/";
import { API_URL, aztecExplorer } from "~/service/constants";
import { getContractData } from "./util";

export const ContractInstanceDetails: FC = () => {
  let address = "";
  try {
    const params = useParams({
      from: "/contracts/instances/$address",
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    address = params.address;
  } catch (e) {
    // TODO
  }
  const {
    data: contractInstanceDetails,
    isLoading,
    error,
  } = useContractInstance(address);

  if (!address) <div> No contract address</div>;
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;
  if (!contractInstanceDetails) return <div>No data</div>;

  const apiEndpointUrl = `${API_URL}/${aztecExplorer.getL2ContractInstance(
    address
  )}`;

  return (
    <div className="mx-auto px-[70px] max-w-[1440px]">
      <div>
        <div>
          <h2>Contract instance details</h2>
          <a href={apiEndpointUrl} target="_blank" rel="noreferrer">
            (API Endpoint)
          </a>
        </div>
        <div className="flex flex-col gap-4 mt-8">
          <div className="bg-white rounded-lg shadow-md p-4">
            <KeyValueDisplay data={getContractData(contractInstanceDetails)} />
          </div>
        </div>
      </div>
    </div>
  );
};
