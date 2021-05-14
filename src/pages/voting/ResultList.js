import React, { useEffect, useState } from 'react';
import {db} from '../../database/config.js';
import {useFlags} from '../../hooks/hostHooks';
import './resultList.css'

function ResultList(props) {

    var flags = useFlags(props.adminId);
    const [resultList, setResultList] = useState();

    const clickCheck = (event) => {
        if(event.target === event.currentTarget) {
            props.hide()
        }
    }

    const getResults = async () =>{
        let resultsLists ={};
        let countryOrder = {};
        props.countries.forEach((country) => {countryOrder[country.name.toLowerCase()] = country.turn - 1})
        await db.collection("users").doc(props.adminId).collection("users").doc(props.username).collection("countries").get().then((countries)=>{
            countries.forEach((country)=>{
                let data = country.data();
                let total_score = data.factor + data.costume + data.show + data.performance +data.song
                resultsLists[country.id] = total_score;
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
            var flag = [];
            if (flags) {
                flag = flags[cou[0]];
            };
            resultJSX.push(
                <div key={cou[0]} className="voting_result_list_row" onClick={() => {props.index(countryOrder[cou[0]]); props.changeIndex(countryOrder[cou[0]]); props.hide()}}>
                    {flag.length === 4 ? <div>{String.fromCharCode(flag[0],flag[1],flag[2],flag[3])}</div>: null}
                    <div className="voting_result_list_name">{cou[0]}</div>
                    <div className="voting_result_list_score">{cou[1]}</div>
                </div>
            )
        })
        setResultList(resultJSX);
        return resultsLists;
        
    }


    useEffect(()=> {
        getResults()
    },[flags])


    return(
        <div className="result_list_background" onClick={(e) => clickCheck(e)}>

            <div className="result_list_container">Ditt resultat:
                <div>{resultList}</div>
            </div>
        </div>
    )
}

export default ResultList