import React, {useState, useEffect} from 'react';

const Customers = (props) => {

    const handleViewCustomer = event => {
        props.setSelectedCustomer(Number(event.target.id));
    }

    const handleNewCustomer  = event => {
        props.setSelectedCustomer('new');
    }

    return (
        <>
            <ul>
                {props.customers.map((customer) => {
                    return(
                    <li key={customer.id} id={customer.id} onClick={handleViewCustomer}>{customer.firm}</li>
                    )
                })}
                <li onClick={handleNewCustomer}>New Customer</li>
            </ul>
        </>
    )
}

export default Customers;