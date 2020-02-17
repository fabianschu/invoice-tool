import React, {useState, useEffect} from 'react';
const { ipcRenderer } = window.require('electron');

const Position = (props) => {

    const [project, setProject] = useState('');
    const [description, setDescription] = useState('');
    const [hours, setHours] = useState('');
    const [price, setPrice] = useState('');

    useEffect(() => {
        setProject(props.details.project);
        setDescription(props.details.description);
        setHours(props.details.hours);
        setPrice(props.details.price);
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
            let id = props.details.id;
            console.log(hourlyRate)
            if(event.target.name != 'hours') {
                ipcRenderer.send('update-position', [`UPDATE positions SET ${event.target.name} = ? WHERE id = ?`, [event.target.value, id]]);
            }
            else if (event.target.name === 'hours'){
                ipcRenderer.send('update-position', [`UPDATE positions SET hours = ?, price = ? WHERE id = ?`, [event.target.value, hourlyRate * hours, id]]);
            }
        }
    }

    const handleClick = (event) => {
        ipcRenderer.send('delete-position', [`DELETE FROM positions WHERE id=?`, {position_id: props.details.id, invoice_id: props.details.fk_invoice}]);
    }

    let hourlyRate = props.customers.find(customer => customer.id === props.selectedCustomer).rate;


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
                <td>
                    {hourlyRate * hours}
                </td>
                <td>
                    <button onClick={handleClick}>Delete</button>
                </td>
            </tr>
        </tbody>
    )
}

export default Position;
