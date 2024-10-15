import { Outlet, createLazyFileRoute, useParams } from "@tanstack/react-router";
import { Blocks } from "~/pages/block";

export const Route = createLazyFileRoute("/blocks/")({
  component: Blocks,
});
