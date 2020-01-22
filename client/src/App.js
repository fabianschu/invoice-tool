import React, {useState, useEffect} from 'react';
import './App.css';
import Customers from './components/Customers';
import CustomerDetails from './components/CustomerDetails/CustomerDetails';
import NewCustomer from './components/NewCustomer/NewCustomer';
const { ipcRenderer } = window.require('electron');



function App() {

  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [customers, setCustomers] = useState([]);
  const [showAccounts, setShowAccounts] = useState('');

  useEffect(() => {
    console.log("hi");
    
    
    ipcRenderer.on('customer-creation', (event, arg) => { 
      console.log('IPC channel communication - select customer: ', arg);
      let index = arg[arg.length-1].id;
      setCustomers(arg);
      setSelectedCustomer(index);
    }); 
    
    ipcRenderer.on('asynchronous-reply', (event, arg) => {
        console.log('IPC channel communication - NEW ARRAY: ', arg);
        setCustomers(arg);
    }); 

    ipcRenderer.send('read', 'SELECT * FROM customers');
  }, [])

  const handleCustomerSelection = (event) => {
    setSelectedCustomer(Number(event.target.id));
}

  console.log('App re-renders');
  console.log(selectedCustomer);
  console.log(customers);
  console.log(customers.find(el => el.id === Number(selectedCustomer)));

  return (
    <div className="App">
      <Customers setSelectedCustomer={setSelectedCustomer} customers={customers}/>
      {
        // if state is empty string render empty fragment
        selectedCustomer === '' 
        ?
        <></>
        //else check if selected cutomer = 'new'
        :
        selectedCustomer === 'new'
        ?
        <NewCustomer setSelectedCustomer={setSelectedCustomer}/>
        :
        <CustomerDetails customerDetails={customers.find(el => el.id === Number(selectedCustomer))}  selectedCustomer={selectedCustomer} setSelectedCustomer={setSelectedCustomer}/>
      }
    </div>
  );
}

export default App;
