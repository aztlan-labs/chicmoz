import { useMemo, type FC } from "react";
import { BlocksTable } from "~/components/blocks/blocks-table";
import { TxEffectsTable } from "~/components/tx-effects/tx-effects-table";
import { useGetTxEffectsByBlockHeightRange, useLatestBlocks } from "~/hooks";
import {
  useAvarageBlockTime,
  useAvarageFees,
  useTotalContracts,
  useTotalContractsLast24h,
  useTotalTxEffects,
  useTotalTxEffectsLast24h,
} from "~/hooks/stats";
import { mapLatestBlocks, parseTxEffectsData } from "./util";
import { InfoBadge } from "~/components/info-badge";
import { formatDuration, formatFees } from "~/lib/utils";
import { useGetPendingTxs } from "~/hooks/tx";
import { TxEffectTableSchema } from "~/components/tx-effects/tx-effects-schema";

export const Landing: FC = () => {
  const { data: latestBlocks, isLoading, error } = useLatestBlocks();
  const {
    data: totalTxEffects,
    isLoading: loadingTotalEffects,
    error: errorTotalEffects,
  } = useTotalTxEffects();
  const {
    data: totalTxEffects24h,
    isLoading: loadingTotalEffects24h,
    error: errorTotalEffects24h,
  } = useTotalTxEffectsLast24h();
  const {
    data: avarageFees,
    isLoading: loadingAvarageFees,
    error: errorAvarageFees,
  } = useAvarageFees();
  const {
    data: totalAmountOfContracts,
    isLoading: loadingAmountContracts,
    error: errorAmountContracts,
  } = useTotalContracts();
  const {
    data: totalAmountOfContracts24h,
    isLoading: loadingAmountContracts24h,
    error: errorAmountContracts24h,
  } = useTotalContractsLast24h();
  const {
    data: avarageBlockTime,
    isLoading: loadingAvarageBlockTime,
    error: errorAvarageBlockTime,
  } = useAvarageBlockTime();

  const latestTxEffectsData = useGetTxEffectsByBlockHeightRange(
    latestBlocks?.at(-1)?.height,
    latestBlocks?.at(0)?.height
  );

  const { data: pendingTxs } = useGetPendingTxs();

  const {
    isLoadingTxEffects,
    txEffectsErrorMsg: txEffectsError,
    latestTxEffects,
  } = parseTxEffectsData(latestTxEffectsData, latestBlocks);

  const latestTxEffectsWithPending = useMemo(() => {
    const disguisedPendingTxs = pendingTxs?.reduce((acc, tx) => {
      if (!latestTxEffects.some((effect) => effect.txHash === tx.hash)) {
        acc.push({
          hash: "0x00000000",
          txHash: tx.hash,
          transactionFee: -1,
          totalLengthOfLogs: -1,
          blockNumber: -1,
          timestamp: tx.birthTimestamp ?? 0,
        });
      }
      return acc;
    }, [] as TxEffectTableSchema[]) ?? [];
    return [...disguisedPendingTxs, ...latestTxEffects];
  }, [pendingTxs, latestTxEffects]);

  const averageBlockTimeFormatted = formatDuration(
    Number(avarageBlockTime) / 1000,
    true
  );

  const formattedFees = formatFees(avarageFees);

  return (
    <div className="mx-auto px-5 max-w-[1440px] md:px-[70px]">
      <div className="grid grid-cols-2 gap-3 mt-5 mb-5 md:grid-cols-3 md:gap-5 ">
        <InfoBadge
          title="Total transactions"
          isLoading={loadingTotalEffects}
          error={errorTotalEffects}
          data={totalTxEffects}
        />
        <InfoBadge
          title="Total Contract Classes"
          isLoading={loadingAmountContracts}
          error={errorAmountContracts}
          data={totalAmountOfContracts}
        />
        <InfoBadge
          title={`Average fees (${formattedFees.denomination} FPA)`}
          isLoading={loadingAvarageFees}
          error={errorAvarageFees}
          data={formattedFees.value}
        />
        <InfoBadge
          title="Total transactions last 24h"
          isLoading={loadingTotalEffects24h}
          error={errorTotalEffects24h}
          data={totalTxEffects24h}
        />
        <InfoBadge
          title="Total Contract Classes last 24h"
          isLoading={loadingAmountContracts24h}
          error={errorAmountContracts24h}
          data={totalAmountOfContracts24h}
        />
        <InfoBadge
          title="Average block time"
          isLoading={loadingAvarageBlockTime}
          error={errorAvarageBlockTime}
          data={averageBlockTimeFormatted}
        />
      </div>
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="bg-white w-full rounded-lg shadow-md p-4 md:w-1/2">
          <h3>Latest Blocks</h3>
          <BlocksTable
            blocks={mapLatestBlocks(latestBlocks)}
            isLoading={isLoading}
            error={error}
          />
        </div>
        <div className="bg-white w-full rounded-lg shadow-md p-4 md:w-1/2">
          <h3>Latest TX-Effects</h3>
          <TxEffectsTable
            txEffects={latestTxEffectsWithPending}
            isLoading={isLoadingTxEffects}
            error={txEffectsError}
          />
        </div>
      </div>
    </div>
  );
};
