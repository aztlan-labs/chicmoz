import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type FC, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const queryClient = new QueryClient();

export const QueryProvider: FC<Props> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
