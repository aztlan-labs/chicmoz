import { createLazyFileRoute } from "@tanstack/react-router";
import { TxEffects } from "~/pages/tx-effect";

export const Route = createLazyFileRoute("/tx-effects/")({
  component: TxEffects,
});
