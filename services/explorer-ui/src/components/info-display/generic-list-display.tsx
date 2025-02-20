import { FC } from "react"
import { KeyValueDisplay } from "./key-value-display"

interface GenericListDisplayProps {
  title: string
  items: string[]
  itemLabel: string
}

export const GenericListDisplay: FC<GenericListDisplayProps> = ({ title, items, itemLabel }) => (
  <div>
    <h3>{title}</h3>
    {items.map((item, index) => (
      <KeyValueDisplay key={index} data={[{ label: itemLabel, value: item }]} />
    ))}
  </div>
)
