import React, {useState} from 'react';
import styled from 'styled-components';
import Position from '../Position';
const { ipcRenderer } = window.require('electron');

const InvoiceContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    table {
        width: 90%;
        border: 1px solid black;
        border-collapse: collapse;
    }
    td, th {
        border: 1px solid black;
    }
    .new-position {
        width: 90%
    }
`

const CreateInvoice = (props) => {
    
    const [positions, setPositions] = useState([]);

    const onClick = event => {
        //props.setSpecialView(true);
        setPositions([...positions, {
            project: '',
            description: '',
            hours: '',
            price: ''
        }])
    }

    console.log(positions);
    console.log(props)
    
    return (
        <InvoiceContainer>
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
                {/* if invoice already has positions render them here */}
                {positions.map(position => <Position details={position} />)}
                {/* <tbody>
                    <tr>
                        <td>a</td>
                        <td>b</td>
                        <td>c</td>
                        <td>d</td>
                    </tr>
                </tbody> */}
            </table>
            <button className='new-position' onClick={onClick}>Create New Position</button>
            <button onClick={onClick}>Print</button>
        </InvoiceContainer>
    )
}

export default CreateInvoice
