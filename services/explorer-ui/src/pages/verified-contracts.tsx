import { type FC } from "react";
// TODO: make verified contracts link process env

export const VerifiedContracts: FC = () => {
  return (
    <div className="flex flex-col items-center">
      <h1>Verified contracts</h1>
      <div className="bg-white w-full rounded-lg shadow-md p-4 md:w-1/2">
        <p>
          Verified contracts mean that we have verified the deployer of the
          contract.
        </p>
        <br />
        <p>
          ⚠️ Please note that this does not mean that the contract is safe to
          use. ⚠️
        </p>
        <br />
        <p>
          You can always find the latest verified contracts by checking{" "}
          <a
            href="https://github.com/aztlan-labs/chicmoz/tree/feat/verified_contracts/services"
            className="text-purple-light hover:font-bold"
          >
            our github-repo
          </a>
          . If you think your contract should be verified, please create a PR to
          that file.
        </p>
      </div>
    </div>
  );
};
