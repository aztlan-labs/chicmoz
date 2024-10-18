import { createLazyFileRoute } from "@tanstack/react-router";
import { Contracts } from "~/pages/contract";

export const Route = createLazyFileRoute("/contracts/")({
  component: Contracts,
});
