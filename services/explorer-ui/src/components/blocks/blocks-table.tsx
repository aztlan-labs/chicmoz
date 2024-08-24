import { blockTableColumns } from "~/components/blocks/block-table-columns";
import { allBlocks } from "~/components/blocks/blocks";
import { DataTable } from "~/components/data-table";

export const BlocksTable = () => {
  const blocks = getBlocks();

  return (
    <section className="relative mx-auto w-full transition-all">
      <DataTable data={blocks} columns={blockTableColumns} />
    </section>
  );
};


const getBlocks =  () => {
  return allBlocks.blocks;
}