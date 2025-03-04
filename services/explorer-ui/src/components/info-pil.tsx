import { type FC, useMemo } from "react";

interface InfoPilProps {
  title: string;
  data?: string;
  isLoading: boolean;
  error: Error | null;
}
export const InfoPil: FC<InfoPilProps> = ({
  title,
  data,
  isLoading,
  error,
}) => {
  const text = useMemo(() => {
    if (isLoading) return "Loading";
    if (error) return error.message;
    if (data) return data;
    return "No Data";
  }, [data, isLoading, error]);

  return (
    <div className="flex flex-col bg-white w-5/12 justify-between rounded-lg shadow-md p-4 md:w-96">
      <p>{title}</p>
      <h2 className="text-primary">{text}</h2>
    </div>
  );
};
