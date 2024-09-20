import { createLazyFileRoute } from "@tanstack/react-router";
import { TransactionsTable } from "~/components/transactions/transactions-table";

export const Route = createLazyFileRoute("/transactions/")({
  component: Transactions,
});

function Transactions() {
  return (
    <div className="mx-auto px-[70px] max-w-[1440px]">
      <div className="flex flex-row gap-4 m-8">
        <div className="bg-white w-1/3 rounded-lg shadow-md p-4">
          <p> Transactions in the last 24 hours</p>
          <h2 className="text-primary">33952</h2>
        </div>

        <div className="bg-white w-1/3 rounded-lg shadow-md p-4">
          <p>Pending transactions in last hour</p>
          <h2 className="text-primary">342</h2>
        </div>
        <div className="bg-white w-1/3 rounded-lg shadow-md p-4">
          <p> average transaction fee (eth)</p>
          <h2 className="text-primary">0.000012245</h2>
        </div>
      </div>
      <TransactionsTable />
    </div>
  );
}

