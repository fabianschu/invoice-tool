import React, {useState, useEffect} from 'react';

const CustomerDetailsRow = (props) => {


    const [value, setValue] = useState('');

    useEffect(() => {
        console.log('mounting: ', props.detail.value)
        setValue(props.detail.value);
    }, [])

    const handleChange = event => {
        setValue(event.target.value);
    }

    console.log(props.selectedCustomer);

    return(
        <tr>
            <th>{props.detail.key}</th>
            <td><input type="text" value={value} onChange={handleChange} name={props.detail.key} onBlur={props.handleChange}/></td>
        </tr>
    )
}

export default CustomerDetailsRow