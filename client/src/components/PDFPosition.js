import React, {useState, useEffect} from 'react';

const PDFPosition = (props) => {

    console.log(props);

    return (
        <tbody>
            <tr>
                {/* <td>
                    <input type="text" value={lastName} onChange={handleChange} name='lastName' id='lastName' onBlur={handleChange} stateid={id}/>
                    {props.details.project}
                </td> */}
                <td>
                    <p>{props.details.project}</p>
                </td>
                <td>
                    <p>{props.details.description}</p>
                </td>
                <td>
                    <p>{props.details.hours}</p>
                </td>
                <td>
                    <p>{props.details.price}</p>
                </td>
            </tr>
        </tbody>
    )
}

export default PDFPosition;