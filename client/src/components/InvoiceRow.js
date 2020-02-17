import React from 'react'

const InvoiceRow = (props) => {

    const {title1, title2, id, invoiceNumber, paid, setInvoices, setInvoiceListView} = props.details;

    const handleClick = (event) => {
        console.log('clicked on invoice row with id: ', id);
        let updatedInvoices = props.details;
        setInvoiceListView(false);
        delete updatedInvoices.setInvoices;
        delete updatedInvoices.setInvoiceListView;
        setInvoices([updatedInvoices]);
    }

    console.log(props);

    return (
        <>
        <tr onClick={() => handleClick()}>
            <td>{title1}</td>
            <td>Client</td>
            <td>TODO: Sum</td>
            {paid === 0 ? <td>Open</td> : <td>Paid</td>}
        </tr>
        </>
    )
}

export default InvoiceRow
