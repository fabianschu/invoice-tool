import React, {useState, useEffect} from 'react';
import styled from 'styled-components';

const StyledCustomers = styled.div` 
    width: 200px; /* Set the width of the sidebar */
    left: 0;
    position: fixed; /* Fixed Sidebar (stay in place on scroll) */
    z-index: 1; /* Stay on top */
    top: 0; /* Stay at the top */
    left: 0;
    background-color: #111; /* Black */
    overflow-x: hidden; /* Disable horizontal scroll */
    padding-top: 20px;
    li:hover {
        color: #f1f1f1;
    }
    .create-customer{
        top: 0; /* Stay at the top */
        height: 100px;
        background-color: white;
        position: fixed;
    }
    .customer-list{
        top: 100px; /* Stay at the top */
        height: 80vh;
    }
`

const Customers = (props) => {

    const handleViewCustomer = event => {
        props.setSelectedCustomer(Number(event.target.id));
    }

    const handleNewCustomer  = event => {
        props.setSelectedCustomer('new');
    }

    return (
        <StyledCustomers>
            <div className='create-customer'onClick={handleNewCustomer}>
                Create New Customer
            </div>
            <ul className='customer-list'>
                {props.customers.map((customer) => {
                    return(
                    <li key={customer.id} id={customer.id} onClick={handleViewCustomer}>{customer.firm}</li>
                    )
                })}
            </ul>
        </ StyledCustomers>
    )
}

export default Customers;