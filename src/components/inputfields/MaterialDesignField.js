import React, {useEffect} from 'react';
import {MDCTextField} from '@material/textfield';


//needs props label, , type which is the input field type and setFunction which is where the input will be sent to
function MaterialDesignField(props){
    var textField = null; 
    useEffect(()=> {
        textField = new MDCTextField(document.querySelector('#'+ props.id));
    })

    return(
        <label className="mdc-text-field mdc-text-field--filled" id={props.id}>
        <span className="mdc-text-field__ripple"></span>
        <span className="mdc-floating-label" id="my-label-id">{props.label}</span>
        <input className="mdc-text-field__input" onChange={(text) => props.setFunction(text.target.value)} type={props.type} aria-labelledby="my-label-id"/>
        <span className="mdc-line-ripple"></span>
    </label>
    )
    }
export default MaterialDesignField;