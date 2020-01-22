import React, {useState, useEffect} from 'react';
const { ipcRenderer } = window.require('electron');

const NewCustomer = (props) => {

    //customer details
    const [firm, setFirm] = useState('');
    const [street, setStreet] = useState('');
    const [zip, setZip] = useState('');
    const [city, setCity] = useState('');
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [country, setCountry] = useState('');
    // const [id, setId] = useState('');
    //deletion-related states
    const [showAlert, setShowAlert] = useState(false);

    const handleChange = (event) => {
        //handling of inputs
        if(event.type === 'change') {
            switch(event.target.name) {
                case 'firm':
                    setFirm(event.target.value);
                    break;
                case 'street':
                    setStreet(event.target.value);
                    break;
                case 'zip':
                    setZip(event.target.value);
                    break;
                case 'city':
                    setCity(event.target.value);
                    break; 
                case 'lastName':
                    setLastName(event.target.value);
                    break;
                case 'firstName':
                    setFirstName(event.target.value);
                    break;
                case 'country':
                    setCountry(event.target.value);
                    break; 
            }
        }
    }

    const handleClick = event => {
        let sql = `INSERT INTO customers(
            firm, 
            firstName, 
            lastName, 
            street, 
            zip, 
            city, 
            country) 
            VALUES (?,?,?,?,?,?,?)`;
        let data = [firm, 
            firstName, 
            lastName, 
            street, 
            zip, 
            city, 
            country];
        ipcRenderer.send('create', [sql, data]);
        // props.setSelectedCustomer('');
    }
    
    return (
        <>
            <table className=''>
                <tbody>
                    <tr>
                        <th>Firm</th>
                        <td><input type="text" value={firm} onChange={handleChange} name='firm'/></td>
                    </tr>
                    <tr>
                        <th>Street</th>
                        <td><input type="text" value={street} onChange={handleChange} name='street'/></td>
                    </tr>
                    <tr>
                        <th>Zip Code</th>
                        <td><input type="text" value={zip} onChange={handleChange} name='zip'/></td>
                    </tr>
                    <tr>
                        <th>City</th>
                        <td><input type="text" value={city} onChange={handleChange} name='city'/></td>
                    </tr>
                    <tr>
                        <th>Country</th>
                        <td><input type="text" value={country} onChange={handleChange} name='country'/></td>
                    </tr>
                    <tr>
                        <th>Surname</th>
                        <td><input type="text" value={firstName} onChange={handleChange} name='firstName'/></td>
                    </tr>
                    <tr>
                        <th>Name</th>
                        <td><input type="text" value={lastName} onChange={handleChange} name='lastName'/></td>
                    </tr>
                </tbody>
            </table>
            <div onClick={handleClick}>
                Create New Customer
            </div>
            <div>
                Cancel
            </div>
        </>
    )
}

export default NewCustomer;