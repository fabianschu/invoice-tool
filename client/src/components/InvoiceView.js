import React, {useState} from 'react';
import PDFPosition from './PDFPosition';
import styled from 'styled-components';
import StyledInvoiceTable from '../styles/StyledInvoiceTable';
const { ipcRenderer } = window.require('electron');

const StyledPdfLayout = styled.div`
    width: 18cm;
    height: 28.5cm;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const InvoiceView = (props) => {

    const [buttonsDisplay, setButtonsDisplay] = useState(true);

    const printHandler = event => {
        setButtonsDisplay(false);
        setTimeout(function(){ setButtonsDisplay(true); }, 2000);
        setTimeout(function(){ ipcRenderer.send('print', 'print'); }, 1000);
    }

    const backHandler = event => {
        props.setPrintView(false);
    }

    return (
        <>
            <StyledPdfLayout>
                <StyledInvoiceTable>
                    <table>
                        <thead>
                            <tr>
                                <th>Projekt</th>
                                <th>Leistung</th>
                                <th>Stunden</th>
                                <th>Preis</th>
                            </tr>
                        </thead>
                        {props.invoicePositions.length != 0 && props.invoicePositions.map(position => <PDFPosition details={position} key={position.id} selectedCustomer={props.selectedCustomer} customers={props.customers}/>)}
                    </table>
                </StyledInvoiceTable>
            </StyledPdfLayout>
            {buttonsDisplay &&
            <>
                <button onClick={backHandler}>Back</button>
                <button onClick={printHandler}>Print</button>
            </>
            }   
        </>
    )
}

export default InvoiceView
