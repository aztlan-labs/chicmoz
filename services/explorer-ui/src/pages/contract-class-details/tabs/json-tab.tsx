import { FC } from "react"

interface JsonTabProps {
  data: { [functionName: string]: { [paramName: string]: string } }
}
export const JsonTab: FC<JsonTabProps> = ({ data }) => {
  return <pre className="overflow-auto">{JSON.stringify(data, null, 2)}</pre>
}
