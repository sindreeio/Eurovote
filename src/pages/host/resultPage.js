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
    var {users, usernames, newResults} = useUsers(uid, flags)
    const [resultList, setResultList] = useState("(Ingen stemmer gitt)");

    
    const getResults = async () =>{
        let resultsLists ={};
        var promises = usernames.map( async (us) =>{
            await  db.collection("users").doc(uid).collection("users").doc(us).collection("countries").get().then((countries)=>{
                countries.forEach((country)=>{
                    let data = country.data();
                    
                    let total_score = [data.factor , data.costume , data.show , data.performance ,data.song]
                    if(resultsLists[country.id]){
                        for (var score in total_score) {
                            resultsLists[country.id][score] = resultsLists[country.id][score] + total_score[score]    
                        }
                    }
                    else{
                        resultsLists[country.id]= total_score
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
        const categories = ["Eurovisionfaktor", "Kostyme", "Sceneshow", "Framføring", "Sang", "Totalt"]
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
                var flag = [];
                if (flags) {
                    flag = flags[cou[0]];
                };
                resultJSX.push(
                    <div key={cou[0]} className="result_page_list_element">
                        {flag.length === 4 ? <div>{String.fromCharCode(flag[0],flag[1],flag[2],flag[3])}</div>: null}
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
        if(uid && usernames.length !== 0) {
            getResults()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [usernames.length])

    return(
        <div>
            <div className="result_page_header">Resultater</div>
            <div className="result_page_container">{resultList}</div>
            <div className="result_page_back_button">
                <div>
                    <Link to={'/host'}>
                        <NormalButton name="Gå tilbake"></NormalButton>
                    </Link>
                </div>
            </div>
        </div>
    )

   

}

export default ResultPage;