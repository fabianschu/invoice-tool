import React, {useState, useEffect} from 'react';
import StyledTopContainer from '../../styles/StyledTopContainer'
const { ipcRenderer } = window.require('electron');

const CustomerDetails = (props) => {
    //customer details
    const [firm, setFirm] = useState(props.customerDetails.firm);
    const [street, setStreet] = useState(props.customerDetails.street);
    const [zip, setZip] = useState(props.customerDetails.zip);
    const [city, setCity] = useState(props.customerDetails.city);
    const [lastName, setLastName] = useState(props.customerDetails.lastName);
    const [firstName, setFirstName] = useState(props.customerDetails.firstName);
    const [country, setCountry] = useState(props.customerDetails.country);
    const [rate, setRate] = useState(props.customerDetails.rate);
    const [id, setId] = useState(props.customerDetails.id);
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
                case 'rate':
                    setRate(event.target.value);
                    break; 
            }
        }
        
        //if event type is blur, the main process is asked to update the db, it will then query the db again and send the result to the ipcRenderer (but not the event emitter)
        if(event.type === 'blur') {
            let stateId = Number(event.target.getAttribute('stateid'));
            ipcRenderer.send('update-customer', [`UPDATE customers SET ${event.target.name} = ? WHERE id = ?`, [event.target.value, stateId]]);
        }
    }

    const handleSelect = event => {
        let stateId = Number(event.target.getAttribute('stateid'));
        ipcRenderer.send('update-customer', [`UPDATE customers SET ${event.target.name} = ? WHERE id = ?`, [event.target.value, stateId]]);
    }

    const handleDeletion = event => {
        if (event.target.getAttribute('name') === 'initialDelete') {
            setShowAlert(true);
        }
        else if (event.target.getAttribute('name') === 'cancelDelete') {
            setShowAlert(false);
        }
        else {
            //let customerId = (Number(event.target.getAttribute('stateid')));
            ipcRenderer.send('delete-customer', [`DELETE FROM customers WHERE id=?`, props.selectedCustomer]);
            props.setSelectedCustomer('');
        }
    }
    
    useEffect(() => {
        if(id !== props.customerDetails.id) {
            setFirm(props.customerDetails.firm);
            setStreet(props.customerDetails.street);
            setZip(props.customerDetails.zip);
            setCity(props.customerDetails.city);
            setLastName(props.customerDetails.lastName);
            setFirstName(props.customerDetails.firstName);
            setCountry(props.customerDetails.country);
            setRate(props.customerDetails.rate);
            setId(props.customerDetails.id);
        }
    })

    return (
        <>
            {props.selectedCustomer &&
                <StyledTopContainer>  
                    <div className='inputColumn'>
                        <div className='input'>
                            <label htmlFor='firm'>Firm:</label>
                            <input type="text" value={firm} onChange={handleChange} name='firm' onBlur={handleChange} stateid={id} id='firm'/>
                        </div>
                        <div className='input'>
                            <label htmlFor='firstName'>First Name:</label>
                            <input type="text" value={firstName} onChange={handleChange} name='firstName' id='firstName' onBlur={handleChange} stateid={id}/>
                        </div>
                        <div className='input'>
                            <label htmlFor='lastName'>Last Name:</label>
                            <input type="text" value={lastName} onChange={handleChange} name='lastName' id='lastName' onBlur={handleChange} stateid={id}/>
                        </div>
                    </div>

                    <div className='inputColumn'>
                        <div className='input'>
                            <label htmlFor='street'>Street:</label>
                            <input type="text" value={street} onChange={handleChange} name='street' id='street' onBlur={handleChange} stateid={id}/>
                        </div>
                        <div className='input'>
                            <label htmlFor='zip'>Zip Code:</label>
                            <input type="text" value={zip} onChange={handleChange} name='zip' id ='zip' onBlur={handleChange} stateid={id}/>
                        </div>
                        <div className='input'>
                            <label htmlFor='city'>City:</label>
                            <input type="text" value={city} onChange={handleChange} name='city' id='city' onBlur={handleChange} stateid={id}/>
                        </div>
                    </div>

                    {/* <label htmlFor='country'>Country:</label>
                    <input type="text" value={country} onChange={handleChange} name='country' id='country' onBlur={handleChange} stateid={id}/> */}
                    <div className="inputColumn">
                        <div className='input'>
                            <label htmlFor='country'>Country:</label>
                            <select name="country" id="country" stateid={id} onChange={handleSelect}>
                                <option value={country}>{country}</option>
                                {country === 'Österreich' ? <option value='Deutschland'>Deutschland</option> : <option value='Österreich'>Österreich</option>}
                            </select>
                        </div>
                        <div className='input'>
                            <label htmlFor='rate'>Hourly rate:</label>
                            <input type="number" value={rate} onChange={handleChange} name='rate' id='rate' onBlur={handleChange} stateid={id}/>
                        </div>
                        {
                        !showAlert 
                        ?
                        <div onClick={handleDeletion} name='initialDelete'>Delete Customer</div>
                        : 
                        <div>
                            <div onClick={handleDeletion} stateid={id} name='confirmDelete'>Confirm</div>
                            <div onClick={handleDeletion} name='cancelDelete'>Cancel</div>
                        </div>
                        }
                    </div>
                </StyledTopContainer>
            }
        </>
    )
}

export default CustomerDetails;