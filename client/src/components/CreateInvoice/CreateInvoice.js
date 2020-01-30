import React, {useState, useEffect} from 'react';
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
    
    const [positions, setPositions] = useState([]);
    
    useEffect(() =>{
        ipcRenderer.on('invoice-created', (event, arg) => {
            
            //display last created invoice of that customer
            console.log(arg);
            let invoiceData = arg.filter(el => el.fk_customer === props.selectedCustomer);
            console.log(invoiceData);
            invoiceData = invoiceData.reduce((acc, val) => {
                console.log(acc);
                console.log(val);
                val.id > acc ? console.log('hi') : console.log('ho');
            }, [])
        })
    }, [])

    const onClick = event => {
        //props.setSpecialView(true);
        
        //create new invoice
        
        //create newrow in table
        let sql = `INSERT INTO invoices(
            fk_customer, 
            title1,
            title2,
            invoiceNumber)
            VALUES (?,?,?,?)`;
        let data = [props.selectedCustomer, 
            '', 
            ''];
        ipcRenderer.send('create-invoice', [sql, data]);

        //query from that row

        // setPositions([...positions, {
        //     project: '',
        //     description: '',
        //     hours: '',
        //     price: ''
        // }])
    }

    console.log(positions);
    console.log(props.selectedCustomer);
    
    return (
        <>
        {
            positions.length === 0 
            ? 
            <button onClick={onClick}>Create New Invoice</button>
            :
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
                    {positions.map(position => <Position details={position} />)}
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
