import { CustomTooltip } from "~/components/custom-tooltip";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
} from "~/components/ui";

export type OptionItem = {
  id: string;
  label: string;
};

export type OptionItems = OptionItem[];

type ExtractOptionId<T extends OptionItems> = T[number]["id"];

type OptionButtonProps<T extends OptionItems> = {
  options: T;
  availableOptions: Record<string, boolean>; // TODO: this should work: Record<ExtractOptionId<T>, boolean>
  onOptionSelect: (option: ExtractOptionId<T>) => void;
  selectedItem: ExtractOptionId<T>;
};

export const OptionButtons = <T extends OptionItems>({
  options,
  availableOptions,
  onOptionSelect,
  selectedItem,
}: OptionButtonProps<T>) => {
  return (
    <>
      <div className="hidden lg:flex flex-row gap-4 w-10 mb-4">
        {options.map((option, key) => {
          const isAvailable = availableOptions[option.id];
          if (!isAvailable) {
            return (
              <CustomTooltip key={key} content="Not available">
                <Button
                  type="button"
                  key={option.id}
                  disabled={false}
                  className="shadow-[0px_0px_1px_2px_rgba(0,0,0,0)] bg-gray-300 cursor-not-allowed opacity-50 text-primary"
                >
                  {option.label}
                </Button>
              </CustomTooltip>
            );
          }
          return (
            <div
              key={key}
              className="flex flex-col justify-center items-center gap-1"
            >
              <Button
                key={option.id}
                onClick={() => onOptionSelect(option.id)}
                className="shadow-[0px_0px_1px_2px_rgba(0,0,0,0)] bg-primary hover:bg-primary-500"
              >
                {option.label}
              </Button>
              {selectedItem === option.id && (
                <Separator
                  orientation="horizontal"
                  className="h-0.5 bg-primary w-1/2 rounded-md"
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="mb-1 mt-4 lg:hidden">
        <Select onValueChange={onOptionSelect} value={selectedItem}>
          <SelectTrigger className="h-8 w-3/5 bg-primary text-white">
            <SelectValue placeholder={selectedItem} />
          </SelectTrigger>
          <SelectContent>
            {
              options.map((option, key) => (
                <SelectItem
                  key={key}
                  disabled={!availableOptions[option.id]}
                  value={option.id}
                >
                  {option.label}
                </SelectItem>
              ))
              //  requiredOptions.map((tab, key) => (
              //  <SelectItem
              //    key={key}
              //    disabled={!isOptionAvailable(tab.id)}
              //    value={tab.id}
              //  >
              //    {tab.label}
              //  </SelectItem>
              //))
            }
          </SelectContent>
        </Select>
      </div>
    </>
  );
};
