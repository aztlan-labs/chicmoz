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
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      const r = routes.contracts.route + "/" + address;
      return (
        <div className="text-purple-light">
          <Link to={r}>{row.getValue("address")}</Link>
        </div>
      );
    },
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
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      const r = routes.blocks.route + "/" + blockHash;
      return (
        <div className="text-purple-light">
          <Link to={r}>{row.getValue("blockHash")}</Link>
        </div>
      );
    },
    enableSorting: false,
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
    accessorKey: "contractClassId",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="text-purple-dark text-sm "
        column={column}
        title={text.contractClassId}
      />
    ),
    cell: ({ row }) => (
      <div className="text-purple-dark">{row.getValue("contractClassId")}</div>
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
      <div className="text-purple-dark">{row.getValue("publicKeysHash")}</div>
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
      <div className="text-purple-dark">{row.getValue("deployer")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
