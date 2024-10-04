import { type ColumnDef } from "@tanstack/react-table";
import { Link } from "@tanstack/react-router";
import { routes } from "~/routes/__root";
import { DataTableColumnHeader } from "~/components/data-table";
import { type TxEffectsTableSchema } from "./tx-effects-schema";

const text = {
  txHash: "TX EFFECT HASH",
  transactionFee: "TRANSACTION FEE",
  logCount: "LOGS COUNT",
};

export const TxEffectsTableColumns: ColumnDef<TxEffectsTableSchema>[] = [
  {
    accessorKey: "txHash",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="text-purple-dark text-sm "
        column={column}
        title={text.txHash}
      />
    ),
    cell: ({ row }) => {
      const txHash = row.getValue("txHash");
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      const r = routes.txEffects.route + "/" + txHash;
      return (
        <div className="text-purple-light">
          <Link to={r}>{row.getValue("txHash")}</Link>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "transactionFee",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="text-purple-dark text-sm "
        column={column}
        title={text.transactionFee}
      />
    ),
    cell: ({ row }) => (
      <div className="text-purple-dark">{row.getValue("transactionFee")}</div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "logCount",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="text-purple-dark text-sm "
        column={column}
        title={text.logCount}
      />
    ),
    cell: ({ row }) => (
      <div className="text-purple-dark">{row.getValue("logCount")}</div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
];
