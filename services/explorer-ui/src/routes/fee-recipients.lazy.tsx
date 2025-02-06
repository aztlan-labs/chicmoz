import { createLazyFileRoute } from "@tanstack/react-router";
import { FeeRecipientPage } from "~/pages/fee-recipients";

export const Route = createLazyFileRoute("/fee-recipients")({
  component: FeeRecipientPage,
});
