import React, {useState, useEffect} from 'react';
const { ipcRenderer } = window.require('electron');

const Position = (props) => {
    console.log(props.details);
    console.log(props.selectedCustomer);

    const [project, setProject] = useState('');

    useEffect(() => {
        setProject(props.details.project);
    }, [])

    const handleChange = (event) => {
        if(event.type === 'change') {
            setProject(event.target.value);
        }

        if(event.type === 'blur') {
            //let stateId = Number(event.target.getAttribute('stateid'));
            console.log('blur');
            console.log(project);
            console.log(props.details.id);
            console.log(event.target.name);
            let id = props.details.id;
            ipcRenderer.send('update-position', [`UPDATE customers SET ${event.target.name} = ? WHERE id = ?`, [event.target.value, id]]);
        }
    }
    
    return (
        <tbody>
            <tr>
                {/* <td>
                    <input type="text" value={lastName} onChange={handleChange} name='lastName' id='lastName' onBlur={handleChange} stateid={id}/>
                    {props.details.project}
                </td> */}
                <td>
                    <input type="text" value={project} onChange={handleChange} onBlur={handleChange} name='project'/>
                </td>
                <td>{props.details.hours}
                </td>
                <td>{props.details.price}
                </td>
            </tr>
        </tbody>
    )
}

export default Position;
