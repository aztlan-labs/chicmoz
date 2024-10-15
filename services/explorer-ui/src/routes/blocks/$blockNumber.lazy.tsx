import { createLazyFileRoute } from "@tanstack/react-router";
import { BlockDetails } from "~/pages/block-details";

export const Route = createLazyFileRoute("/blocks/$blockNumber")({
  component: BlockDetails,
});
