import React, { useEffect, useState } from 'react';
import './landingPage.css';
import NormalButton from '../../components/buttons/normalButton.js';
import Inputfield from '../../components/inputfields/MaterialDesignField';
import { Link } from "react-router-dom";
import { firebaseAuth, db } from '../../database/config';
import Logo from '../../components/assets/Text.png';


function UserName(props) {
    return (
        <div className="main_container">
                
                <div className="Logo"><img src={Logo} className="Logo_img" alt="Eurovote"></img></div>
                    <div style={{width:"100%"} }> 
                        <div className="input_container input_margin">
                            <Inputfield id={"username"} label={"Skriv inn brukernavn"} setFunction={props.name}/>
                        </div>
                        <div className="message_code" style={{color: "red"}}>{props.error}</div>
                        <div className="input_container join_button" >
                            <NormalButton name="Join" action={props.submit}></NormalButton>
                        </div>
                        <div className="input_container join_button" >
                            <NormalButton name="Tilbake" action={() => props.back()}></NormalButton>
                        </div>
                    </div>
            </div>
    )
}

export default UserName;