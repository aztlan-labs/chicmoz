import { type FC } from "react";
import { KeyValueDisplay } from "~/components/info-display/key-value-display";
import { useParams } from "@tanstack/react-router";
import { TxEffectsTable } from "~/components/tx-effects/tx-effects-table";
import { Button } from "~/components/ui";
import { useGetBlockByIdentifier, useGetTxEffectsByBlockHeight } from "~/hooks";
import { getBlockDetails, getTxEffects } from "./util";
import {useSubTitle} from "~/hooks/sub-title";

export const BlockDetails: FC = () => {
  const { blockNumber } = useParams({
    from: "/blocks/$blockNumber",
  });
  useSubTitle(`Block ${blockNumber}`);
  const {
    data: latestBlock,
    isLoading,
    error,
  } = useGetBlockByIdentifier(blockNumber);

  const height = latestBlock?.height;
  const {
    data: blockTxEffects,
    isLoading: txEffectsLoading,
    error: txEffectsError,
  } = useGetTxEffectsByBlockHeight(height);

  //TODO: Check for better solution
  if (!latestBlock) return <div> No block hash</div>;

  return (
    <div className="mx-auto px-7 max-w-[1440px] md:px-[70px]">
      <div>
        <div>
          <h2>
            Block Details{" "}
          </h2>
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
          <div className="rounded-lg shadow-lg">
            <TxEffectsTable
              txEffects={getTxEffects(blockTxEffects, latestBlock)}
              isLoading={
                isLoading ||
                txEffectsLoading ||
                blockTxEffects?.length !== latestBlock.body?.txEffects?.length
              }
              error={error ?? txEffectsError}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
