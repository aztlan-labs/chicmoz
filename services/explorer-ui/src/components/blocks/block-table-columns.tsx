import { type ColumnDef } from "@tanstack/react-table";
import type { BlockTableSchema } from "~/components/blocks/blocks-schema";
import { DataTableColumnHeader } from "~/components/data-table";

const text = {
  blockNumber: "BLOCK NUMBER",
  blockHash: "BLOCK HASH",
  status: "STATUS",
  timestamp: "TIMESTAMP",
  transactions: "TRANSACTIONS",
};

export const blockTableColumns: ColumnDef<BlockTableSchema>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader className="text-purple-dark text-sm " column={column} title={text.blockNumber} />,
    cell: ({ row }) => (
      <div className="text-purple-light">{row.getValue("id")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "blockHash",
    header: ({ column }) => <DataTableColumnHeader className="text-purple-dark text-sm  text-wrap" column={column} title={text.blockHash} />,
    cell: ({ row }) => (
      <div className="text-purple-light" style={{ lineBreak: "anywhere" }}>
        {row.getValue("blockHash")}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader className="text-purple-dark text-sm " column={column} title={text.status}  />,
    cell: ({ row }) => <div className="uppercase">{row.getValue("status")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "timestamp",
    header: ({ column }) => <DataTableColumnHeader className="text-purple-dark text-sm " column={column} title={text.timestamp} />,
    cell: ({ row }) => <div className="text-purple-dark">{row.getValue("timestamp")}</div>,
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "transactions",
    header: ({ column }) => <DataTableColumnHeader className="text-purple-dark text-sm " column={column} title={text.transactions}  />,
    cell: ({ row }) => <div className="text-purple-dark">{row.getValue("transactions")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
];
