import { FC } from "react";
import { DataTable } from "~/components/data-table";
import { TxEffectsTableColumns } from "./tx-effects-columns";
import { type TxEffectsTableSchema } from "./tx-effects-schema";

interface Props {
  txEffects: TxEffectsTableSchema[];
}

export const TxEffectsTable: FC<Props> = ({ txEffects }) => {
  return (
    <section className="relative mx-auto w-full transition-all">
      <DataTable data={txEffects} columns={TxEffectsTableColumns} />
    </section>
  );
};
