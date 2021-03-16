import React, { useEffect, useState }  from 'react';
import {db, firebaseAuth} from '../../database/config.js';
import {Redirect, Link} from 'react-router-dom';
import './hostPage.css'

function Overlay(props) {
    const [activateOverlay, setOverlay] = useState(false);

    return(
        <div>
            { activateOverlay ? <div className="overlay"></div> : null}
            <div className="bottom_bar">
                <div className="bottom_bar_box" onClick={() => setOverlay(!activateOverlay)}>Overlay</div>
                <div className="bottom_bar_box">Vis/skjul spillere</div>
                <div className="bottom_bar_box">Vis/skjul tabell</div>
                <div className="bottom_bar_box">Start/stopp spill</div>
                <div className="bottom_bar_box" onClick={() => props.setNrk(!props.nrk)}>Vis/skjul NRK</div>
            </div>
        </div>
    )
}

export default Overlay;