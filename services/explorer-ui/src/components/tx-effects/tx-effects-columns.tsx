import { type ColumnDef } from "@tanstack/react-table";
import { Link } from "@tanstack/react-router";
import { routes } from "~/routes/__root";
import { DataTableColumnHeader } from "~/components/data-table";
import { type TxEffectTableSchema } from "./tx-effects-schema";
import { formatTimeSince } from "~/lib/utils";
import { truncateHashString } from "~/lib/create-hash-string";

const text = {
  txHash: "HASH",
  transactionFee: "FEE (FPA)",
  blockHeight: "HEIGHT",
  timeSince: "AGE",
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
      const hash = row.getValue("txHash");
      if (typeof hash !== "string") return null;
      const r = `${routes.txEffects.route}/${hash}`;
      const truncatedTxHash = truncateHashString(hash);
      return (
        <div className="text-purple-light font-mono">
          <Link to={r}>{truncatedTxHash}</Link>
        </div>
      );
    },
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
  {
    accessorKey: "transactionFee",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="text-purple-dark text-sm"
        column={column}
        title={text.transactionFee}
      />
    ),
    cell: ({ row }) => (
      <div className="font-mono">{row.getValue("transactionFee")}</div>
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
        <div className="text-purple-light font-mono">
          <Link to={r}>{blockNumber}</Link>
        </div>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
];
