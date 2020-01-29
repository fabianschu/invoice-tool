import React from 'react';
import {Link} from 'react-router-dom';
const { ipcRenderer } = window.require('electron');

const CreateInvoice = (props) => {
    
    const onClick = event => {
        props.setSpecialView(true);
    }
    
    return (
        <div>
            <h1>Invoice</h1>
            <table>
                <thead>
                    <tr>
                        <th>Projekt</th>
                        <th>Leistung</th>
                        <th>Stunden</th>
                        <th>Preis</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>a</td>
                        <td>b</td>
                        <td>c</td>
                        <td>d</td>
                    </tr>
                </tbody>
            </table>

            <button onClick={onClick}>Print</button>
            <Link to="/test">TEST</Link>
        </div>
    )
}

export default CreateInvoice
