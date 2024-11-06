import { type FC } from "react";
import { DataTable } from "~/components/data-table";
import { BlockTableColumns } from "./block-table-columns";
import { type BlockTableSchema } from "./blocks-schema";
import { Loader } from "../loader";

interface Props {
  title?: string;
  blocks?: BlockTableSchema[];
  isLoading: boolean;
  error?: Error | null;
  disableSizeSelector?: boolean;
}

// TODO: Maybe make this a generic component
export const BlocksTable: FC<Props> = ({
  title,
  blocks,
  isLoading,
  error,
  disableSizeSelector,
}) => {
  if (isLoading) return <Loader amount={5} />;
  if (!blocks) return <div>No data</div>;
  if (error) return <p className="text-red-500">{error.message}</p>;

  return (
    <section className="relative mx-0 w-full transition-all">
      <DataTable
        title={title}
        data={blocks}
        columns={BlockTableColumns}
        disableSizeSelector={disableSizeSelector}
      />
    </section>
  );
};
