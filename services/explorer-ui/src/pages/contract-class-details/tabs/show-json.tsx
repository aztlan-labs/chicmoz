import { FC } from "react"

interface ShowJsonProps {
  data: { [functionName: string]: { [paramName: string]: string } }
}
export const ShowJson: FC<ShowJsonProps> = ({ data }) => {
  return <pre className="overflow-auto">{JSON.stringify(data, null, 2)}</pre>
}
