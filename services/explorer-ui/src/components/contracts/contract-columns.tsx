import { type ColumnDef } from "@tanstack/react-table";
import { Link } from "@tanstack/react-router";
import { routes } from "~/routes/__root";
import { DataTableColumnHeader } from "~/components/data-table";
import { type ContractTableSchema } from "./contract-schema";

const text = {
  address: "ADDRESS",
  blockHash: "BLOCK HASH",
  blockHeight: "BLOCK HEIGHT",
  version: "VERSION",
  contractClassId: "CONTRACT CLASS ID",
  publicKeysHash: "PUBLIC KEYS HASH",
  deployer: "DEPLOYER",
};

export const contractsTableColumns: ColumnDef<ContractTableSchema>[] = [
  {
    accessorKey: "address",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="text-purple-dark text-sm "
        column={column}
        title={text.address}
      />
    ),
    cell: ({ row }) => {
      const address = row.getValue("address");
      if (typeof address !== "string") return null;
      const r = `${routes.contracts.route}/${address}`;
      const truncatedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
      return (
        // TODO: make text chars equally wide (and not truncate)
        <div className="text-purple-light font-mono font-bold">
          <Link to={r}>{truncatedAddress}</Link>
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
    accessorKey: "blockHeight",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="text-purple-dark text-sm "
        column={column}
        title={text.blockHeight}
      />
    ),
    cell: ({ row }) => {
      const blockHeight = row.getValue("blockHeight");
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      const r = routes.blocks.route + "/" + blockHeight;
      return (
        <div className="text-purple-light">
          <Link to={r}>{row.getValue("blockHeight")}</Link>
        </div>
      );
    },
    enableSorting: true,
    enableHiding: false,
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
    cell: ({ row }) => (
      <div className="text-purple-dark font-mono">{row.getValue("contractClassId")}</div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "publicKeysHash",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="text-purple-dark text-sm "
        column={column}
        title={text.publicKeysHash}
      />
    ),
    cell: ({ row }) => (
      <div className="text-purple-dark font-mono">{row.getValue("publicKeysHash")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "deployer",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="text-purple-dark text-sm "
        column={column}
        title={text.deployer}
      />
    ),
    cell: ({ row }) => (
      <div className="text-purple-dark font-mono">{row.getValue("deployer")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
      const blockHash = row.getValue("blockHash");
      if (typeof blockHash !== "string") return null;
      const r = `${routes.blocks.route}/${blockHash}`;
      const truncatedBlockHash = `${blockHash.slice(0, 6)}...${blockHash.slice(-4)}`;
      return (
        <div className="text-purple-light font-mono font-bold">
          <Link to={r}>{truncatedBlockHash}</Link>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
