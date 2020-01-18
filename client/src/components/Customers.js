import React, {useState, useEffect} from 'react';

const Customers = (props) => {

    const handleClick = (event) => {
        props.setSelectedCustomer(Number(event.target.id));
    }

    return (
        <ul>
            {props.customers.map((customer) => {
                return(
                <li key={customer.id} id={customer.id} onClick={handleClick}>{customer.name}</li>
                )
            })}
        </ul>
    )
}

export default Customers;