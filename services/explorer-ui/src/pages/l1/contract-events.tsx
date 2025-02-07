import { type FC } from "react";
import { useSubTitle } from "~/hooks";
import { useContractEvents } from "~/hooks/api/l1/contract-events";
import { routes } from "~/routes/__root";

const tdClasses = "p-2 border border-gray-300";

export const ContractEventsPage: FC = () => {
  useSubTitle(routes.l1.children.contractEvents.title);
  const { data, isLoading, error } = useContractEvents();
  return (
    <div className="flex flex-col items-center">
      <h1>L1 Contract Events</h1>

      <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
        {isLoading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        {data && (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Event Name</th>
                <th>Contract Address</th>
                <th>Block Number</th>
                <th>Transaction Hash</th>
              </tr>
            </thead>
            <tbody>
              {data
                .sort(
                  (a, b) => Number(b.l1BlockNumber) - Number(a.l1BlockNumber)
                )
                .map((event, index) => (
                  <tr key={index}>
                    <td className={tdClasses}>
                      {
                        event.id
                        // TODO: remove, use link instead
                      }
                    </td>
                    <td className={tdClasses}>{event.eventName}</td>
                    <td className={tdClasses}>{event.l1ContractAddress}</td>
                    <td className={tdClasses}>{Number(event.l1BlockNumber)}</td>
                    <td className={tdClasses}>
                      {event.l1TransactionHash ?? "N/A"}
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
