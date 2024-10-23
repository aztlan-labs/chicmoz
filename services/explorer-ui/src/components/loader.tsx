/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { FC } from "react";
import { Skeleton } from "./ui/skeleton";
interface Props {
  amout: number;
}
export const Loader: FC<Props> = ({ amout, horizontal }) => {
  return (
    <div className="flex flex-col gap-2 mx-auto w-full transition-all">
      {[...Array(amout)].map((_, index) => (
        <Skeleton key={index} className={"w-full h-7"} />
      ))}
    </div>
  );
};
