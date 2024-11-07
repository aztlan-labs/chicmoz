import { TxEffectDataType } from "./utils";
import { Tab, tabId } from "./constants";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
} from "~/components/ui";
import { CustomTooltip } from "~/components/custom-tooltip";

export type OptionButtonProps = {
  availableData: Record<string, TxEffectDataType | undefined>;
  requiredOptions: Tab[];
  onOptionSelect: (option: string) => void;
  selectedItem: tabId;
};

export const OptionButtons: React.FC<OptionButtonProps> = ({
  availableData,
  requiredOptions,
  onOptionSelect,
  selectedItem,
}) => {
  // Check if an option is available in the record
  const isOptionAvailable = (option: string) =>
    option in availableData &&
    availableData[option] !== undefined &&
    availableData[option] !== null;

  return (
    <>
      <div className="hidden lg:flex flex-row gap-4 w-10 mb-4">
        {requiredOptions.map((option, key) => {
          const isAvailable = isOptionAvailable(option.id);

          if (!isAvailable) {
            return (
              <CustomTooltip key={key} content="Not available in this txEffect">
                <Button
                  type="button"
                  key={option.id}
                  disabled={false}
                  className={`shadow-[0px_0px_1px_2px_rgba(0,0,0,0)] bg-gray-300 cursor-not-allowed opacity-50 text-primary `}
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
                className={`shadow-[0px_0px_1px_2px_rgba(0,0,0,0)] bg-primary hover:bg-primary-500`}
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
        <Select onValueChange={onOptionSelect}>
          <SelectTrigger className="h-8 w-3/5 bg-primary text-white">
            <SelectValue placeholder="encryptedLogs" />
          </SelectTrigger>
          <SelectContent>
            {requiredOptions.map((tab, key) => (
              <SelectItem
                key={key}
                disabled={!isOptionAvailable(tab.id)}
                value={tab.id}
              >
                {tab.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};
