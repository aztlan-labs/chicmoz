import { type ColumnDef } from "@tanstack/react-table";
import type { BlockTableSchema } from "./blocks-schema";
import { DataTableColumnHeader } from "~/components/data-table";

const text = {
  height: "BLOCK HEIGHT",
  blockHash: "BLOCK HASH",
  status: "STATUS",
  numberOfTransactions: "TRANSACTIONS",
  txEffectsLength: "TX EFFECTS",
  totalFees: "TOTAL FEES",
  timestamp: "TIMESTAMP",
};

export const BlockTableColumns: ColumnDef<BlockTableSchema>[] = [
  {
    accessorKey: "height",
    header: ({ column }) => <DataTableColumnHeader className="text-purple-dark text-sm" column={column} title={text.height} />,
    cell: ({ row }) => (
      <div className="text-purple-light">{row.getValue("height")}</div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "blockHash",
    header: ({ column }) => <DataTableColumnHeader className="text-purple-dark text-sm text-wrap" column={column} title={text.blockHash} />,
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
    header: ({ column }) => <DataTableColumnHeader className="text-purple-dark text-sm" column={column} title={text.status} />,
    cell: ({ row }) => <div className="uppercase">{row.getValue("status")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "numberOfTransactions",
    header: ({ column }) => <DataTableColumnHeader className="text-purple-dark text-sm" column={column} title={text.numberOfTransactions} />,
    cell: ({ row }) => <div className="text-purple-dark">{row.getValue("numberOfTransactions")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "txEffectsLength",
    header: ({ column }) => <DataTableColumnHeader className="text-purple-dark text-sm" column={column} title={text.txEffectsLength} />,
    cell: ({ row }) => <div className="text-purple-dark">{row.getValue("txEffectsLength")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "totalFees",
    header: ({ column }) => <DataTableColumnHeader className="text-purple-dark text-sm" column={column} title={text.totalFees} />,
    cell: ({ row }) => <div className="text-purple-dark">{row.getValue("totalFees")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "timestamp",
    header: ({ column }) => <DataTableColumnHeader className="text-purple-dark text-sm" column={column} title={text.timestamp} />,
    cell: ({ row }) => <div className="text-purple-dark">{row.getValue("timestamp")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
];
