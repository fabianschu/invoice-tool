import React, {useState, useEffect, useRef} from 'react';
import styled from 'styled-components';
import Position from '../Position';
import StyledInvoiceTable from '../../styles/StyledInvoiceTable';
const { ipcRenderer } = window.require('electron');

const CreateInvoiceRefactor = (props) => {
    
    const handleNewPosition = event => {
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

    const handlePrintView = (event) =>{
        props.setPrintView(true);
    }

    return (
        <>
        {
            <StyledInvoiceTable>
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
                <button className='new-position' onClick={handleNewPosition}>Create New Position</button>
                <button onClick={handlePrintView}>Print</button>
            </StyledInvoiceTable>
        }
        </>
    )
}

export default CreateInvoiceRefactor;