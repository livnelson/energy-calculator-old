import React, { useState, useEffect } from 'react'
import '../styles/SummableTable.css' // Import CSS for styling
import '../styles/ToggleSwitch.css' // Import CSS for the toggle switch styling

function SummableTable() {
  // Define initial data for table rows, with 'ownership' initially set to an empty string
  const initialData = [
    { id: 1, name: 'Microwave', power: .12, usage: 0, ownership: '', addBackup: false, quantity: 0 },
    { id: 2, name: 'Light Bulbs', power: .02, usage: 0, ownership: '', addBackup: false, quantity: 0 },
    { id: 3, name: 'TV', power: 0.48, usage: 0, ownership: '', addBackup: false, quantity: 0 },
    { id: 4, name: 'Fridge', power: 60, usage: 0, ownership: '', addBackup: false, quantity: 0 },
    { id: 5, name: 'Router', power: .015, usage: 0, ownership: '', addBackup: false, quantity: 0 },
    { id: 6, name: 'Central AC', power: 10.55, usage: 0, ownership: '', addBackup: false, quantity: 0 },
    { id: 7, name: 'Heat Pump', power: 10.5, usage: 0, ownership: '', addBackup: false, quantity: 0 },
    { id: 8, name: 'Water Heater', power: 500, usage: 0, ownership: '', addBackup: false, quantity: 0 },
    { id: 9, name: 'Oven', power: 2.3, usage: 0, ownership: '', addBackup: false, quantity: 0 },
    { id: 10, name: 'Vacuum Cleaner', power: .75, usage: 0, ownership: '', addBackup: false, quantity: 0 },
    { id: 11, name: 'Hair Dryer', power: 1.5, usage: 0, ownership: '', addBackup: false, quantity: 0 },
    { id: 12, name: 'Pool', power: 1.12, usage: 0, ownership: '', addBackup: false, quantity: 0 },
    { id: 13, name: 'EV Charger', power: 7.2, usage: 0, ownership: '', addBackup: false, quantity: 0 },
  ]

  const [data, setData] = useState(initialData) // State to store the table data
  const [sums, setSums] = useState({
    power: 0,
    usage: 0,
    kWh: 0,
  })
  const [quantityChanged, setQuantityChanged] = useState(false) // State to track if quantity has changed

  useEffect(() => {
    if (quantityChanged) {
      // Calculate the sums only if the quantity has been changed at least once
      const newSums = { power: 0, usage: 0, kWh: 0 }
      data.forEach((row) => {
        newSums.power += row.power * row.quantity
        newSums.usage += row.usage * row.quantity
        newSums.kWh += row.power * row.usage * row.quantity // Include row.power * row.usage in kWh calculation
      })
      setSums(newSums) // Update sums state
    }
  }, [data, quantityChanged])

  // Function to calculate sums based on the data
  const calculateSums = () => {
    const newSums = { power: 0, usage: 0, kWh: 0 }
    data.forEach((row) => {
      newSums.power += row.power * row.quantity
      newSums.usage += row.power * row.quantity
      newSums.kWh += row.power * row.usage
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
    const updatedData = data.map((row) =>
      row.id === id ? { ...row, quantity: Math.max(row.quantity - 1, 0) } : row
    );
    setData(updatedData);
    handleQuantityChange(id, Math.max(data.find((row) => row.id === id).quantity - 1, 0));
  }  

  // Function to handle power change for a row
  const handlePowerChange = (e, id) => {
    const newValue = parseFloat(e.target.value, 10)
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

  return (
    <div className='energy-calculator'>
      <table className='table'>
        <thead>
          <tr>
            <th className='table-header'>Appliance</th>
            <th className='table-header'>Own</th>
            <th className='table-header'>Backup</th>
            <th className='table-header'>Quantity</th>
            <th className='table-header'>Operating Power</th>
            <th className='table-header'>Daily Usage</th>
          </tr>
        </thead>
        <tbody className='table-body'>
          {data.map((row) => (
            <tr key={row.id} className='table-row'>
              <td className='row-name'>{row.name}</td>
              {/* Does the customer OWN this device? */}
              <td>
                <button
                  className={row.ownership === '✓' ? 'own-button' : 'not-own-button'}
                  onClick={() => handleOwnershipToggle(row.id)}
                >
                  {row.ownership}
                </button>
              </td>
              {/* Does the customer want to BACKUP this device? */}
              <td className='toggle-cell'>
                <div className={`toggle-switch ${row.addBackup ? 'on' : 'off'}`} onClick={() => handleBackupToggle(row.id)}>
                  <div className="slider"></div>
                </div>
              </td>
              {/* HOW MANY of this device does the customer own? */}
              <td>
                <div className='quantity-row'>
                  <button className='row-decrement' onClick={() => handleDecrement(row.id)}>-</button>
                  <span>{row.quantity}</span>
                  <button className='row-increment' onClick={() => handleIncrement(row.id)}>+</button>
                </div>
              </td>
              {/* Average OPERATING POWER for this device */}
              <td>
                <div>
                  <input
                    className='power-row-input'
                    type='number'
                    step='0.01'
                    min='0' // Set a minimum value of 0 to prevent negative values
                    value={row.power}
                    onChange={(e) => handlePowerChange(e, row.id)}
                  />
                  <span>kW</span>
                </div>
              </td>
              {/* How many HOURS does the customer run this device a day? */}
              <td>
                <div>
                  <input
                    className='usage-row-input'
                    type='number'
                    step='0.25'
                    min='0' // Set a minimum value of 0 to prevent negative values
                    value={row.usage}
                    onChange={(e) => handleUsageChange(e, row.id)}
                  />
                  <span>Hours</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='total-bar'>
        <div className='totals'>
          <span className='total-sum'>Total Power: {sums.power.toFixed(2)}kW</span>
          <span className='total-sum'>Total kWh: {sums.kWh.toFixed(2)}kWh</span>
        </div>
      </div>
    </div>
  )
}

export default SummableTable