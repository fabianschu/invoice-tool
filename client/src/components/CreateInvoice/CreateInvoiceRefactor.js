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

const CreateInvoiceRefactor = (props) => {
    
    const onClick = event => {
        //if there is no invoice for that customer yet create a new one and create a new position
        if (props.invoicePositions.length === 0 && !props.invoiceId) {
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
        } else {
            //if there is an invoice already it should be being displayed, just add a position, then
            let sql = `INSERT INTO positions(
                fk_invoice, 
                project,
                description,
                hours)
                VALUES (?,?,?,?)`;
            let data = [props.invoiceId, 
                '', 
                '',
                ''];
            ipcRenderer.send('create-position', [sql, data]);
        }
    }

    return (
        <>
        {
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
                    {props.invoicePositions.length != 0 && props.invoicePositions.map(position => <Position details={position} key={position.id} selectedCustomer={props.selectedCustomer} customers={props.customers}/>)}
                </table>
                <button className='new-position' onClick={onClick}>Create New Position</button>
                {/* <button onClick={onClick}>Print</button> */}
            </InvoiceContainer>
        }
        </>
    )
}

export default CreateInvoiceRefactor
