import { type FC } from "react";
import {
  API_URL,
  L2_NETWORK_ID,
  VERSION_STRING,
  WS_URL,
} from "~/service/constants";

export const DevPage: FC = () => {
  return (
    <div className="flex flex-col items-center">
      <h1>Dev Page</h1>
      <div className="bg-white w-full rounded-lg shadow-md p-4 md:w-1/2">
        <p>Aztec.js version : 0.71.0</p>
        <hr />
        <p>Explorer version: {VERSION_STRING}</p>
        <hr />
        <p>API URL: {API_URL}</p>
        <hr />
        <p>WS URL: {WS_URL}</p>
        <hr />
        <p>Indexing Aztec network: {L2_NETWORK_ID}</p>
      </div>
    </div>
  );
};
