import { Button } from "~/components/ui";
import { TxEffectDataType } from "./utils";
import { Tab } from "./constants";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

export type OptionButtonProps = {
  availableData: Record<string, TxEffectDataType | undefined>;
  requiredOptions: Tab[];
  onOptionSelect?: (option: string) => void;
  buttonClassName?: string;
  disabledButtonClassName?: string;
};

export const OptionButtons: React.FC<OptionButtonProps> = ({
  availableData,
  requiredOptions,
  onOptionSelect,
}) => {
  // Check if an option is available in the record
  const isOptionAvailable = (option: string) =>
    option in availableData &&
    availableData[option] !== undefined &&
    availableData[option] !== null;

  return (
    <div className="hidden lg:flex flex-row gap-4 w-10 mb-4">
      {requiredOptions.map((option) => {
        const isAvailable = isOptionAvailable(option.id);

        if (!isAvailable) {
          return (
            <TooltipProvider>
              <Tooltip key={option.id}>
                <TooltipTrigger>
                  <Button
                    key={option.id}
                    disabled={true}
                    className={
                      "shadow-[0px_0px_1px_2px_rgba(0,0,0,0)] bg-gray-300 cursor-not-allowed opacity-50 text-primary"
                    }
                  >
                    {option.label}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Data not present in this txEffect
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        }
        return (
          <Button
            key={option.id}
            onClick={() => onOptionSelect?.(option.id)}
            className={
              "shadow-[0px_0px_1px_2px_rgba(0,0,0,0)] bg-primary hover:bg-primary-500"
            }
          >
            {option.label}
          </Button>
        );
      })}
    </div>
  );
};
