import { type ColumnDef } from "@tanstack/react-table";
import { Link } from "@tanstack/react-router";
import { routes } from "~/routes/__root";
import { DataTableColumnHeader } from "~/components/data-table";
import { type TxEffectTableSchema } from "./tx-effects-schema";
import { formatTimeSince } from "~/lib/utils";

const text = {
  txHash: "TX EFFECT HASH",
  transactionFee: "TRANSACTION FEE",
  logCount: "LOGS COUNT",
  blockHeight: "BLOCK HEIGHT",
  timeSince: "TIME SINCE",
};

export const TxEffectsTableColumns: ColumnDef<TxEffectTableSchema>[] = [
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
      if (typeof txHash !== "string") return null;
      const r = `${routes.txEffects.route}/${txHash}`;
      const truncatedTxHash = `${txHash.slice(0, 6)}...${txHash.slice(-4)}`;
      return (
        <div className="text-purple-light font-mono font-bold">
          <Link to={r}>{truncatedTxHash}</Link>
        </div>
      );
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
  {
    accessorKey: "blockNumber",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="text-purple-dark text-sm "
        column={column}
        title={text.blockHeight}
      />
    ),
    cell: ({ row }) => (
      <div className="text-purple-dark">{row.getValue("blockNumber")}</div>
    ),
    enableSorting: true,
    enableHiding: true,
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
