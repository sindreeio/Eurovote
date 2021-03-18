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
    const [canVote, setCanVote] = useState(false);
    

    const setVoteForCountry = (score, category)=>{
        if(canVote){
            db.collection("users").doc(props.adminId).collection("users").doc(props.username).collection("countries").doc(props.countryId).set({[category]:score}, {merge:true})
            .then(()=>{
                db.collection("users").doc(props.adminId).collection("users").doc(props.username).update({"time":Date.now()})
            })
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
    }

    useEffect(() => {
        db.collection("users").doc(props.adminId).collection("users").doc(props.username).collection("countries").doc(props.countryId).get().then((data) => {
            if (data.data()){
                setSongScore(data.data().song);
                setPerformanceScore(data.data().performance);
                setShowScore(data.data().show)
                setCostumeScore(data.data().costume);
                setFactorScore(data.data().factor);
            }
        })
        const unsubscribe = db.collection("users").doc(props.adminId).onSnapshot((doc)=>{
            if(doc.data()){
                setCanVote(doc.data().canVote)
            }
        });
        return () => unsubscribe()
    }, [props.adminId, props.countryId, props.username])
    
    useEffect(() => {
        props.score(songScore + performanceScore + showScore + costumeScore + factorScore);
    })

    return(
        <div>
            {canVote?
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