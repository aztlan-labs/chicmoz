import { type FC } from "react";
import { DataTable } from "~/components/data-table";
import { TxEffectsTableColumns } from "./tx-effects-columns";
import { type TxEffectTableSchema } from "./tx-effects-schema";
import { Loader } from "../loader";

interface Props {
  txEffects?: TxEffectTableSchema[];
  isLoading: boolean;
  error?: Error | null;
}

export const TxEffectsTable: FC<Props> = ({ txEffects, isLoading, error }) => {
  if (isLoading) return <Loader amout={5} />;
  if (!txEffects) return <div>No data</div>;
  if (error) return <p className="text-red-500">{error.message}</p>;
  return (
    <section className="relative mx-0 w-full transition-all">
      <DataTable data={txEffects} columns={TxEffectsTableColumns} />
    </section>
  );
};
