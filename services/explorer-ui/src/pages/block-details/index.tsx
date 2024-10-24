import { type FC } from "react";
import { KeyValueDisplay } from "~/components/info-display/key-value-display";
import { useParams } from "@tanstack/react-router";
import { TxEffectsTable } from "~/components/tx-effects/tx-effects-table";
import { Button } from "~/components/ui";
import { useGetBlockByHeight, useGetTxEffectsByBlockHeight } from "~/hooks";
import { API_URL, aztecExplorer } from "~/service/constants";
import { getBlockDetails, getTxEffects } from "./util";
import { truncateHashString } from "~/lib/create-hash-string";

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

  const {
    data: blockTxEffects,
    isLoading: txEffectsLoading,
    error: txEffectsError,
  } = useGetTxEffectsByBlockHeight(Number(blockNumber));

  const apiEndpointUrl = `${API_ENDPOINT_URL}${blockNumber}`;

  //TODO: Check for better solution
  if (!latestBlock) return <div> No block hash</div>;

  return (
    <div className="mx-auto px-7 max-w-[1440px] md:px-[70px]">
      <div>
        <div>
          <h2>Block Details</h2>
          <p className="md:hidden">{truncateHashString(latestBlock.hash)}</p>
          <p className="hidden md:block">{latestBlock.hash}</p>
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
          <TxEffectsTable
            txEffects={getTxEffects(blockTxEffects, latestBlock)}
            isLoading={isLoading || txEffectsLoading}
            error={error ?? txEffectsError}
          />
        </div>
      </div>
    </div>
  );
};
