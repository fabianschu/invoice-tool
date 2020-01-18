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

    return (
        <ul>
            {customers.map(customer => {
                return(
                <li>{customer.firm}</li>
                )
            })}
        </ul>
    )
}

export default Customers;