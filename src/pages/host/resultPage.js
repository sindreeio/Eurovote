import React, {useEffect, useState }  from 'react';
import {db} from '../../database/config.js';
import './resultPage.css';
import {useFlags, useUsers} from '../../hooks/hostHooks';
import useUserId from '../../hooks/authentication';
import {Redirect, Link} from 'react-router-dom';
import NormalButton from '../../components/buttons/normalButton.js';

function ResultPage(props) {
    var uid = useUserId();
    var flags = useFlags(uid);
    const [resultList, setResultList] = useState("(Ingen stemmer gitt)");

    
    const getResults = async () =>{
        let resultsLists ={};
        let usernames = [];
        await db.collection("users").doc(uid).collection("users").get().then(async (users) => {
                console.log("RESULT PAGE USERS")
               users.forEach( async (user) => {
                    usernames.push(user.id);
                })
            })
        var promises = usernames.map( async (us) =>{
            await db.collection("users").doc(uid).collection("users").doc(us).collection("countries").get().then((countries)=>{
                    countries.forEach((country)=>{
                        let data = country.data();
                    
                        let total_score = [data.factor , data.costume , data.show , data.performance ,data.song]
                        if(resultsLists[data.name]){
                            for (var score in total_score) {
                                resultsLists[data.name][score] = resultsLists[data.name][score] + total_score[score]    
                            }
                        }
                        else{
                            resultsLists[data.name]= total_score
                        }
                    })
                })
            })
        await Promise.all(promises);
        //console.log(JSON.stringify(resultsLists));
        let resultTables = [];
        var resultlist = Object.keys(resultsLists).map((key)=>{
            return [key, resultsLists[key]]
        })
        const categories = ["Eurovisionfaktor", "Kostyme", "Sceneshow", "Framf??ring", "Sang", "Totalt"]
        for (var cat in categories) {
            let resultJSX = [<div className="result_page_category">{categories[cat]}</div>];
            if (categories[cat] === "Totalt"){
                resultlist.forEach((country) => {
                    country[1] = country[1].reduce((a, b) => a + b, 0);
                })
                resultlist.sort(function(first, second) {
                    return second[1] - first[1];
                });
            } else {
                // eslint-disable-next-line no-loop-func
                resultlist.sort(function(first, second) {
                    return second[1][cat] - first[1][cat];
                });
            }
            
            // eslint-disable-next-line no-loop-func
            resultlist.forEach((cou)=>{
                var flag = "";
                if (flags[cou[0].toLowerCase()]) {
                    flag = flags[cou[0].toLowerCase()];
                };
                resultJSX.push(
                    <div key={cou[0]} className="result_page_list_element">
                        {flag.length === 14 ? <div>{String.fromCodePoint(flag.substr(0,7), flag.substr(7,14))}</div>: null}
                        <div className="result_page_country">{cou[0]}</div>
                        <div className="result_page_score">{categories[cat] === "Totalt" ? cou[1]: cou[1][cat]}</div>
                    </div>
                )
            })
            resultTables.push(<div className="result_page_list">{resultJSX}</div>)
        }
        setResultList(resultTables);
        return resultsLists;
      
   }
    useEffect(()=> {
        if(Object.keys(flags).length !== 0) {
            getResults()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flags])

    return(
        <div className="result_page_container">
            <div className="result_page_header">Resultater</div>
            <div className="result_page_lists_container">{resultList}</div>
            <div className="result_page_back_button">
                <div>
                    <Link to={'/host'}>
                        <NormalButton name="G?? tilbake"></NormalButton>
                    </Link>
                </div>
            </div>
        </div>
    )

   

}

export default ResultPage;