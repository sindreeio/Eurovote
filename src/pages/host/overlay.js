import React, {useEffect, useState }  from 'react';
import {db} from '../../database/config.js';
import {Redirect, Link} from 'react-router-dom';
import './hostPage.css';
import MaterialUIswitch from '../../components/switches/materialUIswitch'
import NormalButton from '../../components/buttons/normalButton.js';
import Menu from '../../components/assets/menu-white-18dp.svg';
import Close from '../../components/assets/close-white-18dp.svg';
import {useGameCode, useFlags, useUsers, useLatestReaction, useEmojis} from '../../hooks/hostHooks';

function Overlay(props) {
    const [activateNRKCon, setActivateNRKCon] = useState(false);
    const {myName, time} = useLatestReaction(props.adminId)
    const emojis = useEmojis(time, myName);
    const [topMenu, setTopMenu] = useState(true);
    const gameCode = useGameCode(props.adminId)
    const [showGameCode, setShowGameCode] = useState(true);
    const [activeVoting, setActiveVoting] = useState(false);
    const [showUsers, setShowUsers] = useState(true);
    const [resultList, setResultList] = useState("(Ingen stemmer gitt)");
    const [showResultList, setShowResultList] = useState(false);
    var flags = useFlags(props.adminId);
    const {users, usernames, newResults} = useUsers(props.adminId, flags);



    const changeVotingStatus = () =>{
        let status;
        db.collection("users").doc(props.adminId).get().then((doc)=>{
            status = doc.data().canVote
        })
        .then(()=>{
            db.collection("users").doc(props.adminId).update({"canVote":!status})
            setActiveVoting(!status);
        })
        
        
        
    }
    useEffect(()=>{
        db.collection("users").doc(props.adminId).get().then((doc)=>{
            if (doc.data()) {
                setActiveVoting(doc.data().canVote)
            }
        })

    }, [props.adminId])

     const getResults = async () =>{
         let resultsLists ={};
        var promises = usernames.map( async (us) =>{
          await  db.collection("users").doc(props.adminId).collection("users").doc(us).collection("countries").get().then((countries)=>{
                countries.forEach((country)=>{
                    let data = country.data();
                    let total_score = data.factor + data.costume + data.show + data.performance +data.song
                    if(resultsLists[country.id]){
                        resultsLists[country.id] = resultsLists[country.id] + total_score
                    }
                    else{
                        resultsLists[country.id] = total_score;
                    }
                })
            })
        })
        await Promise.all(promises);
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
                <div key={cou[0]} className="result_list_row">
                    {flag.length === 4 ? <div>{String.fromCharCode(flag[0],flag[1],flag[2],flag[3])}</div>: null}
                    <div className="result_list_name">{cou[0]}</div>
                    <div className="result_list_score">{cou[1]}</div>
                </div>
            )
        })
        setResultList(resultJSX);
        return resultsLists;
       
    }


    useEffect(()=> {
        getResults()
    },[newResults])

    return(
        <div>
            { activateNRKCon ? <div className="nrk_options"></div> : null}
            {topMenu ? <div className="top_menu">
                <div className="top_menu_box close_button" onClick={() => setTopMenu(false)}><img src={Close} alt="close"></img></div>
                <div className="top_menu_box"><MaterialUIswitch label={"Vis NRK"} default={props.nrk} action={props.setNrk}/></div>
                <div className="top_menu_box" ><MaterialUIswitch label={"Skjul NRK kontrollere"} default={activateNRKCon} action={setActivateNRKCon}/></div>
                <div className="top_menu_box"><MaterialUIswitch label={"Vis Spillkode"} default={showGameCode} action={setShowGameCode}/></div>
                <div className="top_menu_box"><MaterialUIswitch label={"Vis brukere"} default={showUsers} action={setShowUsers}/></div>
                <div className="top_menu_box"><MaterialUIswitch label={"Tillat stemming"} default={activeVoting} action={changeVotingStatus}/></div>
                <div className="top_menu_box"><MaterialUIswitch label={"Vis resultatliste"} default={showResultList} action={setShowResultList}/></div>
                <div className="top_menu_box">
                        <Link to={'/results'}>
                            <NormalButton name="Gå til resultater"></NormalButton>
                        </Link>
                    </div>
            </div> : <div className="top_menu_icon" onClick={() => setTopMenu(true)}><img src={Menu} alt="menu"></img></div>}
            <div className="host_info_container">
                    {showGameCode ? <div className="game_code_box">
                        Kode: {gameCode}
                    </div> : null}
                    {showUsers ? <div className="users_list_box"> 
                        Brukere: <br/>
                        {users}
                    </div> : null}

            </div>
            {showResultList ? <div className="result_list_box">
                Resultat: <br/>
                {resultList}
            </div>: null}
            {emojis}
        </div>
    )
}

export default Overlay;