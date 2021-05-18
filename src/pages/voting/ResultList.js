import React, { useEffect, useState } from 'react';
import {db} from '../../database/config.js';
import './resultList.css'
import {Redirect } from 'react-router-dom';


function ResultList(props) {

    const [resultList, setResultList] = useState();
    const [redirectToHome, setRedirectToHome] = useState(false);

    const clickCheck = (event) => {
        if(event.target === event.currentTarget) {
            props.hide()
        }
    }

    const logout = () => {
        if (window.confirm("Er du sikker på at du vil logge ut?")) {
            localStorage.removeItem("eurovote_uid");
            localStorage.removeItem("eurovote_username");
            setRedirectToHome(true);
        }

    }

    const getResults = async () =>{
        let resultsLists ={};
        let countryOrder = {};
        let flags = {}
        props.countries.forEach((country) => {
            countryOrder[country.name] = country.turn - 1;
            flags[country.name] = country.flag;
        })
        await db.collection("users").doc(props.adminId).collection("users").doc(props.username).collection("countries").get().then((countries)=>{
            countries.forEach((country)=>{
                let data = country.data();
                resultsLists[data.name] = data.factor + data.costume + data.show + data.performance +data.song;
            })
        })
        // console.log(JSON.stringify(resultsLists));
        let resultJSX =[];
        var resultlist = Object.keys(resultsLists).map((key)=>{
            return [key, resultsLists[key]]
        })
        resultlist.sort(function(first, second) {
            return second[1] - first[1];
        });
        resultlist.forEach((cou)=>{
            var flag = "";
            if (flags) {
                flag = flags[cou[0]];
            };
            resultJSX.push(
                <div key={cou[0]} className="voting_result_list_row" onClick={() => {props.index(countryOrder[cou[0]]); props.changeIndex(countryOrder[cou[0]]); props.hide()}}>
                    {flag.length === 14 ? <div>{String.fromCodePoint(flag.substr(0,7), flag.substr(7,14))}</div>: null}
                    <div className="voting_result_list_name">{cou[0]}</div>
                    <div className="voting_result_list_score">{cou[1]}</div>
                </div>
            )
        })
        resultJSX.push(
            <div key={resultJSX.length + 1} className="voting_result_list_row" style={{color: "red", justifyContent: "center"}} onClick={() => logout()}>
                <div >Logg ut</div>
            </div>
        )
        setResultList(resultJSX);
        return resultsLists;
        
    }


    useEffect(()=> {
        getResults()
    },[])


    return(
        <div className="result_list_background" onClick={(e) => clickCheck(e)}>
            {redirectToHome ? <Redirect to="/"/>: null}
            <div className="result_list_container">{props.username}'s resultat:
                <div>{resultList}</div>
            </div>
        </div>
    )
}

export default ResultList