import { FC } from "react";
import { KeyValueDisplay } from "~/components/info-display/key-value-display";
import { routes } from "~/routes/__root";
import { naiveDecode } from "../utils";

interface PuclicLogsArgs {
  logs: string[][]
}
export const PublicLogs: FC<PuclicLogsArgs> = ({ logs }) => {
  return (
    <div>
      {logs.map(([contractAddress, ...logData], index) => (
        <div key={index}>
          <h4>Log {index + 1}</h4>
          <KeyValueDisplay
            data={[
              {
                label: "data",
                value: naiveDecode(logData),
              },
              {
                label: "Contract Address",
                value: contractAddress,
                link: `${routes.contracts.route}/${routes.contracts.children.instances.route}/${contractAddress}`,
              },
            ]}
          />
        </div>
      ))}
    </div>
  )
}
