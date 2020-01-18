import React, {useState, useEffect} from 'react';
const { ipcRenderer } = window.require('electron');

const Customers = (props) => {
    
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        console.log("hi");

        ipcRenderer.on('asynchronous-reply', (event, arg) => {
            console.log(arg);
            setCustomers(arg);
        }); 

        ipcRenderer.send('asynchronous-message', 'retrieve-customers');
    }, [])

    const handleClick = (event) => {
        props.setSelectedCustomer(event.target.id);
    }

    console.log(props.selectedCustomer)

    return (
        <ul>
            {customers.map((customer) => {
                return(
                <li key={customer.id} id={customer.id} onClick={handleClick}>{customer.name}</li>
                )
            })}
        </ul>
    )
}

export default Customers;