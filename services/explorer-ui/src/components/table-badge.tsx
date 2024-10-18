import { FC, useMemo } from "react";

interface TableBadgeProps {
  title: string;
  isLoading: boolean;
  error: Error | null;
  children: React.ReactNode;
}

export const TableBadge: FC<TableBadgeProps> = ({
  title,
  isLoading,
  error,
  children,
}) => {
  const text = useMemo(() => {
    if (isLoading) return "Loading";
    if (error) return error.message;
    return undefined;
  }, [isLoading, error]);

  return (
    <div className="bg-white w-full rounded-lg shadow-md p-4 md:w-1/2">
      <h3>{title}</h3>
      {!text ? children : <p className="text-primary-500">{text}</p>}
    </div>
  );
};
