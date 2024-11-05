import { type ColumnDef } from "@tanstack/react-table";
import { Link } from "@tanstack/react-router";
import { routes } from "~/routes/__root";
import { DataTableColumnHeader } from "~/components/data-table";
import { type TxEffectTableSchema } from "./tx-effects-schema";
import { formatTimeSince } from "~/lib/utils";
import {CopyableText} from "../copy-text";
import {truncateHashString} from "~/lib/create-hash-string";

const text = {
  hash: "TX EFFECT HASH",
  txHash: "TX HASH",
  transactionFee: "TRANSACTION FEE (FPA)",
  totalLengthOfLogs: "TOTAL LOGS LENGTH",
  blockHeight: "BLOCK HEIGHT",
  timeSince: "TIME SINCE",
};

export const TxEffectsTableColumns: ColumnDef<TxEffectTableSchema>[] = [
  {
    accessorKey: "hash",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="text-purple-dark text-sm "
        column={column}
        title={text.hash}
      />
    ),
    cell: ({ row }) => {
      const hash = row.getValue("hash");
      if (typeof hash !== "string") return null;
      const r = `${routes.txEffects.route}/${hash}`;
      const truncatedTxHash = `${hash.slice(0, 6)}...${hash.slice(-4)}`;
      return (
        <div className="text-purple-light font-mono font-bold">
          <Link to={r}>{truncatedTxHash}</Link>
        </div>
      );
    },
  },
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
      <CopyableText
        toCopy={row.getValue("txHash")}
        text={truncateHashString(row.getValue("txHash"))}
      />
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
    accessorKey: "totalLengthOfLogs",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="text-purple-dark text-sm "
        column={column}
        title={text.totalLengthOfLogs}
      />
    ),
    cell: ({ row }) => (
      <div className="text-purple-dark">{row.getValue("totalLengthOfLogs")}</div>
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
    cell: ({ row }) => {
      const blockNumber = row.getValue("blockNumber");
      if (typeof blockNumber !== "number") return null;
      const r = `${routes.blocks.route}/${blockNumber}`;
      return (
        <div className="text-purple-light font-mono font-bold">
          <Link to={r}>{blockNumber}</Link>
        </div>
      );
    },
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
      const formattedTime = formatTimeSince(
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        row.getValue("timestamp") as unknown as number
      );
      return <div className="text-purple-dark">{formattedTime}</div>;
    },
    enableSorting: true,
    enableHiding: false,
  },
];
