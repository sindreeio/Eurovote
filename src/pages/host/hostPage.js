import React, { useEffect, useState }  from 'react';
import {db, firebaseAuth} from '../../database/config.js';
import {Redirect, Link} from 'react-router-dom';
import Overlay from './overlay.js';
import './hostPage.css';


function HostPage(){
    const [doRedirectToLogin, setRedirectToLogin] = useState(false);
    const [showNRK, setShowNRK] = useState(true);
    const [uid, setUid] = useState();
    
    useEffect(()=>{
        firebaseAuth.onAuthStateChanged((user)=>{
            if (user){
                setUid(user.uid);
            }
            else{
                setRedirectToLogin(true);
            }
            
        })
    })


    return(
        <div className="host_content">
            {doRedirectToLogin ? <Redirect to="/"/> : null}
            {showNRK ? <div className="iframe_container">
                <iframe src="https://www.nrk.no/embed/PS*NRK1?autoplay=true" title="NRK" className="iframe" scrolling="yes"></iframe>
            </div> : null}
            <Overlay setNrk={setShowNRK} nrk={showNRK} adminId={uid}/>
        </div>
    )
}


export default HostPage;