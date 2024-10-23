import { FC } from "react";
import { DataTable } from "~/components/data-table";
import { BlockTableColumns } from "./block-table-columns";
import { type BlockTableSchema } from "./blocks-schema";
import { Loader } from "../loader";

interface Props {
  blocks?: BlockTableSchema[];
  isLoading: boolean;
}

export const BlocksTable: FC<Props> = ({ blocks, isLoading }) => {
  if (isLoading) return <Loader amout={5} />;
  if (!blocks) return <div>No data</div>;

  return (
    <section className="relative mx-auto w-full transition-all">
      <DataTable data={blocks} columns={BlockTableColumns} />
    </section>
  );
};
