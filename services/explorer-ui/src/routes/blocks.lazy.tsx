import { Outlet, createLazyFileRoute, useParams } from "@tanstack/react-router";
import { BlocksTable } from "~/components/blocks/blocks-table.tsx";

export const Route = createLazyFileRoute("/blocks")({
  component: Blocks,
});

function Blocks() {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const params = useParams("/blocks") as { blockNumber?: string };
  const isIndex = !params.blockNumber;

  const text = {
    title: isIndex ? "All blocks" : "Block Details",
  };

  return (
    <div className="mx-auto px-[70px] max-w-[1440px]">
      <h1 className="mt-16">{text.title}</h1>
      {isIndex ? <BlocksTable /> : <Outlet />}
    </div>
  );
}
