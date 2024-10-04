import { type FC } from "react";
import { DataTable } from "~/components/data-table";
import { TxEffectsTableColumns } from "./tx-effects-columns";
import { type TxEffectTableSchema } from "./tx-effects-schema";

interface Props {
  txEffects: TxEffectTableSchema[];
}

export const TxEffectsTable: FC<Props> = ({ txEffects }) => {
  return (
    <section className="relative mx-auto w-full transition-all">
      <DataTable data={txEffects} columns={TxEffectsTableColumns} />
    </section>
  );
};
