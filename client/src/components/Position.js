import React, {useState, useEffect} from 'react';
const { ipcRenderer } = window.require('electron');

const Position = (props) => {
    // console.log(props.details);
    // console.log(props.selectedCustomer);

    const [project, setProject] = useState('');
    const [description, setDescription] = useState('');
    const [hours, setHours] = useState('');

    useEffect(() => {
        setProject(props.details.project);
        setDescription(props.details.description);
        setHours(props.details.hours);
    }, [])

    const handleChange = (event) => {
        if(event.type === 'change') {
            switch(event.target.name) {
                case 'project':
                    setProject(event.target.value);
                    break;
                case 'description':
                    setDescription(event.target.value);
                    break;
                case 'hours':
                    setHours(event.target.value);
                    break;
            }
        }

        if(event.type === 'blur') {
            //let stateId = Number(event.target.getAttribute('stateid'));
            // console.log('blur');
            // console.log(project);
            // console.log(props.details.id);
            // console.log(event.target.name);
            let id = props.details.id;
            ipcRenderer.send('update-position', [`UPDATE positions SET ${event.target.name} = ? WHERE id = ?`, [event.target.value, id]]);
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
                <td>
                    <input type="text" value={description} onChange={handleChange} onBlur={handleChange} name='description'/>
                </td>
                <td>
                    <input type="text" value={hours} onChange={handleChange} onBlur={handleChange} name='hours'/>
                </td>
            </tr>
        </tbody>
    )
}

export default Position;
