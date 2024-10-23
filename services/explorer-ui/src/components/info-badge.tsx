import { type FC, useMemo } from "react";
import { Loader } from "./loader";

interface InfoBadgeProps {
  title: string;
  data?: string;
  isLoading: boolean;
  error: Error | null;
}
export const InfoBadge: FC<InfoBadgeProps> = ({
  title,
  data,
  isLoading,
  error,
}) => {
  const text = useMemo(() => {
    if (error) return error.message;
    if (data) return data;
    return "No Data";
  }, [data, error]);
  return (
    <div className="flex flex-col bg-white w-5/12 justify-between rounded-lg shadow-md p-4 md:w-96">
      <p className="text-sm">{title}</p>
      {isLoading ? (
        <Loader amout={1} />
      ) : (
        <h3 className="text-primary">{text}</h3>
      )}
    </div>
  );
};
