import { useState, useEffect } from "react"
import SummableTable from "./SummableTable"
// import GeneralHousehold from "./GeneralHousehold"
import '../styles/App.css'

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    fetch("/hello")
      .then((r) => r.json())
      .then((data) => setCount(data.count))
  }, [])

  return (
    <div className="App">
      {/* <GeneralHousehold /> */}
      <SummableTable />
    </div>
  )
}

export default App