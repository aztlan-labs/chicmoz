import { type FC } from "react";

export const AboutUs: FC = () => {
  return (
    <div className="flex flex-col items-center">
      <h1>About Us</h1>
      <div className="bg-white w-full rounded-lg shadow-md p-4 md:w-1/2">
        <p>
          We are a team of developers and designers who are passionate about
          privacy on the internet. We have been building in the crypto space for
          over 5 years and have a deep understanding of the technology and the
          community.
        </p>
        <br />
        <p>
          Obscura is a platform dedicated to simplifying the development of
          privacy-oriented applications on blockchain technology. It provides a
          solid foundation, offering RPC endpoints, APIs, and SDKs to streamline
          app development on leading privacy-focused blockchains. These tools
          are designed to help developers efficiently construct, deploy, and
          maintain applications that prioritize user privacy, leveraging
          Obscura's specialized infrastructure.
        </p>
        <br />
        <p>
          The easiest way to find us is following{" "}
          <a
            href="https://x.com/Obscura_Network"
            className="text-purple-light hover:font-bold"
          >
            @Obscura_Network
          </a>{" "}
          on X.
        </p>
      </div>
    </div>
  );
};
