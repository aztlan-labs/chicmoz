import { type FC } from "react";
import { DataTable } from "~/components/data-table";
import { BlockTableColumns } from "./block-table-columns";
import { type BlockTableSchema } from "./blocks-schema";

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
  if (error) return <p className="text-red-500">{error.message}</p>;

  return (
    <section className="relative mx-0 w-full transition-all">
      <DataTable
        isLoading={isLoading}
        title={title}
        data={blocks ?? []}
        columns={BlockTableColumns}
        disableSizeSelector={disableSizeSelector}
      />
    </section>
  );
};
