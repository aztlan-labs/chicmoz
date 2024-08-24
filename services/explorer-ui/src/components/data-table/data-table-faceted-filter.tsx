import { CheckIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import type { Column } from "@tanstack/react-table";
import { useCallback, useEffect, useState } from "react";
import {
  Badge,
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Separator,
} from "~/components/ui";
import { cn } from "~/lib/utils";

interface Option<TValue> {
  label: string;
  value: TValue;
  icon?: React.ComponentType<{ className?: string }>;
}

interface FilterBadgeProps<TValue> {
  selectedValues: Set<TValue>;
  options: Option<TValue>[];
}

interface OptionItemProps<TValue> {
  option: Option<TValue>;
  isSelected: boolean;
  onSelect: () => void;
  facets?: Map<TValue, number>;
}

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: Option<TValue>[];
  search?: string;
}

export function DataTableFacetedFilter<TData, TValue>({ column, title, options, search }: DataTableFacetedFilterProps<TData, TValue>) {
  const [selectedValues, setSelectedValues] = useState<Set<TValue>>(new Set(column?.getFilterValue() as TValue[]));
  const facets = column?.getFacetedUniqueValues();

  useEffect(() => {
    setSelectedValues(new Set(column?.getFilterValue() as TValue[]));
  }, [column]);

  const toggleOption = useCallback(
    (value: TValue) => {
      selectedValues.add(value);
      column?.setFilterValue(Array.from(selectedValues));
    },
    [selectedValues, column]
  );

  const clearFilters = () => {
    setSelectedValues(new Set());
    column?.setFilterValue(undefined);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className="h-8 border-dashed font-sans"
        >
          <PlusCircledIcon className="mr-2 h-4 w-4" />
          {title}
          {selectedValues.size > 0 && (
            <FilterBadge
              selectedValues={selectedValues}
              options={options}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[200px] p-0"
        align="start"
      >
        <Command>
          {search && <CommandInput placeholder={title} />}
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option, index) => (
                <OptionItem
                  key={index}
                  option={option}
                  isSelected={selectedValues.has(option.value)}
                  onSelect={() => toggleOption(option.value)}
                  facets={facets}
                />
              ))}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={clearFilters}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function FilterBadge<TValue>({ selectedValues, options }: FilterBadgeProps<TValue>) {
  if (!selectedValues.size) return;
  return (
    <>
      <Separator
        orientation="vertical"
        className="mx-2 h-4"
      />
      <div className="space-x-1">
        {options
          .filter((option) => selectedValues.has(option.value))
          .map((option, index) => (
            <Badge
              key={index}
              variant="default"
              className="rounded px-1 font-normal"
            >
              {option.label}
            </Badge>
          ))}
      </div>
    </>
  );
}

function OptionItem<TValue>({ option, isSelected, onSelect, facets }: OptionItemProps<TValue>) {
  return (
    <CommandItem onSelect={onSelect}>
      <div
        className={cn(
          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
          isSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible"
        )}
      >
        <CheckIcon className={cn("h-4 w-4")} />
      </div>
      {option.icon && <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
      <span>{option.label}</span>
      {facets?.get(option.value) && (
        <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">{facets.get(option.value)}</span>
      )}
    </CommandItem>
  );
}
