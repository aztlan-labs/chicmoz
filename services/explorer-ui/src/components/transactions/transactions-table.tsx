import { DataTable } from "~/components/data-table";
import { allTransactions } from "./transactions";
import { TransactionTableColumns } from "./transactions-table-columns";

export const TransactionsTable = () => {
  const blocks = getTransactions();

  return (
    <section className="relative mx-auto w-full transition-all">
      <DataTable data={blocks} columns={TransactionTableColumns} />
    </section>
  );
};

const getTransactions = () => {
  return allTransactions.transactions;
};

