import React, {useState, useEffect} from 'react';
import styled, {ThemeProvider, createGlobalStyle} from 'styled-components';
import Customers from './components/Customers/Customers';
import CustomerDetails from './components/CustomerDetails/CustomerDetails';
import NewCustomer from './components/NewCustomer/NewCustomer';
import CreateInvoiceRefactor from './components/CreateInvoice/CreateInvoiceRefactor';
import InvoiceView from './components/InvoiceView';
import InvoicesList from './components/InvoicesList';

const { ipcRenderer } = window.require('electron');

const PageLayout = styled.div`
  margin-left: 200px;
`

function App() {

  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [customers, setCustomers] = useState([]);
  const [invoicePositions, setInvoicePositions] = useState([]);
  const [invoices, setInvoices] = useState();
  const [invoiceId, setInvoiceId] = useState();
  const [printView, setPrintView] = useState(false);
  const [invoiceListView, setInvoiceListView] = useState(false);

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
      console.log('invoice-read-one: ', arg);
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
          setInvoices();
          setInvoicePositions([]);
          setInvoiceId();
      }
    });

    ipcRenderer.on('invoice-read-some', (event, arg) => {
      console.log('invoice-read-some: ', arg);
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
          setInvoices();
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
    //get latest invoice that is unpaid for a given customer 
    if (selectedCustomer !== '' && selectedCustomer !== 'new'){
      let sql = `SELECT ALL * FROM invoices WHERE fk_customer = ? ORDER BY invoiceNumber DESC`;
      let data = [selectedCustomer];
      if (invoiceListView === false){
        ipcRenderer.send('read-one-invoice', [sql, data]);
      }
      if (invoiceListView === true){
        ipcRenderer.send('read-some-invoice', [sql, data]);
      }
    }
  }, [selectedCustomer, invoiceListView])


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

  console.log('invoiceListView before render: ', invoiceListView)
  console.log('selectedCustomer before render: ', selectedCustomer)
  console.log('invoices before render: ', invoices);

  
  if (selectedCustomer === '') {
    return(
      <>
        <GlobalStyle/>
        <Customers setSelectedCustomer={setSelectedCustomer} customers={customers}/>
      </>
    )
  }

  if(selectedCustomer === 'new') {
    return(
      <>
        <GlobalStyle/>
        <Customers setSelectedCustomer={setSelectedCustomer} customers={customers} setInvoices={setInvoices}/>
        <PageLayout>
          <NewCustomer setSelectedCustomer={setSelectedCustomer}/>
        </PageLayout>
      </>
    )
  }

  if((selectedCustomer !== 'new' && selectedCustomer !== '') && invoiceListView === false) {
    return(
      <>
        <GlobalStyle/>
        <Customers setSelectedCustomer={setSelectedCustomer} customers={customers} setInvoices={setInvoices}/>
        <PageLayout>
          <CustomerDetails customerDetails={customers.find(el => el.id === Number(selectedCustomer))}  selectedCustomer={selectedCustomer} setSelectedCustomer={setSelectedCustomer}/>
          <CreateInvoiceRefactor 
            setPrintView={setPrintView} 
            selectedCustomer={selectedCustomer} 
            invoicePositions={invoicePositions} 
            setInvoicePositions={setInvoicePositions} 
            invoiceId={invoiceId} 
            setInvoiceId={setInvoiceId} 
            customers={customers} 
            setInvoiceListView={setInvoiceListView}
            invoices={invoices}/>
        </PageLayout>
      </>
    )
  }

  if((selectedCustomer !== 'new' && selectedCustomer !== '') && invoiceListView === true) {
    return(
      <>
        <GlobalStyle/>
        <Customers setSelectedCustomer={setSelectedCustomer} customers={customers} setInvoices={setInvoices}/>
        <PageLayout>
          <CustomerDetails 
            customerDetails={customers.find(el => el.id === Number(selectedCustomer))}  
            selectedCustomer={selectedCustomer} 
            setSelectedCustomer={setSelectedCustomer}/>
          <InvoicesList 
          invoices={invoices}
          setInvoices={setInvoices}
          setInvoiceListView={setInvoiceListView}/>
        </PageLayout>
      </>
    )
  }

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
