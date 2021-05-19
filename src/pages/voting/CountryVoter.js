import React, { useEffect, useState } from 'react';
import { db } from '../../database/config';
import '../landingPage/landingPage.css';
import Slider from '../../components/sliders/materialDesignSlider';
import './voting.css';

function CountryVoter(props) {
    const [songScore, setSongScore] = useState(0);
    const [performanceScore, setPerformanceScore] = useState(0);
    const [showScore, setShowScore] = useState(0);
    const [costumeScore, setCostumeScore] = useState(0);
    const [factorScore, setFactorScore] = useState(0);
    

    const setVoteForCountry = (score, category)=>{
        var total = songScore + performanceScore + showScore + costumeScore + factorScore;
        console.log("COUNRYVOTERVOTE");
        
        var dbRef = db.collection("users").doc(props.adminId).collection("users").doc(props.username);
        if(props.canVote){
            dbRef.collection("countries").doc(props.countryId).set({[category]:score}, {merge:true})
            .then(()=>{
                //dbRef.update({"time":Date.now()})
            })
            switch (category) {
                case "song":
                    total = total - songScore + score
                    setSongScore(score);
                    break;
                case "performance":
                    total = total - performanceScore + score
                    setPerformanceScore(score);
                    break;
                case "show":
                    total = total - showScore + score
                    setShowScore(score);
                    break;
                case "costume":
                    total = total - costumeScore + score
                    setCostumeScore(score);
                    break;
                case "factor":
                    total = total - factorScore + score
                    setFactorScore(score);
                    break;
                default:
                    break;
            }
            //dbRef.collection("countries").doc(props.countryId).set({"total":total}, {merge:true});
        }
    }

    useEffect(() => {
        console.log("COUNTRYCOTERSCORE")
        db.collection("users").doc(props.adminId).collection("users").doc(props.username).collection("countries").doc(props.countryId).get().then((data) => {
            if (data.data()){
                setSongScore(data.data().song);
                setPerformanceScore(data.data().performance);
                setShowScore(data.data().show)
                setCostumeScore(data.data().costume);
                setFactorScore(data.data().factor);
            }
        })
    }, [props.countryId])
    
    
    useEffect(() => {
        var total = songScore + performanceScore + showScore + costumeScore + factorScore;
        
        if (total) {
            
        }
        props.score(songScore + performanceScore + showScore + costumeScore + factorScore);
    })

    return(
        <div>
            {props.canVote?
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
            :
            <div className="no_vote_message">Verten har skrudd av muligheten for å stemme</div>}
        </div>
    )
}


export default CountryVoter;