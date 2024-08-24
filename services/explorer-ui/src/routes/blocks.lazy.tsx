import { createLazyFileRoute } from "@tanstack/react-router";
import { BlocksTable } from "~/components/blocks/blocks-table.tsx";

export const Route = createLazyFileRoute("/blocks")({
  component: Blocks,
});

function Blocks() {
  return (
    <div className="mx-auto px-[70px] max-w-[1440px]">
      <h1 className="mt-16">{text.title}</h1>
      <BlocksTable />
    </div>
  );
}

const text = {
  title: "All blocks",
}