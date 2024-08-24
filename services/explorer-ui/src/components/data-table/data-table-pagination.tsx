import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { type Table } from "@tanstack/react-table";
import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-center px-2">
      <PaginationControls table={table} />
    </div>
  );
}


const PaginationControls = <TData,>({ table }: DataTablePaginationProps<TData>) => (
  <div className="flex items-center w-full justify-center">
    <PageSizeSelector table={table} />
    <PageNavigation table={table} />
  </div>
);

const PageSizeSelector = <TData,>({ table }: DataTablePaginationProps<TData>) => (
  <div className="flex items-center space-x-2">
    <p className="mb-1 h-full text-sm text-muted-foreground">Rows per page</p>
    <Select
      value={`${table.getState().pagination.pageSize}`}
      onValueChange={(value) => table.setPageSize(Number(value))}
    >
      <SelectTrigger className="h-8 w-[70px]">
        <SelectValue placeholder={table.getState().pagination.pageSize} />
      </SelectTrigger>
      <SelectContent side="top">
        {[10, 20, 30, 40, 50].map((pageSize) => (
          <SelectItem
            key={pageSize}
            value={`${pageSize}`}
          >
            {pageSize}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

const PageNavigation = <TData,>({ table }: DataTablePaginationProps<TData>) => {
  const getPreviousPage = () => table.getState().pagination.pageIndex;

  const getCurrentPage  = () => table.getState().pagination.pageIndex + 1;
  const getNextPage = () => table.getState().pagination.pageIndex + 2;

  return (
  <div className="flex items-center justify-center w-full">
    {/*<p className="flex w-[100px] items-center justify-center text-sm text-muted-foreground">*/}
    {/*  Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}*/}
    {/*</p>*/}
    {/*<div className="flex items-center justify-center w-full">*/}
      <Button
        variant="icon"
        className="hidden h-8 w-8 p-0 lg:flex"
        onClick={() => table.setPageIndex(0)}
        disabled={!table.getCanPreviousPage()}
      >
        <span className="sr-only">{text.first}</span>
        <ArrowLeftIcon className="h-4 w-4 text-purple-light" />
      </Button>
      <Button variant="icon" className="h-8 w-16 p-0" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
        <span className="sr-only">{text.previous}</span>
        <span className="capitalize text-purple-light">{text.previousBtn}</span>
      </Button>
      <Button variant="icon" className="h-8 w-8 p-0" onClick={() => table.setPageIndex(getPreviousPage)} disabled={!table.getCanPreviousPage()}>
        <span className="capitalize text-purple-light">{getPreviousPage()}</span>
      </Button>
      <Button variant="icon" className="h-8 w-8 p-0 bg-purple-light" onClick={() => table.setPageIndex(getCurrentPage)} disabled={!table.getCanPreviousPage()}>
        <span className="capitalize text-white">{getCurrentPage()}</span>
      </Button>
      <Button variant="icon" className="h-8 w-8 p-0" onClick={() => table.setPageIndex(getNextPage)} disabled={!table.getCanPreviousPage()}>
        <span className="capitalize text-purple-light">{getNextPage()}</span>
      </Button>
      <Button variant="icon" className="h-8 w-16 p-0" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
        <span className="sr-only">{text.last}</span>
        <span className="capitalize text-purple-light">{text.nextBtn}</span>
      </Button>
      <Button
        variant="icon"
        className="hidden h-8 w-8 p-0 lg:flex"
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        disabled={!table.getCanNextPage()}
      >
        <span className="sr-only">{text.last}</span>
        <ArrowRightIcon className="h-4 w-4 text-purple-light" />
      </Button>
  </div>
  )};

const text = {
  previousBtn: "Previous", 
  nextBtn: "Next",
  first: "Go to first page",
  previous: "Go to previous page",
  next: "Go to next page",
  last: "Go to last page",
  rowsPerPage: "Rows per page",
};
