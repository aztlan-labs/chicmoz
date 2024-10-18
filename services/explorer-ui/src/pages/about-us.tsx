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
        <p>
          Since 3 years back we have been building with ZK. And are now building
          a new platform that will simplify for developers that are building on
          privacy-focused blockchains.
        </p>
        <p>
          The easiest way to find us is following <a href="https://x.com/Obscura_Network"
            className="text-purple-light hover:font-bold"
          >@Obscura_Network</a> on X.
        </p>
      </div>
    </div>
  );
};
