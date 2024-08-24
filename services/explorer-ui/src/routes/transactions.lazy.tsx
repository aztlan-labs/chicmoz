import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/transactions")({
  component: Transactions,
});

function Transactions() {
  return (
    <div className="mx-auto px-[70px] max-w-[1440px]">
      <h1 className="mt-16">{text.title}</h1>
    </div>
  );
}

const text = {
  title: "All transactions",
}