import React, {useState} from 'react';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';


function MaterialUIswitch(props){
    
    
    
    const changed = () =>{
        props.action(!props.default);
    }

    return(
        <FormControl component="fieldset">
            <FormGroup aria-label="position" row>
                <FormControlLabel
                value="end"
                control={<Switch color="primary" />}
                label={props.label}
                checked={props.default}
                onChange={changed}
                labelPlacement="end"
                />
            </FormGroup>
        </FormControl>
    )
}

export default MaterialUIswitch;