import { FC } from "react"
import { KeyValueDisplay } from "~/components/info-display/key-value-display"

interface PublicDataWrite {
  leafSlot: string
  value: string
}

export const PublicDataWrites: FC<{ writes: PublicDataWrite[] }> = ({ writes }) => (
  <div>
    {writes.map((write, index) => (
      <div key={index}>
        <h4>Write {index + 1}</h4>
        <KeyValueDisplay
          data={[
            { label: "Leaf Slot", value: write.leafSlot },
            { label: "Value", value: write.value },
          ]}
        />
      </div>
    ))}
  </div>
)
