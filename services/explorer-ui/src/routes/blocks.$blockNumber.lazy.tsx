import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/blocks/$blockNumber")({
  component: Block,
});

function Block() {
  const { blockNumber } = Route.useParams()
  console.log("blockNumber", blockNumber)
  // TODO: HELP MAURO, I can't see this page!
  return (
    <div className="mx-auto px-[70px] max-w-[1440px]">
      <h1 className="mt-16">{text.title}</h1>
      <p>Block Number: {blockNumber}</p>
      {/* TODO: Fetch and display block data */}
    </div>
  );
}

const text = {
  title: "Title TODO",
}

