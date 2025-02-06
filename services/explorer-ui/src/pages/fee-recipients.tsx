import { type FC } from "react";
import { useSubTitle } from "~/hooks";
import { useFeeRecipients } from "~/hooks/api/fee-recipient";
import { routes } from "~/routes/__root";

const tdClasses = "p-2 border border-gray-300";

export const FeeRecipientPage: FC = () => {
  useSubTitle(routes.feeRecipients.title);
  const { data, isLoading, error } = useFeeRecipients();
  return (
    <div className="flex flex-col items-center">
      <h1>Fee Recipients</h1>

      <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
        {isLoading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        {data && (
          <table>
            <thead>
              <tr>
                <th>Address</th>
                <th>Number of blocks</th>
                <th>Total Fees Received</th>
                <th>Part of Fees Received</th>
              </tr>
            </thead>
            <tbody>
              {data
                .sort(
                  (a, b) =>
                    (b.partOfTotalFeesReceived ?? 0) -
                    (a.partOfTotalFeesReceived ?? 0)
                )
                .map((feeRecipient) => (
                  <tr key={feeRecipient.l2Address}>
                    <td className={tdClasses}>{feeRecipient.l2Address}</td>
                    <td className={tdClasses}>{feeRecipient.nbrOfBlocks}</td>
                    <td className={tdClasses}>
                      {Number(feeRecipient.feesReceived)}
                    </td>
                    <td className={tdClasses}>
                      {feeRecipient.partOfTotalFeesReceived}
                    </td>
                  </tr>
                ))}
              <tr key="total">
                <td className={tdClasses}>TOTAL</td>
                <td className={tdClasses}>
                  {data.reduce((acc, v) => acc + v.nbrOfBlocks, 0)}
                </td>
                <td className={tdClasses}>
                  {data.reduce((acc, v) => acc + Number(v.feesReceived), 0)}
                </td>
                <td className={tdClasses}>1.0</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
