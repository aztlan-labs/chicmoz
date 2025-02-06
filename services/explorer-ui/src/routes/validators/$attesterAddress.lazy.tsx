import { createLazyFileRoute } from "@tanstack/react-router";
import { ValidatorDetailsPage } from "~/pages/validator-details";

export const Route = createLazyFileRoute("/validators/$attesterAddress")({
  component: ValidatorDetailsPage,
});
