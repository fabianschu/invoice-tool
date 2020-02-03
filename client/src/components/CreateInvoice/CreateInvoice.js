import React, {useState, useEffect, useRef} from 'react';
import styled from 'styled-components';
import Position from '../Position';
const { ipcRenderer } = window.require('electron');

const InvoiceContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    table {
        width: 90%;
        border: 1px solid black;
        border-collapse: collapse;
    }
    td, th {
        border: 1px solid black;
    }
    .new-position {
        width: 90%
    }
`

const CreateInvoice = (props) => {
    
    const [invoiceId, setInvoiceId] = useState();
    const [positions, setPositions] = useState([]);
    
    useEffect(() =>{
        // if there is already an invoice for the customer show it
        // read from db, if invoice exists
        let sql = `SELECT ALL * FROM invoices WHERE fk_customer = ?`
        let data = props.selectedCustomer;
        ipcRenderer.send('read-invoice', [sql, data]);



        ipcRenderer.once('invoice-created', (event, arg) => {
            //get last created invoice from customer
            let invoiceData = arg.filter(el => el.fk_customer === props.selectedCustomer);
            invoiceData = invoiceData[invoiceData.length - 1];
            let invoiceId = invoiceData.id;
            console.log(invoiceId);
            //create new position for this customer
            let sql = `INSERT INTO positions(
                fk_invoice, 
                project,
                description,
                hours)
                VALUES (?,?,?,?)`;
            let data = [invoiceId, 
                '', 
                '',
                ''];
            ipcRenderer.send('create-position', [sql, data]);
        })

        //

    }, [props.selectedCustomer]);

    useEffect(() => {
        console.log('setting up the renderer')
        ipcRenderer.on('invoice-read', (event, arg) => {
            console.log(arg);
            if(arg.length != 0) {
                let invoiceId = arg[arg.length-1].id;
                console.log(invoiceId);
                let sql = `SELECT ALL * FROM positions WHERE fk_invoice = ?`;
                let data = invoiceId;
                //check positions of that specific invoice
                ipcRenderer.send('read-position', [sql, data]);
            }
            if(arg.length === 0) {
                setPositions([]);
            }
        });
        ipcRenderer.on('position-read', (event, arg) => {
            console.log(arg);
            if (arg) {
                let tmp = [...positions];
                tmp.push(arg);
                console.log(tmp);
                setPositions(tmp);
                console.log(positions);
            } 
        });
    }, [])

    const onClick = event => {
        //create new invoice only if there are no positions yet
        if (positions.length === 0) {
            let sql = `INSERT INTO invoices(
                fk_customer, 
                title1,
                title2,
                invoiceNumber)
                VALUES (?,?,?,?)`;
            let data = [props.selectedCustomer, 
                '', 
                ''];
            console.log(positions);
            ipcRenderer.send('create-invoice', [sql, data]);
        } else {
        // create new position in existing invoice
        
        }
    }

    console.log(props.selectedCustomer);
    console.log(positions);
    
    return (
        <>
        {
            // positions.length === 0 
            // ? 
            // <button onClick={onClick}>Create New Invoice</button>
            // :
            <InvoiceContainer>
                <h1>Invoice</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Projekt</th>
                            <th>Leistung</th>
                            <th>Stunden</th>
                            <th>Preis</th>
                        </tr>
                    </thead>
                    {/* if invoice already has positions render them here */}
                    {positions.length != 0 && positions.map(position => <Position details={position} key={position.id} selectedCustomer={props.selectedCustomer}/>)}
                    {/* <tbody>
                        <tr>
                            <td>a</td>
                            <td>b</td>
                            <td>c</td>
                            <td>d</td>
                        </tr>
                    </tbody> */}
                </table>
                <button className='new-position' onClick={onClick}>Create New Position</button>
                <button onClick={onClick}>Print</button>
            </InvoiceContainer>
        }
        </>
    )
}

export default CreateInvoice
