import React, { useEffect, useState } from 'react';
import { firebaseAuth, db } from '../../database/config';
import '../landingPage/landingPage.css';
import Slider from '../../components/sliders/materialDesignSlider';
import { MDCSlider } from '@material/slider';
import './voting.css';

function CountryVoter(props) {
    const [flag, setFlag] = useState('');
    const [name, setName] = useState("");
    const [userName, setUserName] = useState(props.username);

    useEffect(()=>{
        try{
            db.collection("countries").doc(props.countryId).get().then((country)=>{
                if (country.exists){
                    setFlag(country.data().flag);
                    setName(country.data().name);
                }

            })
        }
        catch{
            console.log("error");
        }

    },)


    return(
            <div className="votingcontainer">
                <div className="header">{String.fromCharCode(flag[0],flag[1],flag[2],flag[3])} {name}</div>
                <div className="slidercontainer" >
                    <div className="text">Sang:</div>
                    <div className="slider">
                        <Slider id={"song"}/>
                    </div>
                </div>
                <div className="slidercontainer">
                    <div className="text">Framføring:</div>
                    <div className="slider">
                        <Slider id={"performance"}/>
                    </div>
                </div>
                <div className="slidercontainer">
                    <div className="text">Sceneshow:</div>
                    <div className="slider">
                        <Slider id={"show"}/>
                    </div>
                </div>
                <div className="slidercontainer">
                    <div className="text">Kostyme:</div>
                    <div className="slider">
                        <Slider id={"costume"}/>
                    </div>
                </div>
                <div className="slidercontainer">
                    <div className="text">Eurovisionfaktor:</div>
                    <div className="slider">
                        <Slider id={"factor"}/>
                    </div>
                </div>
            </div>

    )
}


export default CountryVoter;