import React, { useEffect, useState } from 'react';
import './landingPage.css';
import NormalButton from '../../components/buttons/normalButton.js';
import Inputfield from '../../components/inputfields/MaterialDesignField';
import UserName from './userName.js';
import { Link, Redirect } from "react-router-dom";
import { firebaseAuth, db } from '../../database/config';


function LandingPage() {
    const [code, setCode] = useState(null);
    const [id, setId] = useState(null);
    const [username, setUsername] = useState("");
    const [showUsername, setShowUsername] = useState(false);
    const [redirectToVote, setRedirectToVote] = useState(false);


    function joinButton() {
        if (code) {

            db.collection("users").get().then((col) => {
                col.docs.forEach((usr) => {
                    if(parseInt(code) === usr.data().pin) {
                        setShowUsername(true);
                        setId(usr.id);
                        console.log("Correct pin");
                    }
                })
            });
            if(!showUsername) {
                console.log("Wrong pin!");
            }
        }
    }

    function submit() {
        console.log(username);
        setRedirectToVote(true);

    }

    return(
        <div>
            <div className="main_container" style={showUsername ? {display: "none"} : {display: "flex"}}>
                {redirectToVote ? <Redirect to={`/vote/${username}/${id}`}/> : null}
                <div className="Logo">Eurovote</div>
                    <div style={{width:"100%"} }> 
                        <div className="input_container input_margin">
                            <Inputfield id={"field"} label={"Skriv inn kode"} setFunction={setCode}/>
                        </div>
                        
                        <div className="input_container join_button" >
                            <NormalButton name="Join" action={joinButton}></NormalButton>
                        </div>
                        <div className="message_code">Koden står øverst til høyre på skjermen til eieren av spillet</div>
                    </div>
                    <div className="new_group_button">
                        <Link to={'/login'}>
                        <NormalButton name="Lag ny gruppe"></NormalButton>
                        </Link>
                    </div>
            </div>
            <div style={showUsername ? {display: "block"} : {display: "none"}}>
                <UserName back={setShowUsername} submit={submit} name={setUsername}></UserName>
            </div>
        </div>

    );
}

export default LandingPage;