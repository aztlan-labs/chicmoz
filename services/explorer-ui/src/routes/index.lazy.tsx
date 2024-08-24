import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="mx-auto px-[70px] max-w-[1440px]">
      <h1 className="text-center mt-16">{text.exploreThePrivacyOnAztec}</h1>
    </div>
  );
}


const text = {
  exploreThePrivacyOnAztec: "Explore the power of privacy on Aztec",
}