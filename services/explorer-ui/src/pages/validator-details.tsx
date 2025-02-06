import { L1L2ValidatorStatus } from "@chicmoz-pkg/types";
import { useParams } from "@tanstack/react-router";
import { type FC } from "react";
import { useSubTitle } from "~/hooks";
import {
  useL1L2Validator,
  useL1L2ValidatorHistory,
} from "~/hooks/api/l1-l2-validator";
import { formatTimeSince } from "~/lib/utils";
import { routes } from "~/routes/__root";

const tdClasses = "p-2 border border-gray-300";

export const ValidatorDetailsPage: FC = () => {
  // TODO: better title
  useSubTitle(routes.validators.children.attesterAddress.title);
  const { attesterAddress } = useParams({
    from: "/validators/$attesterAddress",
  });
  const { data, isLoading, error } = useL1L2Validator(attesterAddress);
  const {
    data: historyData,
    isLoading: isHistoryLoading,
    error: historyError,
  } = useL1L2ValidatorHistory(attesterAddress);

  return (
    <div className="flex flex-col items-center">
      <h1>{attesterAddress}</h1>
      <pre>
        Available statuses:{" "}
        {[0, 1, 2, 3]
          .map((status) => L1L2ValidatorStatus[status].toString())
          .join(", ")}
      </pre>
      <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
        <h2>Details</h2>
        {isLoading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        {!!data && (
          <pre>
            <p>{`Attester status:  ${L1L2ValidatorStatus[data.status]}`}</p>
            <p>{`Attester address: ${data.attester}`}</p>
            <p>{`Withdrawer:       ${data.withdrawer}`}</p>
            <p>{`Proposer:         ${data.proposer}`}</p>
            <p>{`Stake:            ${Number(data.stake)}`}</p>
            <p>{`First seen at:    ${data.firstSeenAt.toISOString()}`}</p>
            <p>{`Latest change:    ${formatTimeSince(
              data.latestSeenChangeAt.getTime()
            )}`}</p>
          </pre>
        )}
        <h2>History</h2>
        {isHistoryLoading && <p>Loading...</p>}
        {historyError && <p>Error: {historyError.message}</p>}
        {historyData && (
          <table>
            <thead>
              <tr>
                <th className="p-2">Time since</th>
                <th className="p-2">Key changed</th>
                <th className="p-2">New value</th>
                <th className="p-2">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map(([timestamp, keyChanged, newValue]) => (
                <tr key={timestamp.getTime()}>
                  <td className={tdClasses}>
                    {formatTimeSince(timestamp.getTime())}
                  </td>
                  <td className={tdClasses}>{keyChanged}</td>
                  <td className={tdClasses}>{newValue}</td>
                  <td className={tdClasses}>{timestamp.toISOString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
