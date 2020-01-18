import React, {useState, useEffect} from 'react';
const { ipcRenderer } = window.require('electron');

const Customers = () => {
    
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
        console.log(event.target.id);
    }

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