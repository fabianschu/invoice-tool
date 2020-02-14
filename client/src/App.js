import React, {useState, useEffect} from 'react';
import styled, {ThemeProvider, createGlobalStyle} from 'styled-components';
import Customers from './components/Customers/Customers';
import CustomerDetails from './components/CustomerDetails/CustomerDetails';
import NewCustomer from './components/NewCustomer/NewCustomer';
import CreateInvoiceRefactor from './components/CreateInvoice/CreateInvoiceRefactor';
import InvoiceView from './components/InvoiceView';

const { ipcRenderer } = window.require('electron');

const PageLayout = styled.div`
  margin-left: 200px;
`

function App() {

  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [customers, setCustomers] = useState([]);
  const [invoicePositions, setInvoicePositions] = useState([]);
  const [invoiceId, setInvoiceId] = useState();
  const [showAccounts, setShowAccounts] = useState('');
  const [specialView, setSpecialView] = useState(false);

  useEffect(() => {

    ipcRenderer.on('customer-created', (event, arg) => { 
      let index = arg[arg.length-1].id;
      setCustomers(arg);
      setSelectedCustomer(index);
    }); 
    
    ipcRenderer.on('customers-initialized', (event, arg) => {
        setCustomers(arg);
    });

    ipcRenderer.on('invoice-read', (event, arg) => {
      //if an invoice exists, choose latest invoiceId & query positions
      if(arg.length != 0) {
          let invId = arg[arg.length-1].id;
          let sql = `SELECT ALL * FROM positions WHERE fk_invoice = ?`;
          let data = invId;
          //check positions of that specific invoice
          ipcRenderer.send('read-position', [sql, data]);
      }
      else {
          setInvoicePositions([]);
          setInvoiceId();
      }
    });

    ipcRenderer.on('position-read', (event, arg) => {
      console.log('position-read: ', arg)
      let invId = arg[0].fk_invoice;
      //if an invoice exists, positions also must exist
      //set positions as state
      setInvoicePositions(arg);
      setInvoiceId(invId);
    });
    ipcRenderer.on('invoice-created', (event, arg) => {
      let invoiceData = arg;
      invoiceData = invoiceData[invoiceData.length - 1];
      let invId = invoiceData.id;
      //also create new position for this customer with the invoiceId of the last invoice
      let sql = `INSERT INTO positions(
          fk_invoice, 
          project,
          description,
          hours)
          VALUES (?,?,?,?)`;
      let data = [invId, 
          '', 
          '',
          ''];
      ipcRenderer.send('create-position', [sql, data]);
    });
    
    ipcRenderer.send('initialize-customers', 'SELECT * FROM customers');
  }, [])

  useEffect(() => {
    //1. check if invoices exist for customer
    let sql = `SELECT ALL * FROM invoices WHERE fk_customer = ?`
    let data = selectedCustomer;
    ipcRenderer.send('read-invoice', [sql, data]);

}, [selectedCustomer])

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
          <CreateInvoiceRefactor setSpecialView={setSpecialView} selectedCustomer={selectedCustomer} invoicePositions={invoicePositions} setInvoicePositions={setInvoicePositions} invoiceId={invoiceId} setInvoiceId={setInvoiceId} customers={customers}/>
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
