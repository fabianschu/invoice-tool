import React from 'react';

const Position = (props) => {
    console.log(props.details);
    console.log(props.selectedCustomer);
    
    return (
        <tbody>
            <tr>
                {/* <td>
                    <input type="text" value={lastName} onChange={handleChange} name='lastName' id='lastName' onBlur={handleChange} stateid={id}/>
                    {props.details.project}
                </td> */}
                <td>{props.details.description}</td>
                <td>{props.details.hours}</td>
                <td>{props.details.price}</td>
            </tr>
        </tbody>
    )
}

export default Position;
