import React, {useState, useEffect} from 'react';
const { ipcRenderer } = window.require('electron');

const CustomerDetails = (props) => {

    console.log(props.customerDetails);
    return (
        <div>
            <p>{props.customerDetails.firm}</p>
            <p>{props.customerDetails.street}</p>
            <p>{props.customerDetails.zip_code}</p>
            <p>{props.customerDetails.city}</p>
            <p>{props.customerDetails.surname}</p>
            <p>{props.customerDetails.name}</p>
        </div>
    )
}

export default CustomerDetails;