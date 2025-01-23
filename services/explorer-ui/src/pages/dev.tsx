import { type FC } from "react";
import { useChainErrors, useChainInfo } from "~/hooks/chain-info";
import { useSequencers } from "~/hooks/sequencer";
import { formatTimeSince } from "~/lib/utils";
import {
  API_URL,
  L2_NETWORK_ID,
  VERSION_STRING,
  WS_URL,
} from "~/service/constants";

export const DevPage: FC = () => {
  const {
    data: chainInfo,
    isLoading: isChainInfoLoading,
    error: chainInfoError,
  } = useChainInfo();

  const {
    data: chainErrors,
    isLoading: isChainErrorsLoading,
    error: chainErrorsError,
  } = useChainErrors();

  const {
    data: sequencers,
    isLoading: isSequencersLoading,
    error: sequencersError,
  } = useSequencers();

  return (
    <div className="flex flex-col items-center">
      <h1>Dev Page</h1>
      <div className="bg-white w-full rounded-lg shadow-md p-4 md:w-1/2">
        <pre>
          <p>Aztec.js version           0.71.0</p>
          <hr />
          <p>Explorer version           {VERSION_STRING}</p>
          <hr />
          <p>API URL                    {API_URL}</p>
          <hr />
          <p>WS URL                     {WS_URL}</p>
          <hr />
          <p>Indexing Aztec network     {L2_NETWORK_ID}</p>
        </pre>
      </div>
      <div className="bg-white w-full rounded-lg shadow-md p-4 md:w-1/2 mt-4">
        <h2>Chain Info</h2>
        {isChainInfoLoading && <p>Loading...</p>}
        {chainInfoError && <p>Error: {chainInfoError.message}</p>}
        {chainInfo && <pre>{JSON.stringify(chainInfo, null, 2)}</pre>}
      </div>

      <div className="bg-white w-full rounded-lg shadow-md p-4 md:w-1/2 mt-4">
        <h2>Chain Errors</h2>
        {isChainErrorsLoading && <p>Loading...</p>}
        {chainErrorsError && <p>Error: {chainErrorsError.message}</p>}
        {chainErrors && (
          <div>
            {chainErrors?.map((error) => (
              <pre>
                <hr />
                <h3>{error.name}</h3>
                {`
rpcNodeId:      ${error.rpcNodeId}
count:          ${error.count}
cause:          ${error.cause}
firstSeen:      ${formatTimeSince(error.createdAt.getTime())} ago
lastSeenAt:     ${formatTimeSince(error.lastSeenAt.getTime())} ago
data:           ${JSON.stringify(error.data)}

message:        ${error.message}

stack:          ${error.stack}
`}
              </pre>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white w-full rounded-lg shadow-md p-4 md:w-1/2 mt-4">
        <h2>Sequencers</h2>
        {isSequencersLoading && <p>Loading...</p>}
        {sequencersError && <p>Error: {sequencersError.message}</p>}
        {sequencers && <p>Sequencers count: {sequencers?.length}</p>}
        {sequencers && <pre>{JSON.stringify(sequencers, null, 2)}</pre>}
      </div>
    </div>
  );
};
