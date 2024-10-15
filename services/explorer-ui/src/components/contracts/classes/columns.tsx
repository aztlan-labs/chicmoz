import { type ColumnDef } from "@tanstack/react-table";
import { Link } from "@tanstack/react-router";
import { routes } from "~/routes/__root";
import { DataTableColumnHeader } from "~/components/data-table";
import { type ContractClass } from "./schema";

const text = {
  blockHash: "BLOCK HASH",
  contractClassId: "CLASS ID",
  version: "VERSION",
  artifactHash: "ARTIFACT HASH",
  privateFunctionsRoot: "PRIVATE FUNCTIONS ROOT",
};

export const contractsTableColumns: ColumnDef<ContractClass>[] = [
  {
    accessorKey: "blockHash",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="text-purple-dark text-sm "
        column={column}
        title={text.blockHash}
      />
    ),
    cell: ({ row }) => {
      const hash = row.getValue("hash");
      if (typeof hash !== "string") return null;
      const r = `${routes.blocks.route}/${hash}`;
      const truncatedTxHash = `${hash.slice(0, 6)}...${hash.slice(-4)}`;
      return (
        <div className="text-purple-light font-mono font-bold">
          <Link to={r}>{truncatedTxHash}</Link>
        </div>
      );
    },
  },
  {
    accessorKey: "contractClassId",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="text-purple-dark text-sm "
        column={column}
        title={text.contractClassId}
      />
    ),
    cell: ({ row }) => {
      const contractClassId = row.getValue("contractClassId");
      if (typeof contractClassId !== "string") return null;
      const r = `${routes.contracts.route}/${routes.contracts.children.classes.route}/${contractClassId}`;
      const truncatedContractClassId = `${contractClassId.slice(
        0,
        6
      )}...${contractClassId.slice(-4)}`;
      return (
        <div className="text-purple-light font-mono font-bold">
          <Link to={r}>{truncatedContractClassId}</Link>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "version",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="text-purple-dark text-sm "
        column={column}
        title={text.version}
      />
    ),
    cell: ({ row }) => (
      <div className="text-purple-dark">{row.getValue("version")}</div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "artifactHash",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="text-purple-dark text-sm "
        column={column}
        title={text.artifactHash}
      />
    ),
    cell: ({ row }) => (
      <div className="text-purple-dark font-mono">
        {row.getValue("artifactHash")}
      </div>
    ),
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "privateFunctionsRoot",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="text-purple-dark text-sm "
        column={column}
        title={text.privateFunctionsRoot}
      />
    ),
    cell: ({ row }) => (
      <div className="text-purple-dark font-mono">
        {row.getValue("privateFunctionsRoot")}
      </div>
    ),
    enableSorting: false,
    enableHiding: true,
  },
];
