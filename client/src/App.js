import React, {useState, useEffect} from 'react';
import './App.css';
import CreateCustomer from './components/CreateCustomer';
import Customers from './components/Customers';
import CustomerDetails from './components/CustomerDetails';
const { ipcRenderer } = window.require('electron');



function App() {

  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    console.log("hi");

    ipcRenderer.on('asynchronous-reply', (event, arg) => {
        console.log(arg);
        setCustomers(arg);
    }); 

    ipcRenderer.send('asynchronous-message', 'retrieve-customers');
  }, [])

  console.log(customers);
  console.log(selectedCustomer);
  let customerDetails = customers.find(element => (element.id === selectedCustomer));

  return (
    <div className="App">
      < Customers selectedCustomer={selectedCustomer} setSelectedCustomer={setSelectedCustomer} customers={customers}/>
      {selectedCustomer !== '' && <CustomerDetails customerDetails={customers.find(el => el.id === selectedCustomer)}/>}
    </div>
  );
}

export default App;
