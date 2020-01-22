import React, {useState, useEffect} from 'react';

const Customers = (props) => {

    return (
        <ul>
            {props.customers.map((customer) => {
                return(
                <li key={customer.id} id={customer.id} onClick={props.handleClick}>{customer.firm}</li>
                )
            })}
        </ul>
    )
}

export default Customers;