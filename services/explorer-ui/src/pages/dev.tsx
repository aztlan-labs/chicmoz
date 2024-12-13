import { type FC } from "react";

export const DevPage: FC = () => {
  return (
    <div className="flex flex-col items-center">
      <h1>Dev Page</h1>
      <div className="bg-white w-full rounded-lg shadow-md p-4 md:w-1/2">
        <p>Aztec.js version : 0.67.0</p>
      </div>
    </div>
  );
};
