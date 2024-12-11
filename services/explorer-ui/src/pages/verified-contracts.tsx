import { type FC } from "react";
import { Link } from "@tanstack/react-router";
import { useVerifiedContracts } from "~/hooks/verified-contract";
import { routes } from "~/routes/__root";

const contractInstanceDetailsRoute =
  routes.contracts.route + routes.contracts.children.instances.route + "/";
export const VerifiedContracts: FC = () => {
  const { data, isError, isLoading } = useVerifiedContracts();
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
          use, nor that we endorse the contract. ⚠️
        </p>
        <br />
        <p>
          You can always find the latest verified contracts by checking{" "}
          <a
            href="https://github.com/aztlan-labs/chicmoz/blob/feat/verified_contracts/services/explorer-api/src/constants.ts"
            className="text-purple-light hover:font-bold"
          >
            our github-repo
          </a>
          . If you think your contract should be verified, please create a PR to
          that file.
        </p>
        <br />
        <hr />
        <h2>Verified contracts:</h2>
        {isLoading && <p>Loading...</p>}
        {isError && <p>Something went wrong...</p>}
        {data && data.length === 0 && <p>No verified contracts found</p>}
        {data && data.length > 0 && (
          <ul>
            {data.map((contract, index) => (
              <li key={index}>
                <hr />
                <h3>"{contract.name}"</h3>
                <p>{contract.details}</p>
                <p>Contact: {contract.contact}</p>
                <p>
                  UI:
                  <a href={contract.uiUrl} className="text-purple-light">
                    {contract.uiUrl}
                  </a>
                </p>
                <p>
                  Repo:
                  <a href={contract.repoUrl} className="text-purple-light">
                    {contract.repoUrl}
                  </a>
                </p>
                <Link
                  to={
                    contractInstanceDetailsRoute +
                    contract.contractInstanceAddress
                  }
                  className="text-purple-light"
                >
                  View contract
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
