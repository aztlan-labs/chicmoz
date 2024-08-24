import { Cross2Icon } from "@radix-ui/react-icons";
import { type Table } from "@tanstack/react-table";
import { Button, FlexBox } from "~/components/ui";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  flatten?: boolean;
  setFlatten?: (flatten: boolean) => void;
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <FlexBox className="flex-row items-center justify-between gap-4">
      <div className="flex flex-1 items-center gap-2">
        {/*TODO: Will add search parameter in future*/}
        {/*<Input*/}
        {/*  placeholder="Filter Accounts..."*/}
        {/*  value={(table.getColumn("account")?.getFilterValue() as string) ?? ""}*/}
        {/*  onChange={(event) => table.getColumn("id")?.setFilterValue(event.target.value)}*/}
        {/*  className="h-8 w-[150px] lg:w-[250px]"*/}
        {/*/>*/}
        {table.getColumn("tier") && (
          <DataTableFacetedFilter
            column={table.getColumn("tier")}
            title="Tiers"
            options={tiers}
          />
        )}
        {isFiltered && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => table.resetColumnFilters()}
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </FlexBox>
  );
}

// TODO: get tiers directly from api in future to make this component reusable

const tiers = [
  {
    value: "free",
    label: "Free",
  },
  {
    value: "freemium",
    label: "Freemium",
  },
  {
    value: "pilot",
    label: "Pilot",
  },
];
