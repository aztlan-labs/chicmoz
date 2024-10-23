import { type FC } from "react";
import { DataTable } from "~/components/data-table";
import { type ContractClass } from "./schema";
import { contractsTableColumns } from "./columns";
import { Loader } from "~/components/loader";

interface Props {
  contracts?: ContractClass[];
  isLoading: boolean;
  error?: Error | null;
}

export const ContractClassesTable: FC<Props> = ({
  contracts,
  isLoading,
  error,
}) => {
  if (isLoading) return <Loader amout={5} />;
  if (!contracts) return <div>No data</div>;
  if (error) return <p className="text-red-500">{error.message}</p>;
  return (
    <section className="relative mx-auto w-full transition-all">
      <DataTable data={contracts} columns={contractsTableColumns} />
    </section>
  );
};
