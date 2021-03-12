import React from 'react';
import './normalButton.css';

function NormalButton(props) {
    


    return(
        <div className="button no_select" onClick={props.action}>{props.name}</div>
    );
}
export default NormalButton;