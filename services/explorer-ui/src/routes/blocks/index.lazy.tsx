import { Outlet, createLazyFileRoute, useParams } from "@tanstack/react-router";
import { BlockTableSchema } from "~/components/blocks/blocks-schema";
import { BlocksTable } from "~/components/blocks/blocks-table.tsx";

export const Route = createLazyFileRoute("/blocks/")({
  component: Blocks,
});

function Blocks() {
  let isIndex = true;
  try {
    const params = useParams({ from: "/blocks/$blockNumber" });
    isIndex = !params.blockNumber;
  } catch (e) {
    console.error(e);
    isIndex = true;
  }

  const text = {
    title: isIndex ? "All blocks" : "Block Details",
  };

  // TODO
  const blocks: BlockTableSchema[] = [];

  return (
    <div className="mx-auto px-[70px] max-w-[1440px]">
      <h1 className="mt-16">{text.title}</h1>
      {isIndex ? <BlocksTable blocks={blocks} /> : <Outlet />}
    </div>
  );
}
