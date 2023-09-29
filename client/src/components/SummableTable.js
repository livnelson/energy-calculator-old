import React, { useState, useEffect } from 'react'
import '../styles/SummableTable.css' // Import CSS for styling
import '../styles/ToggleSwitch.css' // Import CSS for the toggle switch styling

function SummableTable() {
  // Define initial data for table rows, with 'ownership' initially set to an empty string
  const initialData = [
    { id: 1, name: 'Air Conditioner', power: 3, usage: 10, surge: 78, ownership: '', addBackup: false, quantity: 0 },
    { id: 2, name: 'Heat Pump', power: 3, usage: 15, surge: 50, ownership: '', addBackup: false, quantity: 0 },
    { id: 3, name: 'Water Heater', power: 10000, usage: 15, surge: 50, ownership: '', addBackup: false, quantity: 0 },
    { id: 4, name: 'Electric Stove', power: 1200, usage: 15, surge: 50, ownership: '', addBackup: false, quantity: 0 },
    { id: 5, name: 'EV Charger', power: 7600, usage: 15, surge: 50, ownership: '', addBackup: false, quantity: 0 },
  ]

  const [data, setData] = useState(initialData) // State to store the table data
  const [sums, setSums] = useState({ // State to store sums of power, usage, and surge
    power: 0,
    usage: 0,
    surge: 0,
  })
  const [quantityChanged, setQuantityChanged] = useState(false) // State to track if quantity has changed

  useEffect(() => {
    if (quantityChanged) {
      // Calculate the sums only if the quantity has been changed at least once
      const newSums = { power: 0, usage: 0, surge: 0 }
      data.forEach((row) => {
        newSums.power += row.power * row.quantity
        newSums.usage += row.usage * row.quantity
        newSums.surge += row.surge * row.quantity
      })
      setSums(newSums) // Update sums state
    }
  }, [data, quantityChanged])

  // Function to calculate sums based on the data
  const calculateSums = () => {
    const newSums = { power: 0, usage: 0, surge: 0 }
    data.forEach((row) => {
      newSums.power += row.power * row.quantity
      newSums.usage += row.usage * row.quantity
      newSums.surge += row.surge * row.quantity
    })
    setSums(newSums) // Update sums state
  }

  // Function to handle ownership toggle for a row
  const handleOwnershipToggle = (id) => {
    const newData = data.map((row) =>
      row.id === id ? { ...row, ownership: row.ownership === '✓' ? '' : '✓' } : row
    )
    setData(newData) // Update data state
  }

  // Function to handle backup toggle for a row
  const handleBackupToggle = (id) => {
    const newData = data.map((row) =>
      row.id === id ? { ...row, addBackup: !row.addBackup } : row
    )
    setData(newData) // Update data state
  }

  // Function to handle quantity change for a row
  const handleQuantityChange = (id, newQuantity) => {
    const newData = data.map((row) =>
      row.id === id ? { ...row, quantity: newQuantity } : row
    )
    setData(newData) // Update data state
    setQuantityChanged(true) // Set quantityChanged to true when quantity is changed
  }

  // Function to increment quantity for a row
  const handleIncrement = (id) => {
    const newData = data.map((row) =>
      row.id === id ? { ...row, quantity: row.quantity + 1 } : row
    )
    setData(newData) // Update data state
    handleQuantityChange(id, data.find((row) => row.id === id).quantity + 1)
  }

  // Function to decrement quantity for a row
  const handleDecrement = (id) => {
    const newData = data.map((row) =>
      row.id === id && row.quantity > 0 ? { ...row, quantity: row.quantity - 1 } : row
    )
    setData(newData) // Update data state
    handleQuantityChange(id, data.find((row) => row.id === id).quantity - 1)
  }

  // Function to handle power change for a row
  const handlePowerChange = (e, id) => {
    const newValue = parseInt(e.target.value, 10)
    const newData = data.map((row) =>
      row.id === id ? { ...row, power: newValue } : row
    )
    setData(newData) // Update data state
    calculateSums()
  }

  // Function to handle usage change for a row
  const handleUsageChange = (e, id) => {
    const newValue = parseFloat(e.target.value, 10)
    const newData = data.map((row) =>
      row.id === id ? { ...row, usage: newValue } : row
    )
    setData(newData) // Update data state
    calculateSums()
  }

  // Function to handle surge change for a row
  const handleSurgeChange = (e, id) => {
    const newValue = parseInt(e.target.value, 10)
    const newData = data.map((row) =>
      row.id === id ? { ...row, surge: newValue } : row
    )
    setData(newData) // Update data state
    calculateSums()
  }


  return (
    <div>
      <table className='table'>
        <thead>
          <tr>
            <th className='table-header'>Name</th>
            <th className='table-header'>Own</th>
            <th className='table-header'>Backup</th>
            <th className='table-header'>Quantity</th>
            <th className='table-header'>Operating Power</th>
            <th className='table-header'>Daily Usage</th>
            <th className='table-header'>Power Surge / LRA</th>
          </tr>
        </thead>
        <tbody className='table-body'>
          {data.map((row) => (
            <tr key={row.id} className='table-row'>
              <td className='row-name'>{row.name}</td>
              <td>
                <button
                  className={row.ownership === '✓' ? 'own-button' : 'not-own-button'}
                  onClick={() => handleOwnershipToggle(row.id)}
                >
                  {row.ownership}
                </button>
              </td>
              <td className='toggle-cell'>
                <div className={`toggle-switch ${row.addBackup ? 'on' : 'off'}`} onClick={() => handleBackupToggle(row.id)}>
                  <div className="slider"></div>
                </div>
              </td>
              <td>
                <button className='row-decrement' onClick={() => handleDecrement(row.id)}>-</button>
                <span>{row.quantity}</span>
                <button className='row-increment' onClick={() => handleIncrement(row.id)}>+</button>
              </td>
              <td>
              <div className='input-div'>
                <input
                  className='row-input'
                  type="number"
                  value={row.power}
                  onChange={(e) => handlePowerChange(e, row.id)}
                />
                <span>Tons</span>
                </div>
              </td>
              <td>
                <div className='input-div'>
                  <input
                    className='row-input'
                    type="number"
                    step="0.01"
                    value={row.usage}
                    onChange={(e) => handleUsageChange(e, row.id)}
                  />
                  <span>Hours</span>
                </div>
              </td>
              <td>
              <div className='input-div'>
                <input
                  className='row-input'
                  type="number"
                  value={row.surge}
                  onChange={(e) => handleSurgeChange(e, row.id)}
                />
                <span>A</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='totals'>
        <span>Total Power: {sums.power}kWh</span>
        <span>Total Usage: {sums.usage.toFixed(2)}kW</span>
        <span>Total LRA: {sums.surge}</span>
      </div>
    </div>
  )
}

export default SummableTable
