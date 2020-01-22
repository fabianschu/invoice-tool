import React, {useState, useEffect} from 'react';
import './App.css';
import Customers from './components/Customers';
import CustomerDetails from './components/CustomerDetails/CustomerDetails';
const { ipcRenderer } = window.require('electron');



function App() {

  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [customers, setCustomers] = useState([]);
  const [showAccounts, setShowAccounts] = useState('');

  useEffect(() => {
    console.log("hi");

    ipcRenderer.on('asynchronous-reply', (event, arg) => {
        console.log('IPC channel communication: ', arg);
        setCustomers(arg);
    }); 

    ipcRenderer.send('read', 'SELECT * FROM customers');
  }, [])

  const handleClick = (event) => {
    setSelectedCustomer(Number(event.target.id));
}

  const handleChange = event => {
    console.log('blur')
    //request main to update database and to return the new database
    console.log(event.target.name);
    console.log(event.target.id);
    // ipcRenderer.send('update', [`UPDATE customers SET ${event.target.name} = ? WHERE id = ?`, [event.target.value, Number(event.target.id)]]);
    /*
    console.log(event.target);
    let data = [event.target.value, Number(event.target.id)];
    console.log(data);
    let sql = `UPDATE customers
                SET firm = ?
                WHERE id = ?`;
    
    db.run(sql, data, function(err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`Row(s) updated: ${this.changes}`);
    
    });
    */
    //set new state
  }

  console.log('App re-renders');

  return (
    <div className="App">
      <Customers selectedCustomer={selectedCustomer} setSelectedCustomer={setSelectedCustomer} customers={customers} handleClick={handleClick}/>

      {selectedCustomer !== '' && <CustomerDetails customerDetails={customers.find(el => el.id === selectedCustomer)} handleChange={handleChange} selectedCustomer={selectedCustomer}/>}
    </div>
  );
}

export default App;
