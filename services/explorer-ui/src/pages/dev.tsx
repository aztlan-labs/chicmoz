import { type FC } from "react";
import { VERSION_STRING } from "~/service/constants";

export const DevPage: FC = () => {
  return (
    <div className="flex flex-col items-center">
      <h1>Dev Page</h1>
      <div className="bg-white w-full rounded-lg shadow-md p-4 md:w-1/2">
        <p>Aztec.js version : 0.69.1</p>
        <p>Chicmoz version: {VERSION_STRING}</p>
      </div>
    </div>
  );
};
