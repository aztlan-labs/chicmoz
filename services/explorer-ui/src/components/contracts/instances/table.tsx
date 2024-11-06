import { type FC } from "react";
import { DataTable } from "~/components/data-table";
import { type ContractInstance } from "./schema";
import { contractsTableColumns } from "./columns";

interface Props {
  title?: string;
  contracts?: ContractInstance[];
  isLoading: boolean;
  error?: Error | null;
}

export const ContractInstancesTable: FC<Props> = ({
  title,
  contracts,
  isLoading,
  error,
}) => {
  if (!contracts) return <div>No data</div>;
  if (error) return <p className="text-red-500">{error.message}</p>;
  return (
    <section className="relative mx-auto w-full transition-all">
      <DataTable
        isLoading={isLoading}
        title={title}
        data={contracts}
        columns={contractsTableColumns}
      />
    </section>
  );
};
