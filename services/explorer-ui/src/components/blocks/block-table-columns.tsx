import { Link } from "@tanstack/react-router";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "~/components/data-table";
import { formatTimeSince } from "~/lib/utils";
import { routes } from "~/routes/__root";
import type { BlockTableSchema } from "./blocks-schema";

const text = {
  height: "BLOCK HEIGHT",
  blockHash: "BLOCK HASH",
  numberOfTransactions: "TRANSACTIONS",
  txEffectsLength: "TX EFFECTS",
  totalFees: "TOTAL FEES",
  timeSince: "TIME SINCE",
};

export const BlockTableColumns: ColumnDef<BlockTableSchema>[] = [
  {
    accessorKey: "height",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="text-purple-dark text-sm"
        column={column}
        title={text.height}
      />
    ),
    cell: ({ row }) => {
      const height = row.getValue("height");
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      const r = routes.blocks.route + "/" + height;
      return (
        <div className="text-purple-light">
          <Link to={r}>{row.getValue("height")}</Link>
        </div>
      );
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "blockHash",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="text-purple-dark text-sm text-wrap"
        column={column}
        title={text.blockHash}
      />
    ),
    cell: ({ row }) => {
      const blockHash = row.getValue("blockHash");
      if (typeof blockHash !== "string") return null;
      const r = `${routes.blocks.route}/${blockHash}`;
      const truncatedBlockHash = `${blockHash.slice(0, 6)}...${blockHash.slice(
        -4
      )}`;
      return (
        <div className="text-purple-light font-mono font-bold">
          <Link to={r}>{truncatedBlockHash}</Link>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "numberOfTransactions",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="text-purple-dark text-sm"
        column={column}
        title={text.numberOfTransactions}
      />
    ),
    cell: ({ row }) => (
      <div className="text-purple-dark">
        {row.getValue("numberOfTransactions")}
      </div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "txEffectsLength",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="text-purple-dark text-sm"
        column={column}
        title={text.txEffectsLength}
      />
    ),
    cell: ({ row }) => (
      <div className="text-purple-dark">{row.getValue("txEffectsLength")}</div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "totalFees",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="text-purple-dark text-sm"
        column={column}
        title={text.totalFees}
      />
    ),
    cell: ({ row }) => (
      <div className="text-purple-dark">{row.getValue("totalFees")}</div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "timestamp",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="text-purple-dark text-sm"
        column={column}
        title={text.timeSince}
      />
    ),
    cell: ({ row }) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const formattedTime = formatTimeSince(
        (row.getValue("timestamp") as unknown as number) * 1000
      );
      return <div className="text-purple-dark">{formattedTime}</div>;
    },
    enableSorting: true,
    enableHiding: false,
  },
];
