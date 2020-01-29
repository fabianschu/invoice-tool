import React from 'react';
const { ipcRenderer } = require('electron');

const CreateInvoice = (props) => {
    
    const onClick = event => {
        ipcRenderer.send('print', 'print');
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
        </div>
    )
}

export default CreateInvoice
