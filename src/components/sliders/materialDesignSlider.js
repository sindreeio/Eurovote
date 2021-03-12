import React, {useEffect} from 'react';
import { MDCSlider } from '@material/slider';
import '../../App.css'


function MaterialDesignSlider(props){
    var textField = null; 
    useEffect(()=> {
        textField = new MDCSlider(document.querySelector('#'+ props.id));
    },[])

    return(
        <div>
        <div className="mdc-slider mdc-slider--discrete mdc-slider--tick-marks no-select" id={props.id}>
        <input class="mdc-slider__input no_select" type="range" min="0" max="12" value="0" name="volume" step="1" aria-label="Discrete slider with tick marks demo"/>
        <div class="mdc-slider__track no_select">
            <div class="mdc-slider__track--inactive"></div>
            <div class="mdc-slider__track--active">
            <div class="mdc-slider__track--active_fill"></div>
            </div>
            <div class="mdc-slider__tick-marks">
            <div class="mdc-slider__tick-mark--active"></div>
            <div class="mdc-slider__tick-mark--active"></div>
            <div class="mdc-slider__tick-mark--active"></div>
            <div class="mdc-slider__tick-mark--active"></div>
            <div class="mdc-slider__tick-mark--active"></div>
            <div class="mdc-slider__tick-mark--active"></div>
            <div class="mdc-slider__tick-mark--inactive"></div>
            <div class="mdc-slider__tick-mark--inactive"></div>
            <div class="mdc-slider__tick-mark--inactive"></div>
            <div class="mdc-slider__tick-mark--inactive"></div>
            <div class="mdc-slider__tick-mark--inactive"></div>
            </div>
        </div>
        <div class="mdc-slider__thumb">
            <div class="mdc-slider__value-indicator-container" aria-hidden="true">
            <div class="mdc-slider__value-indicator">
                <span class="mdc-slider__value-indicator-text">
                6
                </span>
            </div>
            </div>
            <div class="mdc-slider__thumb-knob"></div>
        </div>
        </div>
        </div>
    );
    }
export default MaterialDesignSlider;