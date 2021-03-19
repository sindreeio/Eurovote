import React, { useCallback, useEffect, useState }  from 'react';
import {db, firebaseAuth} from '../../database/config.js';
import {Redirect, Link} from 'react-router-dom';
import './hostPage.css';
import Reaction from '../../components/reaction';
import MaterialUIswitch from '../../components/switches/materialUIswitch'
import Menu from '../../components/assets/menu-white-18dp.svg';
import Close from '../../components/assets/close-white-18dp.svg';

function Overlay(props) {
    const [activateNRKCon, setActivateNRKCon] = useState(false);
    const [emojis, setEmojis] = useState([]);
    const [time, setTime] = useState(0);
    const [oldTime, setOldTime] = useState(0);
    const [myName, setMyName] = useState("lol");
    const [topMenu, setTopMenu] = useState(true);
    const [gameCode,setGameCode] = useState(false);
    const [showGameCode, setShowGameCode] = useState(true);
    const [activeVoting, setActiveVoting] = useState(false);
    const [users, setUsers] = useState([]);
    const [showUsers, setShowUsers] = useState(true);
    const [resultList, setResultList] = useState("(Ingen stemmer gitt)");
    const [showResultList, setShowResultList] = useState(false);
    const [flags, setFlags] = useState();
    const [results, setResults] = useState([]);

    useEffect(() => {
        if (Date.now() - oldTime > 5000) {
            setEmojis([<Reaction key={time} name={myName} />]);
        } else {
            setEmojis([...emojis, <Reaction key={time} name={myName}/>]);
        }
        setOldTime(Date.now());
        

    },[time])


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

    useEffect(() => {
        const unsubscribe = db.collection("users").doc(props.adminId).collection("reactions").doc("reaction").onSnapshot((snapshot) => {
            if (snapshot.data()) {
                setMyName(snapshot.data().name);
                setTime(snapshot.data().time);                
            }
        });
        return () => unsubscribe()
    }, [props.adminId]);

    useEffect(() => {
        db.collection("users").doc(props.adminId).get().then((doc) => {
            if (doc.data()) {
                setGameCode(doc.data().pin);
            }
        })
    }, [props.adminId])

    useEffect(()=>{
        db.collection("countries").get().then((countries)=>{
            var flagList = {}
            countries.forEach((country)=>{
                flagList[country.id] = country.data().flag;
            })
            setFlags(flagList);
        })
    }, [props.adminId])

    
    useEffect(() => {
        const unsubscribe = db.collection("users").doc(props.adminId).collection("users").onSnapshot((snapshot) => {
            let users = [];                
            let resultsLists = {};

            console.log("kjører")
            snapshot.forEach(element => {
                users.push(<div>{element.id}</div>);
                element.ref.collection("countries").get().then((countries)=>{
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
                .then(()=>{
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
                })
            
            })
            console.log("Hallo??");
            setUsers(users); 

        
        });
        return () => unsubscribe()
    
    }, [props.adminId, flags])

    useEffect(()=> {

    },[results])

    return(
        <div>
            { activateNRKCon ? <div className="nrk_options"></div> : null}
            {topMenu ? <div className="top_menu">
                <div className="top_menu_box close_button" onClick={() => setTopMenu(false)}><img src={Close}></img></div>
                <div className="top_menu_box"><MaterialUIswitch label={"Vis NRK"} default={props.nrk} action={props.setNrk}/></div>
                <div className="top_menu_box" ><MaterialUIswitch label={"Skjul NRK kontrollere"} default={activateNRKCon} action={setActivateNRKCon}/></div>
                <div className="top_menu_box"><MaterialUIswitch label={"Vis Spillkode"} default={showGameCode} action={setShowGameCode}/></div>
                <div className="top_menu_box"><MaterialUIswitch label={"Vis brukere"} default={showUsers} action={setShowUsers}/></div>
                <div className="top_menu_box"><MaterialUIswitch label={"Tillat stemming"} default={activeVoting} action={changeVotingStatus}/></div>
                <div className="top_menu_box"><MaterialUIswitch label={"Vis resultatliste"} default={showResultList} action={setShowResultList}/></div>
            </div> : <div className="top_menu_icon" onClick={() => setTopMenu(true)}><img src={Menu}></img></div>}
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