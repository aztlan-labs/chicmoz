import { Link } from "@tanstack/react-router";
import { type FC } from "react";
import { useSubTitle, useVerifiedContractInstances } from "~/hooks";
import { routes } from "~/routes/__root";

const contractInstanceDetailsRoute =
  routes.contracts.route + routes.contracts.children.instances.route + "/";
export const VerifiedContractInstances: FC = () => {
  const { data, isError, isLoading } = useVerifiedContractInstances();
  useSubTitle(routes.verifiedContractInstances.title);
  return (
    <div className="flex flex-col items-center">
      <h1>Verified contract instances</h1>
      <div className="bg-white w-full rounded-lg shadow-md p-4 md:w-1/2">
        <p>
          Verified contract instances mean that we have verified the deployer of
          the contract.
        </p>
        <br />
        <p>
          ⚠️ Please note that this does not mean that the contract is safe to
          use, nor that we endorse the contract. ⚠️
        </p>
        <br />
        <p>
          You can always find the latest verified contract instances by checking{" "}
          <a
            href="https://github.com/aztlan-labs/chicmoz/blob/main/services/explorer-api/src/constants.ts"
            className="text-purple-light hover:font-bold"
          >
            our github-repo
          </a>
          . If you think your contract instance should be verified, please
          create a PR to that file.
        </p>
        <br />
        <hr />
        <h2>Verified contracts:</h2>
        {isLoading && <p>Loading...</p>}
        {isError && <p>Something went wrong...</p>}
        {data && data.length === 0 && (
          <p>No verified contract instances found</p>
        )}
        {data && data.length > 0 && (
          <ul>
            {data.map((contract, index) => (
              <li key={index}>
                <hr />
                <h3>"{contract.contractIdentifier}"</h3>
                <p>{contract.details}</p>
                <p>Created by: {contract.creatorName}</p>
                <p>Contact: {contract.creatorContact}</p>
                <p>
                  App/UI:
                  <a href={contract.appUrl} className="text-purple-light">
                    {contract.appUrl}
                  </a>
                </p>
                <p>
                  Repo:
                  <a href={contract.repoUrl} className="text-purple-light">
                    {contract.repoUrl}
                  </a>
                </p>
                <Link
                  to={contractInstanceDetailsRoute + contract.address}
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
