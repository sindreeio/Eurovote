import React, { useEffect, useState } from 'react';
import { firebaseAuth, db } from '../../database/config';
import '../landingPage/landingPage.css';
import Slider from '../../components/sliders/materialDesignSlider';
import './voting.css';

function CountryVoter(props) {
    const [score, setScore] = useState(1);
    const [songScore, setSongScore] = useState(null);
    const [performanceScore, setPerformanceScore] = useState(null);
    const [showScore, setShowScore] = useState(0);
    const [costumeScore, setCostumeScore] = useState(0);
    const [factorScore, setFactorScore] = useState(0)
    
    
    const setVoteForCountry = (score, category)=>{
        db.collection("users").doc(props.adminId).collection(props.username).doc(props.countryId).set({[category]:score}, {merge:true});
        switch (category) {
            case "song":
                setSongScore(score);
                break;
            case "performance":
                setPerformanceScore(score);
                break;
            case "show":
                setShowScore(score);
                break;
            case "costume":
                setCostumeScore(score);
                break;
            case "factor":
                setFactorScore(score);
                break;
            default:
                break;
        }
    }


    console.log(props.countryId);
    useEffect(() => {
        db.collection("users").doc(props.adminId).collection(props.username).doc(props.countryId).get().then((data) => {
            if (data.data()){
                setSongScore(data.data().song);
                setPerformanceScore(data.data().performance);
                setShowScore(data.data().show)
                setCostumeScore(data.data().costume);
                setFactorScore(data.data().factor);
            }
        })
    }, [props.countryId])
    
    return(
        <div>
            <div className="slidercontainer" >
                <div className="text">Sang:</div>
                <div className="slider">
                    <Slider action={setVoteForCountry}  id={"song"}  value={songScore}/>
                </div>
            </div>
            <div className="slidercontainer">
                <div className="text">Framføring:</div>
                <div className="slider">
                    <Slider action={setVoteForCountry} id={"performance"} value={performanceScore}/>
                </div>
            </div>
            <div className="slidercontainer">
                <div className="text">Sceneshow:</div>
                <div className="slider">
                    <Slider action={setVoteForCountry} id={"show"} value={showScore}/>
                </div>
            </div>
            <div className="slidercontainer">
                <div className="text">Kostyme:</div>
                <div className="slider">
                    <Slider action={setVoteForCountry} id={"costume"} value={costumeScore}/>
                </div>
            </div>
            <div className="slidercontainer">
                <div className="text">Eurovisionfaktor:</div>
                <div className="slider">
                    <Slider action={setVoteForCountry} id={"factor"} value={factorScore}/>
                </div>
            </div>
        </div>
    )
}


export default CountryVoter;