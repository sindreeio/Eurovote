import React, { useEffect, useState } from 'react';
import MaterialDesignField from '../../components/inputfields/MaterialDesignField';
import {Link} from 'react-router-dom';
import {firebaseAuth, db} from '../../database/config';
import {Redirect} from 'react-router-dom';
import '../landingPage/landingPage.css';
import NormalButton from '../../components/buttons/normalButton.js';




function Register(){
const [error, setError] = useState(null);
const [email,setEmail] = useState("");
const [password, setPassword] = useState("");
const [repeat_password, setRepeat_password] = useState("");
const [agrees, setAgrees] = useState(false);
const [doRedirectToFeed, setRedirectToFeed] = useState(false);

 useEffect(()=>{
    firebaseAuth.onAuthStateChanged(function(user){
        if(user){
            setRedirectToFeed(true);
        }
        else{
            setRedirectToFeed(false);
        }
    })
    console.log(firebaseAuth.is)
})
const changeAgrees = () =>{
    if (agrees){
        setAgrees(false);
    }
    else{
        setAgrees(true);
    }
}

const submit = () =>{
    if(password !== repeat_password) {
        setError({message: "Passordene er ikke like"});
    }else{
    if(agrees){
        console.log("agrees")
        firebaseAuth.createUserWithEmailAndPassword(email, password).then(
            function(user){
                console.log(user);
                try{
                    let current_pin = null;
                    db.collection("pin").doc("current_pin").get().then((doc)=>{
                        if(doc.exists){
                            current_pin = doc.data().current_pin
                        }
                        else{
                            console.log("no pin found");
                        }
                    }).then(()=>{
                        db.collection('users').doc(user.user.uid).set({ pin:current_pin, "canVote": false, "usersCanJoin": true});
                        db.collection("pin").doc("current_pin").set({current_pin: (current_pin + Math.floor(Math.random()*100))});
                    }
                    )
                }
                catch{
                    console.log("error")
                }

            }
        )
        .catch((error) => {
            console.log("error")
            setError(error);
        });
    }
    else{
        setError({message:"Du må godta terms and conditions og privacy policy for å registrere deg"});

    }
    };
}
    return(

        <div className="main_container">
            {doRedirectToFeed ? <Redirect to="/host"/> : null}
            <div className="Logo">Eurovote</div>
                <div style={{width:"100%"}}>
                    <div className="input_container ">
                        <MaterialDesignField setFunction={setEmail} label="Brukernavn" type="text" id="email"/>
                    </div>
                    <div className="input_container ">
                        <MaterialDesignField setFunction={setPassword} label="Passord" type="password" id="password"/>
                    </div>
                <div className="input_container ">
                    <MaterialDesignField setFunction={setRepeat_password} label="Gjenta passord" type="password" id="repeat_password"/>
                </div>
                <p className="message_code"><input onClick={changeAgrees} type="checkbox"></input>I agree to the <a href="https://www.termsandconditionsgenerator.com/live.php?token=AxtmXo81ANEyU84S9aana9s6RoK4GryK">Terms and conditions</a> and the <a href="https://www.privacypolicygenerator.info/live.php?token=lPUtr2H4zyIztpxaeOFIeJischcT4RH7">Privacy policy</a></p>
                {error && <p className="textColor">{error.message}</p>}
                <div onClick={() => submit()} className="input_container join_button" >
                        <NormalButton name="Registrer"></NormalButton>
                </div>                
                <div className="message_code">Har du allerede bruker?<Link to='/login'>Logg inn</Link></div>
            </div>
        </div>
    )
}

export default Register;