import { FC } from "react";
import { DataTable } from "~/components/data-table";
import { BlockTableColumns } from "./block-table-columns";
import { type BlockTableSchema } from "./blocks-schema";

interface Props {
  blocks: BlockTableSchema[];
}

export const BlocksTable: FC<Props> = ({ blocks }) => {
  return (
    <section className="relative mx-auto w-full transition-all">
      <DataTable data={blocks} columns={BlockTableColumns} />
    </section>
  );
};

