import { FC } from "react";
import { KeyValueDisplay } from "~/components/info-display/key-value-display";
import { useParams } from "@tanstack/react-router";
import { TxEffectsTable } from "~/components/tx-effects/tx-effects-table";
import { Button } from "~/components/ui";
import { useGetBlockByHeight } from "~/hooks";
import { API_URL, aztecExplorer } from "~/service/constants";
import { getBlockDetails, getTxEffects } from "./util";
import { createHashString } from "~/lib/create-hash-string";

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

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error.message}</p>;
  if (!latestBlock) return <p>No data</p>;

  const apiEndpointUrl = `${API_ENDPOINT_URL}${blockNumber}`;

  return (
    <div className="mx-auto px-7 max-w-[1440px] md:px-[70px]">
      <div>
        <div>
          <h2>Block Details</h2>
          <p>{createHashString(latestBlock.hash)}</p>
          <a href={apiEndpointUrl} target="_blank" rel="noreferrer">
            (API Endpoint)
          </a>
        </div>
        <div className="flex flex-col gap-4 mt-8">
          <div className="bg-white rounded-lg shadow-md p-4">
            <KeyValueDisplay data={getBlockDetails(latestBlock)} />
          </div>
          <div className="flex flex-row gap-4 w-10 mb-4">
            <Button variant={"default"}>
              <p>View TxEffects</p>
            </Button>
            <Button variant={"default"}>View TxEffects</Button>
          </div>
          <TxEffectsTable txEffects={getTxEffects(latestBlock)} />
        </div>
      </div>
    </div>
  );
};
