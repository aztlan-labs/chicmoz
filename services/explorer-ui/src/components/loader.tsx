/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type FC } from "react";
import { Skeleton } from "./ui/skeleton";
interface Props {
  amount: number;
}
export const Loader: FC<Props> = ({ amount }) => {
  return (
    <div className="flex flex-col gap-2 mx-auto w-full transition-all">
      {[...Array(amount)].map((_, index) => (
        <Skeleton key={index} className={"w-full h-7"} />
      ))}
    </div>
  );
};
