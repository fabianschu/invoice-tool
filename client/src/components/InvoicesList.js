import React, {useEffect} from 'react';

const InvoicesList = (props) => {

    useEffect(() => {

    })

    console.log(props);
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
                {props.invoices.map(invoice => {
                    return(
                        <tr onClick={props.handleInvoiceListView} name='one-invoice'>
                            <td id={invoice.id} name='one-invoice'>{invoice.title1} </td>
                            <td id={invoice.id} name='one-invoice'>xy gmbh</td>
                            <td id={invoice.id} name='one-invoice'>TODO: Sum</td>
                            {invoice.paid === 0 ? <td id={invoice.id} name='one-invoice'>Open</td> : <td id={invoice.id} name='one-invoice'>Paid</td>}                  
                        </tr>
                    )
                    }
                )}
            </tbody>
        </table>
        </>
    )
}

export default InvoicesList;
