import React, { useEffect, useState } from 'react';
import { firebaseAuth } from '../../database/config';
import '../landingPage/landingPage.css';
import NormalButton from '../../components/buttons/normalButton.js';
import Inputfield from '../../components/inputfields/MaterialDesignField';
import {Redirect, Link} from 'react-router-dom';



function Login(){
    const [doRedirectToGroups, setRedirectToGroups]= useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    useEffect(()=>{
        console.log(email);
        console.log(password)
        firebaseAuth.onAuthStateChanged(function(user){
            if(user){
                setRedirectToGroups(true);
            }
            else{
                setRedirectToGroups(false);
            }
        })
    })


    const submit = () =>{
        console.log("submit")
        firebaseAuth.signInWithEmailAndPassword(email, password)
        .then((user) => {
            console.log(user);
            console.log("user created");
            setRedirectToGroups(true);
        })
        .catch((error) => {
            setError(error);
        });
    }

    return(
        
        <div className="main_container">
            {doRedirectToGroups ? <Redirect to="/groups"/> : null}
            <div className="Logo">Eurovote</div>
                <div style={{width:"100%"}}>
                    <div className="input_container input_margin">
                        <Inputfield setFunction={setEmail} label="Brukernavn" type="text" id="email"/>
                    </div>
                    <div className="input_container input_margin">
                        <Inputfield setFunction={setPassword} label="Passord" type="password" id="password"/>
                    </div>
                    <div onClick={() => submit()} className="input_container join_button" >
                        <NormalButton name="Login"></NormalButton>
                    </div>
                    <div className="input_container join_button" >
                        <Link to={'/registrer'}>
                        <NormalButton name="Registrer"></NormalButton>
                        </Link>
                    </div>
                    {error && <p className="textColor">{error.message}</p>}
                </div>
        </div>
    )
}

export default Login;