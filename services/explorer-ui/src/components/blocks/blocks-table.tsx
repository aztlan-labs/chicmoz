import { FC } from "react";
import { DataTable } from "~/components/data-table";
import { BlockTableColumns } from "./block-table-columns";
import { type BlockTableSchema } from "./blocks-schema";
import { Loader } from "../loader";

interface Props {
  blocks?: BlockTableSchema[];
  isLoading: boolean;
  error?: Error | null;
}

// TODO: Maybe make this a generic component
export const BlocksTable: FC<Props> = ({ blocks, isLoading, error }) => {
  if (isLoading) return <Loader amount={5} />;
  if (!blocks) return <div>No data</div>;
  if (error) return <p className="text-red-500">{error.message}</p>;

  return (
    <section className="relative mx-auto w-full transition-all">
      <DataTable data={blocks} columns={BlockTableColumns} />
    </section>
  );
};
