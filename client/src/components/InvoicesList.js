import React, {useEffect} from 'react';
import InvoiceRow from './InvoiceRow'

const InvoicesList = (props) => {

    useEffect(() => {

    })

    let helpArray = props.invoices.map(obj=> ({ 
        ...obj, 
        setInvoices: props.setInvoices, 
        setInvoiceListView: props.setInvoiceListView 
    }));


    console.log(helpArray);

    return (
        <>
        <table>
            <thead>
                <tr>
                    <th>Invoice Title</th>
                    <th>Client</th>
                    <th>Sum</th>
                    <th>Paid</th>
                </tr>
            </thead>
            <tbody>
                {helpArray.map(invoice => <InvoiceRow 
                details={invoice}
                key={invoice.id}
                />)}
            </tbody>
        </table>
        </>
    )
}

export default InvoicesList;
