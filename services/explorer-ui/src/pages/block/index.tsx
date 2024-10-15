import { FC } from "react";
import { BlocksTable } from "~/components/blocks/blocks-table.tsx";
import { useLatestBlocks } from "~/hooks";
import { parseLatestBlocks } from "./util";

export const Blocks: FC = () => {
  const { data: latestBlocks, isLoading, error } = useLatestBlocks();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error.message}</p>;
  if (!latestBlocks) return <p>No data</p>;

  return (
    <div className="mx-auto px-[70px] max-w-[1440px]">
      <h1 className="mt-16">Latest Blocks</h1>
      <BlocksTable blocks={parseLatestBlocks(latestBlocks)} />
    </div>
  );
};
