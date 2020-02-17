import React, {useState, useEffect} from 'react';
import styled, {ThemeProvider, createGlobalStyle} from 'styled-components';
import Customers from './components/Customers/Customers';
import CustomerDetails from './components/CustomerDetails/CustomerDetails';
import NewCustomer from './components/NewCustomer/NewCustomer';
import CreateInvoiceRefactor from './components/CreateInvoice/CreateInvoiceRefactor';
import InvoiceView from './components/InvoiceView';
import InvoicesList from './components/InvoicesList';
import Stats from './components/Stats';

const { ipcRenderer } = window.require('electron');

const PageLayout = styled.div`
  margin-left: 200px;
`

function App() {

  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [customers, setCustomers] = useState([]);
  const [invoicePositions, setInvoicePositions] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [invoiceId, setInvoiceId] = useState();
  const [printView, setPrintView] = useState(false);

  useEffect(() => {

    ipcRenderer.on('customer-created', (event, arg) => { 
      let index = arg[arg.length-1].id;
      setCustomers(arg);
      setSelectedCustomer(index);
    }); 
    
    ipcRenderer.on('customers-initialized', (event, arg) => {
        setCustomers(arg);
    });


    ipcRenderer.on('invoice-read-one', (event, arg) => {
      console.log('invoice read one: ', arg);
      //if an invoice exists, choose latest invoiceId & query positions
      if(arg.length > 0) {
          //TODO set invoices state
          let lastInv = arg[arg.length-1];
          let sql = `SELECT ALL * FROM positions WHERE fk_invoice = ?`;
          let data = lastInv.id;
          //check positions of that specific invoice
          setInvoices([lastInv]);
          ipcRenderer.send('read-position', [sql, data]);

      }
      else {
          //TODO set invoices state
          setInvoices([]);
          setInvoicePositions([]);
          setInvoiceId();
      }
    });

    ipcRenderer.on('invoice-read-some', (event, arg) => {
      //if an invoice exists, choose latest invoiceId & query positions
      if(arg.length > 0) {
          //TODO set invoices state
          let invId = arg[arg.length-1].id;
          let sql = `SELECT ALL * FROM positions WHERE fk_invoice = ?`;
          let data = invId;
          //check positions of that specific invoice
          setInvoices(arg);
          ipcRenderer.send('read-position', [sql, data]);

      }
      else {
          //TODO set invoices state
          setInvoices([]);
          setInvoicePositions([]);
          setInvoiceId();
      }
    });

    ipcRenderer.on('invoice-read-all', (event, arg) => {
      console.log('read all invoice: ', arg);
      setInvoices(arg);
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

    ipcRenderer.send('read-all-invoice', 'SELECT * FROM invoices ORDER BY invoiceNumber DESC')
  }, [])

  useEffect(() => {
    //get latest invoice that is unpaid for a given customer 
    if (selectedCustomer !== '' && selectedCustomer !== 'new'){
      let sql = `SELECT ALL * FROM invoices WHERE fk_customer = ? ORDER BY invoiceNumber DESC`;
      let data = [selectedCustomer];
      if (invoices.length === 0){
        ipcRenderer.send('read-one-invoice', [sql, data]);
      }
      if (invoices.length > 0){
        ipcRenderer.send('read-some-invoice', [sql, data]);
      }
    }
  }, [selectedCustomer])


  const handleCustomerSelection = (event) => {
    setSelectedCustomer(Number(event.target.id));
  }

  const handleInvoiceListView = (event) =>{
    let sql = `SELECT ALL * FROM invoices WHERE fk_customer = ? ORDER BY invoiceNumber DESC`;
    let data = [selectedCustomer];
    if(event.target.getAttribute('name') === 'some-invoices') {
      ipcRenderer.send('read-some-invoice', [sql, data]);
    }
    if(event.target.getAttribute('name') === 'one-invoice') {
      let helperArr = [...invoices];
      let selectedInv = helperArr.find(el => el.id === Number(event.target.id));
      setInvoices([selectedInv]);
    }
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

  console.log('selectedCustomer before render: ', selectedCustomer)
  console.log('invoices before render: ', invoices);

  
  // if (selectedCustomer === '') {
  //   return(
  //     <>
  //       <GlobalStyle/>
  //       <Customers setSelectedCustomer={setSelectedCustomer} customers={customers}/>
  //     </>
  //   )
  // }

  if((invoices.length > 0) && (selectedCustomer === '') ) {
    return(
      <>
        <GlobalStyle/>
        <Customers 
          setSelectedCustomer={setSelectedCustomer} 
          customers={customers} 
          setInvoices={setInvoices} 
          invoices={invoices}/>
        <PageLayout>
          <Stats />
          <InvoicesList 
            invoices={invoices}
            setInvoices={setInvoices}
          />
        </PageLayout>
      </>
    )
  }

  if(selectedCustomer === 'new') {
    return(
      <>
        <GlobalStyle/>
        <Customers 
          setSelectedCustomer={setSelectedCustomer} 
          customers={customers} 
          setInvoices={setInvoices} />
        <PageLayout>
          <NewCustomer 
            setSelectedCustomer={setSelectedCustomer}/>
        </PageLayout>
      </>
    )
  }

  if((selectedCustomer !== 'new' && selectedCustomer !== '') && invoices.length <= 1) {
    console.log('should render customer details and details of one invoice')
    return(
      <>
        <GlobalStyle/>
        <Customers 
          setSelectedCustomer={setSelectedCustomer} 
          customers={customers} 
          setInvoices={setInvoices} />
        <PageLayout>
          <CustomerDetails 
            customerDetails={customers.find(el => el.id === Number(selectedCustomer))}  
            selectedCustomer={selectedCustomer} 
            setSelectedCustomer={setSelectedCustomer}/>
          <CreateInvoiceRefactor 
            setPrintView={setPrintView} 
            selectedCustomer={selectedCustomer} 
            invoicePositions={invoicePositions} 
            setInvoicePositions={setInvoicePositions} 
            invoiceId={invoiceId} 
            setInvoiceId={setInvoiceId} 
            customers={customers} 
            invoices={invoices}
            setInvoices={setInvoices}
            handleInvoiceListView={handleInvoiceListView}/>
        </PageLayout>
      </>
    )
  }

  if((selectedCustomer !== 'new' && selectedCustomer !== '') && invoices.length > 1) {
    console.log('should render customer details and list of invoices for customer')
    return(
      <>
        <GlobalStyle/>
        <Customers 
          setSelectedCustomer={setSelectedCustomer} 
          customers={customers} 
          setInvoices={setInvoices} 
          setInvoices={setInvoices}/>
        <PageLayout>
          <CustomerDetails 
            customerDetails={customers.find(el => el.id === Number(selectedCustomer))}  
            selectedCustomer={selectedCustomer} 
            setSelectedCustomer={setSelectedCustomer}/>
          <InvoicesList 
          invoices={invoices}
          setInvoices={setInvoices}
          handleInvoiceListView={handleInvoiceListView}
          />
        </PageLayout>
      </>
    )
  }

  console.log('Fledermausland')
  return(
    <>
      <GlobalStyle/>
      <Customers 
          setSelectedCustomer={setSelectedCustomer} 
          customers={customers} 
          setInvoices={setInvoices} />
    </>
  )

  // return (
  //   <>
  //   {!printView &&
  //     <>
  //     <GlobalStyle/>
  //     <Customers setSelectedCustomer={setSelectedCustomer} customers={customers}/>
  //     <PageLayout>
  //     {
  //       // if state is empty string render empty fragment
  //       selectedCustomer === '' 
  //       ?
  //       <></>
  //       //else check if selected cutomer = 'new'
  //       :
  //       selectedCustomer === 'new'
  //       ?
  //       <NewCustomer setSelectedCustomer={setSelectedCustomer}/>
  //       :
  //       <>
  //         <CustomerDetails customerDetails={customers.find(el => el.id === Number(selectedCustomer))}  selectedCustomer={selectedCustomer} setSelectedCustomer={setSelectedCustomer}/>
  //         <CreateInvoiceRefactor setPrintView={setPrintView} selectedCustomer={selectedCustomer} invoicePositions={invoicePositions} setInvoicePositions={setInvoicePositions} invoiceId={invoiceId} setInvoiceId={setInvoiceId} customers={customers}/>
  //       </>
  //     }
  //     </PageLayout>
  //     </>
  //   }
  //   {printView && 
  //     <InvoiceView setPrintView={setPrintView} customers={customers} invoicePositions={invoicePositions} selectedCustomer={selectedCustomer}/>
  //   }
  //   </>
  // );
}

export default App;
