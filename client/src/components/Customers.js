import React, {useState, useEffect} from 'react';
const { ipcRenderer } = window.require('electron');

const Customers = () => {
    
    useEffect(() => {
        console.log("hi");

        ipcRenderer.on('asynchronous-reply', (event, arg) => {
            console.log('hiho') // prints "pong"
        }); 

        ipcRenderer.send('asynchronous-message', 'ping');
    }, [])

    return (
        <ul>
            <li>customer 1</li>
            <li>customer 2</li>
        </ul>
    )
}

export default Customers;