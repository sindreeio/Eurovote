import React, {useEffect, useState} from 'react';
import Slider from '@material-ui/core/Slider';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import '../../App.css';


function MaterialDesignSlider(props){
    const [score, setScore] = useState(0);
    const [slider, setSlider] = useState(6);
    

    useEffect(() => {
        console.log(props.value);
        setScore(props.value);
        setSlider(props.value);
    }, [props.value])

    const rgbcolor = "122, 108 ,250";
    const muiTheme = createMuiTheme({
        overrides:{
          MuiSlider: {
            thumb:{
                color: "rgb("+ rgbcolor +")",
            },
            track: {
                color: "rgb("+ rgbcolor +")"
            },
            rail: {
              color: "rgba("+ rgbcolor +",.4)"
            },
            mark: {
                color: "rgba("+ rgbcolor +",.7)"
            }
          }
      }
      });
    
    return(
        <div>
            <ThemeProvider theme={muiTheme}>
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
            </ThemeProvider>

        </div>
        
    
    );
    }
export default MaterialDesignSlider;