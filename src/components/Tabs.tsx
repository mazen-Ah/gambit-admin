import { Dispatch } from "react"

export default function Tabs({ tabs, value, setValue }: { tabs: { title: string, value: string }[], value: string, setValue: Dispatch<React.SetStateAction<string>>|((value: string)=>void) }) {
  return (
    <div className="tabs">
      {tabs.map(tab => {
        return (
          <div
            className={`tab ${value === tab.value ? 'active' : ''}`}
            onClick={() => {
              setValue(tab.value)
            }}
          >
            {tab.title}
          </div>
        )
      })}
    </div>
  )
}
