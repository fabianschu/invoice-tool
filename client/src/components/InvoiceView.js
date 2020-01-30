import React, {useState} from 'react';
const { ipcRenderer } = window.require('electron');


const InvoiceView = (props) => {

    const [buttonsDisplay, setButtonsDisplay] = useState(true);

    const printHandler = event => {
        setButtonsDisplay(false);
        setTimeout(function(){ setButtonsDisplay(true); }, 2000);
        setTimeout(function(){ ipcRenderer.send('print', 'print'); }, 1000);
    }

    const backHandler = event => {
        props.setSpecialView(false);
    }

    return (
        <div>
            kukuluku
            {buttonsDisplay &&
            <>
                <button onClick={backHandler}>Back</button>
                <button onClick={printHandler}>Print</button>
            </>
            }   
        </div>
    )
}

export default InvoiceView
