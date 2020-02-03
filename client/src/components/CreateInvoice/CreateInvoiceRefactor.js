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
    
    const [positions, setPositions] = useState([]);
    const [invoiceId, setInvoiceId] = useState();
    
    useEffect(() => {
        
    })
    

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
                    {positions.length != 0 && positions.map(position => <Position details={position} key={position.id} selectedCustomer={props.selectedCustomer}/>)}
                </table>
                <button className='new-position' onClick={onClick}>Create New Position</button>
                <button onClick={onClick}>Print</button>
            </InvoiceContainer>
        }
        </>
    )
}

export default CreateInvoice
