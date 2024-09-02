import { usePXEClient } from "./hooks/usePXEClient";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./main";

export const App = () => {
  const { pxe, isLoading, error } = usePXEClient();

  if (isLoading) return <div>Loading PXE client...</div>;

  if (error) return <div>Error initializing PXE client: {error.message}</div>;

  // Here you might want to add a context provider if you need the pxe client throughout your app
  return <RouterProvider router={router} />;
};
