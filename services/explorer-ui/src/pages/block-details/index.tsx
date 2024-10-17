import { FC } from "react";
import { KeyValueDisplay } from "~/components/info-display/key-value-display";
import { useParams } from "@tanstack/react-router";
import { TxEffectsTable } from "~/components/tx-effects/tx-effects-table";
import { Button } from "~/components/ui";
import { useGetBlockByHeight } from "~/hooks";
import { API_URL, aztecExplorer } from "~/service/constants";
import { getBlockDetails, getTxEffects } from "./util";

const API_ENDPOINT_URL = `${API_URL}/${aztecExplorer.getL2BlockByHash}`;

export const BlockDetails: FC = () => {
  const { blockNumber } = useParams({
    from: "/blocks/$blockNumber",
  });
  const {
    data: latestBlock,
    isLoading,
    error,
  } = useGetBlockByHeight(blockNumber);

  let bn;
  if (blockNumber === "latest") bn = "latest";
  else bn = blockNumber;

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error.message}</p>;
  if (!latestBlock) return <p>No data</p>;

  const apiEndpointUrl = `${API_ENDPOINT_URL}${bn}`;

  return (
    <div className="mx-auto px-[70px] max-w-[1440px]">
      {bn ? (
        <div>
          <div>
            <h2>Block Details</h2>
            <p>{bn}</p>
            <a href={apiEndpointUrl} target="_blank" rel="noreferrer">
              (API Endpoint)
            </a>
          </div>
          <div className="flex flex-col gap-4 mt-8">
            <div className="bg-white rounded-lg shadow-md p-4">
              <KeyValueDisplay data={getBlockDetails(latestBlock)} />
            </div>
            <div className="flex flex-row gap-4 w-10 mb-4">
              <Button 
              variant={"default"}
              className={"shadow-[0px_0px_1px_2px_rgba(0,0,0,1)]"}
              >
                <p>View TxEffects</p>
              </Button>
            </div>
            <TxEffectsTable txEffects={getTxEffects(latestBlock)} />
          </div>
        </div>
      ) : (
        <div>
          <h2>Invalid Block Number</h2>
          <p>Block {blockNumber} not found</p>
        </div>
      )}
    </div>
  );
};
