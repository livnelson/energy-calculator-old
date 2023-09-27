import React, { useState, useEffect } from 'react';
import '../styles/ToggleSwitch.css';

function SummableTable() {
  const initialData = [
    { id: 1, name: 'Air Conditioner', power: 3, usage: 10, surge: 78, ownership: 'notOwn', addBackup: false, quantity: 0 },
    { id: 2, name: 'Heat Pump', power: 3, usage: 15, surge: 50, ownership: 'notOwn', addBackup: false, quantity: 0 },
    { id: 3, name: 'Water Heater', power: 10000, usage: 15, surge: 50, ownership: 'notOwn', addBackup: false, quantity: 0 },
    { id: 4, name: 'Electric Stove', power: 1200, usage: 15, surge: 50, ownership: 'notOwn', addBackup: false, quantity: 0 },
    { id: 5, name: 'EV Charger', power: 7600, usage: 15, surge: 50, ownership: 'notOwn', addBackup: false, quantity: 0 },
  ];

  const [data, setData] = useState(initialData);
  const [sums, setSums] = useState({
    power: 0,
    usage: 0,
    surge: 0,
  });
  const [quantityChanged, setQuantityChanged] = useState(false);

  useEffect(() => {
    if (quantityChanged) {
      // Calculate the sums only if the quantity has been changed at least once
      const newSums = { power: 0, usage: 0, surge: 0 };
      data.forEach((row) => {
        newSums.power += row.power * row.quantity;
        newSums.usage += row.usage * row.quantity;
        newSums.surge += row.surge * row.quantity;
      });
      setSums(newSums);
    }
  }, [data, quantityChanged]);

  const calculateSums = () => {
    // Calculate the sums when called
    const newSums = { power: 0, usage: 0, surge: 0 };
    data.forEach((row) => {
      newSums.power += row.power * row.quantity;
      newSums.usage += row.usage * row.quantity;
      newSums.surge += row.surge * row.quantity;
    });
    setSums(newSums);
  };

  const handleOwnershipToggle = (id) => {
    const newData = data.map((row) =>
      row.id === id ? { ...row, ownership: row.ownership === 'own' ? 'notOwn' : 'own' } : row
    );
    setData(newData);
  };

  const handleBackupToggle = (id) => {
    const newData = data.map((row) =>
      row.id === id ? { ...row, addBackup: !row.addBackup } : row
    );
    setData(newData);
  };

  const handleQuantityChange = (id, newQuantity) => {
    const newData = data.map((row) =>
      row.id === id ? { ...row, quantity: newQuantity } : row
    );
    setData(newData);
    setQuantityChanged(true); // Set quantityChanged to true when quantity is changed
  };

  const handleIncrement = (id) => {
    const newData = data.map((row) =>
      row.id === id ? { ...row, quantity: row.quantity + 1 } : row
    );
    setData(newData);
    handleQuantityChange(id, data.find((row) => row.id === id).quantity + 1);
  };

  const handleDecrement = (id) => {
    const newData = data.map((row) =>
      row.id === id && row.quantity > 0 ? { ...row, quantity: row.quantity - 1 } : row
    );
    setData(newData);
    handleQuantityChange(id, data.find((row) => row.id === id).quantity - 1);
  };
  
    // Function to handle power change for a row
    const handlePowerChange = (e, id) => {
      const newValue = parseInt(e.target.value, 10);
      const newData = data.map((row) =>
        row.id === id ? { ...row, power: newValue } : row
      );
      setData(newData);
      calculateSums();
    };
  
    // Function to handle usage change for a row
    const handleUsageChange = (e, id) => {
      const newValue = parseFloat(e.target.value, 10);
      const newData = data.map((row) =>
        row.id === id ? { ...row, usage: newValue } : row
      );
      setData(newData);
      calculateSums();
    };
  
    // Function to handle surge change for a row
    const handleSurgeChange = (e, id) => {
      const newValue = parseInt(e.target.value, 10);
      const newData = data.map((row) =>
        row.id === id ? { ...row, surge: newValue } : row
      );
      setData(newData);
      calculateSums();
    };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Own</th>
            <th>Backup</th>
            <th>Quantity</th>
            <th>Operating Power</th>
            <th>Daily Usage</th>
            <th>Power Surge / LRA</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td>{row.name}</td>
              <td>
                <label>
                  <button
                    onClick={() => handleOwnershipToggle(row.id)}
                    className={row.ownership === 'own' ? 'own-button' : 'not-own-button'}
                  >
                    {row.ownership}
                  </button>
                </label>
              </td>
              <td>
                <div className={`toggle-switch ${row.addBackup ? 'on' : 'off'}`} onClick={() => handleBackupToggle(row.id)}>
                  <div className="slider"></div>
                </div>
              </td>
              <td>
                <button onClick={() => handleDecrement(row.id)}>-</button>
                <span>{row.quantity}</span>
                <button onClick={() => handleIncrement(row.id)}>+</button>
              </td>
              <td>
                <input
                  type="number"
                  value={row.power}
                  onChange={(e) => handlePowerChange(e, row.id)}
                />
                <span>Tons</span>
              </td>
              <td>
                <input
                  type="number"
                  step="0.01"
                  value={row.usage}
                  onChange={(e) => handleUsageChange(e, row.id)}
                />
                <span>Hours</span>
              </td>
              <td>
                <input
                  type="number"
                  value={row.surge}
                  onChange={(e) => handleSurgeChange(e, row.id)}
                />
                <span>A</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <span>Total Power: {sums.power}kWh</span>
        <span>Total Usage: {sums.usage.toFixed(2)}kW</span>
        <span>Total LRA: {sums.surge}</span>
      </div>
    </div>
  );
}

export default SummableTable;
