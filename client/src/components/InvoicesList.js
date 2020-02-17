import React, {useEffect} from 'react';
import InvoiceRow from './InvoiceRow'

const InvoicesList = (props) => {

    useEffect(() => {

    })

    console.log(props.invoices);

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
                {props.invoices.map(invoice => <InvoiceRow details={invoice} />)}
            </tbody>
        </table>
        </>
    )
}

export default InvoicesList;
