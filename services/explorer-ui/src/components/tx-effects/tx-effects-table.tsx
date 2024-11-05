import { type FC } from "react";
import { DataTable } from "~/components/data-table";
import { TxEffectsTableColumns } from "./tx-effects-columns";
import { Loader } from "../loader";
import { useGetTxEffectsByBlockHeight } from "~/hooks";
import { getTxEffects } from "~/pages/block-details/util";

interface Props {
  blockHeight: number;
  blockTimestamp: number;
}

export const TxEffectsTable: FC<Props> = ({ blockHeight, blockTimestamp }) => {
  const { data, isLoading, error } = useGetTxEffectsByBlockHeight(blockHeight);
  if (isLoading) return <Loader amount={5} />;
  const txEffects = getTxEffects(data, {
    height: blockHeight,
    timestamp: blockTimestamp,
  });
  if (!txEffects) return <div>No data</div>;
  if (error) return <p className="text-red-500">{error.message}</p>;
  return (
    <section className="relative mx-0 w-full transition-all">
      <DataTable data={txEffects} columns={TxEffectsTableColumns} />
    </section>
  );
};
