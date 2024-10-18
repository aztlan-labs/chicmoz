import { type FC } from "react";
import { DataTable } from "~/components/data-table";
import { type ContractInstance } from "./schema";
import { contractsTableColumns } from "./columns";

interface Props {
  contracts: ContractInstance[];
}

export const ContractInstancesTable: FC<Props> = ({ contracts }) => {
  return (
    <section className="relative mx-auto w-full transition-all">
      <DataTable data={contracts} columns={contractsTableColumns} />
    </section>
  );
};
