import { type Tab } from "./constants";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui";
import { CustomTooltip } from "~/components/custom-tooltip";

export type OptionButtonProps = {
  isOptionAvailable: Record<string, boolean>;
  requiredOptions: Tab[];
  onOptionSelect: (option: string) => void;
  buttonClassName?: string;
  disabledButtonClassName?: string;
};

export const OptionButtons: React.FC<OptionButtonProps> = ({
  isOptionAvailable,
  requiredOptions,
  onOptionSelect,
}) => {
  return (
    <>
      <div className="hidden lg:flex flex-row gap-4 w-10 mb-4">
        {requiredOptions.map((option) => {
          const isAvailable = isOptionAvailable[option.id];

          if (!isAvailable) {
            return (
              <CustomTooltip content="Data not present!">
                <Button
                  key={option.id}
                  disabled={true}
                  className={
                    "shadow-[0px_0px_1px_2px_rgba(0,0,0,0)] bg-gray-300 cursor-not-allowed opacity-50 text-primary"
                  }
                >
                  {option.label}
                </Button>
              </CustomTooltip>
            );
          }
          return (
            <Button
              key={option.id}
              onClick={() => onOptionSelect(option.id)}
              className={
                "shadow-[0px_0px_1px_2px_rgba(0,0,0,0)] bg-primary hover:bg-primary-500"
              }
            >
              {option.label}
            </Button>
          );
        })}
      </div>
      <div className="mb-1 mt-4 lg:hidden">
        <Select onValueChange={onOptionSelect}>
          <SelectTrigger className="h-8 w-3/5 bg-primary text-white">
            <SelectValue placeholder="encryptedLogs" />
          </SelectTrigger>
          <SelectContent>
            {requiredOptions.map((tab) => (
              <SelectItem
                key={tab.id}
                disabled={!isOptionAvailable[tab.id]}
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
