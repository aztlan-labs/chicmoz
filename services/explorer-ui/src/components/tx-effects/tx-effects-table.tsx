import { type FC } from "react";
import { DataTable } from "~/components/data-table";
import { TxEffectsTableColumns } from "./tx-effects-columns";
import { type TxEffectTableSchema } from "./tx-effects-schema";

interface Props {
  title?: string;
  txEffects?: TxEffectTableSchema[];
  isLoading: boolean;
  error?: Error | null;
  disableSizeSelector?: boolean;
}

export const TxEffectsTable: FC<Props> = ({
  title,
  txEffects,
  isLoading,
  error,
  disableSizeSelector,
}) => {
  if (!txEffects) return <div>No data</div>;
  if (error) return <p className="text-red-500">{error.message}</p>;
  return (
    <section className="relative mx-0 w-full transition-all">
      <DataTable
        isLoading={isLoading}
        title={title}
        data={txEffects}
        columns={TxEffectsTableColumns}
        disableSizeSelector={disableSizeSelector}
      />
    </section>
  );
};
