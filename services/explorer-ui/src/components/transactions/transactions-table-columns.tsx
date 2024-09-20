import { type ColumnDef } from "@tanstack/react-table";
import type { TransactionTableSchema } from "~/components/transactions/transactions-schema";
import { DataTableColumnHeader } from "~/components/data-table";
import { Badge } from "../ui";

const text = {
  transactionHash: "TRANSACTION HASH",
  status: "STATUS",
  block: "BLOCK",
  timestamp: "TIMESTAMP",
  transactionFee: "TRANSACTION FEE",
};

export const TransactionTableColumns: ColumnDef<TransactionTableSchema>[] = [
  {
    accessorKey: "transactionHash",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="text-purple-dark text-sm "
        column={column}
        title={text.transactionHash}
      />
    ),
    cell: ({ row }) => (
      <div className="text-purple-light">{row.getValue("transactionHash")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="text-purple-dark text-sm "
        column={column}
        title={text.status}
      />
    ),
    cell: ({ row }) => (
      <Badge variant="success">{row.getValue("status")}</Badge>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "block",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="text-purple-dark text-sm "
        column={column}
        title={text.block}
      />
    ),
    cell: ({ row }) => (
      <div className="text-purple-dark">{row.getValue("block")}</div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "timestamp",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="text-purple-dark text-sm "
        column={column}
        title={text.timestamp}
      />
    ),
    cell: ({ row }) => (
      <div className="text-purple-dark">{row.getValue("timestamp")}</div>
    ),
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id));
    },
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
];
