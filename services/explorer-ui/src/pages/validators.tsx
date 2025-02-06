import { L1L2ValidatorStatus } from "@chicmoz-pkg/types";
import { type FC } from "react";
import { useSubTitle } from "~/hooks";
import { useL1L2Validators } from "~/hooks/api/l1-l2-validator";
import { routes } from "~/routes/__root";

const tdClasses = "p-2 border border-gray-300";

export const ValidatorsPage: FC = () => {
  useSubTitle(routes.validators.title);
  const { data, isLoading, error } = useL1L2Validators();
  return (
    <div className="flex flex-col items-center">
      <h1>{routes.validators.title}</h1>

      <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
        {isLoading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        {!!data && (
          <table>
            <thead>
              <tr>
                <th>Attester</th>
                <th>Stake</th>
                <th>Withdrawer</th>
                <th>Proposer</th>
                <th>Status</th>
                <th>First Seen At</th>
                <th>Latest Seen Change At</th>
              </tr>
            </thead>
            <tbody>
              {data
                .sort((a, b) => (Number(b.stake) ?? 0) - (Number(a.stake) ?? 0))
                .map((validator) => (
                  <tr key={validator.attester}>
                    <td className={`${tdClasses} font-mono`}>
                      {validator.attester}
                    </td>
                    <td className={tdClasses}>{Number(validator.stake)}</td>
                    <td className={`${tdClasses} font-mono`}>
                      {validator.withdrawer}
                    </td>
                    <td className={`${tdClasses} font-mono`}>
                      {validator.proposer}
                    </td>
                    <td className={tdClasses}>
                      {L1L2ValidatorStatus[validator.status].toString()}
                    </td>
                    <td className={tdClasses}>
                      {validator.firstSeenAt.toISOString()}
                    </td>
                    <td className={tdClasses}>
                      {validator.latestSeenChangeAt.toISOString()}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
