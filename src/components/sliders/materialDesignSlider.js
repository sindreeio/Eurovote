import React, {useEffect, useState} from 'react';
import Slider from '@material-ui/core/Slider';
import { makeStyles } from '@material-ui/core/styles';
import '../../App.css';


function MaterialDesignSlider(props){
    var textField = null; 
    const [score, setScore] = useState(0);
    const [slider, setSlider] = useState(6);
    
    const useStyles = makeStyles({
        root: {
        width: 300,
        },
    });

    useEffect(() => {
        console.log(props.value);
        setScore(props.value);
        setSlider(props.value);
    }, [props.value])



    
    return(
        <div>
        <Slider
            defaultValue={slider}
            key={`slider-${slider}`}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
            step={1}
            marks
            min={0}
            max={12}
            onChange={ (e, val) => setScore(val)}
            onChangeCommitted={(e)=> props.action(score, props.id)}
        />

        </div>
        
    
    );
    }
export default MaterialDesignSlider;