import React from 'react'

const InvoiceRow = (props) => {
    const {title1, title2, invoiceNumber, paid} = props.details;

    return (
        <tr>
            <td>{title1}</td>
            <td>Client</td>
            <td>TODO: Sum</td>
            {paid === 0 ? <td>Open</td> : <td>Paid</td>}
        </tr>
    )
}

export default InvoiceRow
