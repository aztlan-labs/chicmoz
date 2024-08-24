import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { type Table } from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent } from "~/components/ui";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

// TODO: update the columns to use values instead of keys
export function DataTableViewOptions<TData>({ table }: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/*<Button*/}
        {/*  variant="dropdown"*/}
        {/*  size="sm"*/}
        {/*  className="ml-auto hidden h-8 md:flex"*/}
        {/*>*/}
        {/*  <MixerHorizontalIcon className="mr-2 h-4 w-4" />*/}
        {/*  View*/}
        {/*</Button>*/}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[250px]"
      >
        {table
          .getAllColumns()
          .filter((column) => column.accessorFn !== undefined && column.getCanHide())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(value)}
                className="font-sans !capitalize"
              >
                {/* This is defined in the column meta*/}
                {column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
