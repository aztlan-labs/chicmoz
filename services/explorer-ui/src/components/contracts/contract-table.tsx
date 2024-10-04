import { type FC } from "react";
import { DataTable } from "~/components/data-table";
import { type ContractTableSchema } from "./contract-schema";
import { contractsTableColumns } from "./contract-columns";

interface Props {
  contracts: ContractTableSchema[];
}

export const ContractsTable: FC<Props> = ({ contracts }) => {
  return (
    <section className="relative mx-auto w-full transition-all">
      <DataTable data={contracts} columns={contractsTableColumns} />
    </section>
  );
};
