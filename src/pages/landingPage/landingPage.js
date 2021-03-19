import React, { useEffect, useState } from 'react';
import './landingPage.css';
import NormalButton from '../../components/buttons/normalButton.js';
import Inputfield from '../../components/inputfields/MaterialDesignField';
import UserName from './userName.js';
import { Link, Redirect } from "react-router-dom";
import { db } from '../../database/config';


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
                    }
                })
            });
            if(!showUsername) {
            }
        }
    }

    function submit() {
        setRedirectToVote(true);
        const init_numbers = {"song":0, "performance":0, "show":0, "factor":0, "costume":0}
        db.collection("users").doc(id).collection("users").doc(username).set({"name":username, "time": Date.now()}).then(()=>{
            const userRef = db.collection("users").doc(id).collection("users").doc(username).collection("countries");
            userRef.get().then((collection)=> {
                if (collection.docs.length == 0){
                    db.collection("countries").orderBy("turn").get().then((countries)=>{
                        countries.forEach((country) =>{
                            userRef.doc(country.id).set(init_numbers);
                        });
                    })
                }
            })
        })
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