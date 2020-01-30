import React, {useState, useEffect} from 'react';
import styled, {ThemeProvider, createGlobalStyle} from 'styled-components';
import Customers from './components/Customers/Customers';
import CustomerDetails from './components/CustomerDetails/CustomerDetails';
import NewCustomer from './components/NewCustomer/NewCustomer';
import CreateInvoice from './components/CreateInvoice/CreateInvoice';
import InvoiceView from './components/InvoiceView';

const { ipcRenderer } = window.require('electron');

const PageLayout = styled.div`
  margin-left: 200px;
`

function App() {

  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [customers, setCustomers] = useState([]);
  const [showAccounts, setShowAccounts] = useState('');
  const [specialView, setSpecialView] = useState(false);

  useEffect(() => {
    console.log("hi");
    
    
    ipcRenderer.on('customer-created', (event, arg) => { 
      console.log('IPC channel communication - select customer: ', arg);
      let index = arg[arg.length-1].id;
      setCustomers(arg);
      setSelectedCustomer(index);
    }); 
    
    ipcRenderer.on('customers-initialized', (event, arg) => {
        console.log('IPC channel communication - NEW ARRAY: ', arg);
        setCustomers(arg);
    }); 

    ipcRenderer.send('initialize-customers', 'SELECT * FROM customers');
  }, [])

  const handleCustomerSelection = (event) => {
    setSelectedCustomer(Number(event.target.id));
  }

  const GlobalStyle = createGlobalStyle`
    html {
        box-sizing: border-box;
        font-size: 10px;
    }
    *, *:before, *:after{
        box-sizing: inherit;
    }
    body {
        padding: 0;
        margin: 0;
        font-size: 1.5rem;
        line-height: 2;
        background-color: aquamarine;
    }
    a {
        text-decoration: none;
        color: black;
    }
  `

  return (
    <>
    {!specialView &&
      <>
      <GlobalStyle/>
      <Customers setSelectedCustomer={setSelectedCustomer} customers={customers} x='xx'/>
      <PageLayout>
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
        <>
          <CustomerDetails customerDetails={customers.find(el => el.id === Number(selectedCustomer))}  selectedCustomer={selectedCustomer} setSelectedCustomer={setSelectedCustomer}/>
          <CreateInvoice setSpecialView={setSpecialView} selectedCustomer={selectedCustomer}/>
        </>
      }
      </PageLayout>
      </>
    }
    {specialView && 
      <InvoiceView setSpecialView={setSpecialView}/>
    }
    </>
  );
}

export default App;
