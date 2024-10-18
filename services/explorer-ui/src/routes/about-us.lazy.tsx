import { createLazyFileRoute } from "@tanstack/react-router";
import { AboutUs } from "~/pages/about-us";

export const Route = createLazyFileRoute("/about-us")({
  component: AboutUs,
});
