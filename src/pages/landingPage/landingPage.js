import React, { useEffect, useState } from 'react';
import './landingPage.css';
import NormalButton from '../../components/buttons/normalButton.js';
import Inputfield from '../../components/inputfields/MaterialDesignField';
import Logo from '../../components/assets/Text.png';
import UserName from './userName.js';
import { Link, Redirect } from "react-router-dom";
import { db } from '../../database/config';


function LandingPage() {
    const [code, setCode] = useState(null);
    const [id, setId] = useState(null);
    const [username, setUsername] = useState("");
    const [showUsername, setShowUsername] = useState(false);
    const [redirectToVote, setRedirectToVote] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [nameTakenMsg, setNameTakenMsg] = useState("");


    function joinButton() {
        if (code) {

            db.collection("users").get().then((col) => {
                var errormsg = ""
                col.docs.forEach((usr) => {
                    if(parseInt(code) === usr.data().pin) {
                        if (usr.data().usersCanJoin !== false){
                            setShowUsername(true);
                            setId(usr.id);
                        }
                        else{
                            errormsg = "Verten må vise koden på skjermen for at du skal kunne bli med";
                        }
                        
                    }else {
                        if (errormsg === "") {
                            errormsg = "Det finnes ingen spill med denne koden";
                        }
                    }
                })
                setErrorMessage(errormsg);
            });
            if(!showUsername) {
            }
        }
    }

    function submit() {
        var userNameExists = false;
        db.collection("users").doc(id).get().then( async (doc) => {
            if(doc.data().started === false) {
              await db.collection("users").doc(id).collection("users").get().then((users)=>{
                    users.forEach((user)=>{
                        if (user.data().name == username){
                            console.log(user.data().name)
                            userNameExists = true;
                        }
                    })
                })
            }
        })
        .then(()=>{
            if (username === ""){
                setNameTakenMsg("Brukernavnet kan ikke være tomt");
            }else if (!userNameExists){
                localStorage.setItem("eurovote_uid",id);
                localStorage.setItem("eurovote_username", username);
                setRedirectToVote(true);
                const init_numbers = {"song":0, "performance":0, "show":0, "factor":0, "costume":0}
                db.collection("users").doc(id).collection("users").doc(username).set({"name":username, "time": Date.now()}).then(()=>{
                    const userRef = db.collection("users").doc(id).collection("users").doc(username).collection("countries");
                    userRef.get().then((collection)=> {
                        if (collection.docs.length == 0){
                            db.collection("countries").orderBy("turn").get().then((countries)=>{
                                countries.forEach((country) =>{
                                    if (parseInt(country.data().turn) !== -1) {
                                        userRef.doc(country.id).set(init_numbers);
                                    }
                                });
                            })
                        }
                    })
                })
            } else {
                setNameTakenMsg("Dette brukernavnet er allerede i bruk");
            }
        })
    }

    const back = () => {
        setShowUsername(false)
        setErrorMessage("")
    }

    const checkIfMobile = () => {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            return true;
        }
        else if (/android/i.test(userAgent)) {
            return true;
        } else {
            return false;
        }
    }

    useEffect(() => {
        if(localStorage.getItem('eurovote_username') && localStorage.getItem('eurovote_uid')) {
            setRedirectToVote(true);
        }
    }, [])

    return(
        <div>
            <div className="main_container" style={showUsername ? {display: "none"} : {display: "flex"}}>
                {redirectToVote ? <Redirect to={`/vote`}/> : null}
                <div className="Logo"><img src={Logo} className="Logo_img" alt="Eurovote"></img></div>
                {checkIfMobile() == true ?  
                    <div style={{width:"100%"} }>
                        
                        <div className="input_container input_margin">
                            <Inputfield id={"field"} label={"Skriv inn kode"} setFunction={setCode}/>
                        </div>
                        
                        <div className="input_container join_button" >
                            <NormalButton name="Join" action={joinButton}></NormalButton>
                        </div>
                        {errorMessage !== "" ? <div style={{color:"red"}} className="message_code">{errorMessage}</div> : null}
                        <div className="message_code">Koden står øverst på skjermen til eieren av spillet.</div>
                        <div className="message_code">Har du ikke noe spill? Besøk denne nettsiden på en PC/Mac for å opprette et nytt.</div>
                        <div className="message_code">Vi anbefaler å legge denne webapplikasjonen til på hjemskjermen.</div>
                    </div>
                    :
                    <div className="flex_center">
                        <div className="new_group_button">
                            <Link to={'/login'}>
                            <NormalButton name="Logg inn eller lag nytt spill"></NormalButton>
                            </Link>
                        </div>
                        <div className="message_code">Trykk på knappen over for å lage et nytt spill. Bare én i gruppen trenger å gjøre dette. Vi anbefaler å koble denne PCen på en storskjerm.</div>    
                    <div className="message_code">For å bli med i et spill, besøk siden på en mobil enhet</div>
                    
                    </div>
                }
            </div>
            <div style={showUsername ? {display: "block"} : {display: "none"}}>
                <UserName back={back} submit={submit} name={setUsername} error={nameTakenMsg}></UserName>
            </div>
        </div>

    );
}

export default LandingPage;