import { type ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "~/components/data-table";
import { type TxEffectsTableSchema } from "./tx-effects-schema";

const text = {
  txHash: "TRANSACTION HASH",
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
    cell: ({ row }) => (
      <div className="text-purple-light">{row.getValue("txHash")}</div>
    ),
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
