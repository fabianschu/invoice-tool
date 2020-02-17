import React, {useState, useEffect} from 'react';
import styled from 'styled-components';

const TopLeft = styled.div`
    height: 100px;
    width: 200px;
    background-color: white;
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    p {
        color: red;
    }
`

const StyledCustomers = styled.div` 
    width: 200px; /* Set the width of the sidebar */
    left: 0;
    height: 100%;
    position: fixed; /* Fixed Sidebar (stay in place on scroll) */
    z-index: 1; /* Stay on top */
    top: 100px; /* Stay at the top */
    left: 0;
    background-color: #111; /* Black */
    overflow-x: hidden; /* Disable horizontal scroll */
    * {
        color: black;
    }
    li {
        text-align: center;
        width: 100%;
        background-color: blue;
        user-select: none;
    }
    li:hover {
        background-color: #f1f1f1;
    }
    ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }
`

const Customers = (props) => {

    const handleViewCustomer = event => {
        console.log('set current customer to: ', Number(event.target.id));
        props.setSelectedCustomer(Number(event.target.id));
        props.setInvoices([]);
    }

    const handleNewCustomer  = event => {
        props.setSelectedCustomer('new');
        props.setInvoices([]);
    }

    return (
        <div>
        <TopLeft className='create-customer' onClick={handleNewCustomer}>
            Create New Customer   
        </TopLeft>
        <StyledCustomers>
            <ul className='customer-list'>
                {props.customers.map((customer) => {
                    return(
                    <li key={customer.id} id={customer.id} onClick={handleViewCustomer}>{customer.firm}</li>
                    )
                })}
            </ul>
        </ StyledCustomers>
        </div>
    )
}

export default Customers;