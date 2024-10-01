import { FC } from "react";

interface Props {
  title: string;
  details: string[];
}
export const TxEffextDetailsDisplay: FC<Props> = ({ title, details }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3>{title}</h3>
      <p>{details.join(", ")}</p>
    </div>
  );
};
