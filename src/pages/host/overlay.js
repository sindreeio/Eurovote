import React, {useEffect, useState }  from 'react';
import {db, firebaseAuth} from '../../database/config.js';
import {Redirect, Link} from 'react-router-dom';
import './hostPage.css';
import MaterialUIswitch from '../../components/switches/materialUIswitch'
import NormalButton from '../../components/buttons/normalButton.js';
import Menu from '../../components/assets/menu-white-18dp.svg';
import Close from '../../components/assets/close-white-18dp.svg';
import {useGameCode, useLatestReaction, useEmojis} from '../../hooks/hostHooks';

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

    
    



    const changeVotingStatus = () =>{
        let status;
        db.collection("users").doc(props.adminId).get().then((doc)=>{
            status = doc.data().canVote
        })
        .then(()=>{
            db.collection("users").doc(props.adminId).update({"canVote":!status, "started":true})
            setActiveVoting(!status);
        })  
    }

    

    const logOut = () => {
        if (window.confirm("Er du sikker på at du vil logge ut?")) {
            firebaseAuth.signOut().then(() => {
                // Sign-out successful.
              }).catch((error) => {
                // An error happened.
              });

        }
    }

    useEffect(() =>{
        db.collection("users").doc(props.adminId).update({"usersCanJoin":showGameCode})
    }, [showGameCode])
    
    useEffect(()=>{
        db.collection("users").doc(props.adminId).get().then((doc)=>{
            if (doc.data()) {
                setActiveVoting(doc.data().canVote)
            }
        })

    }, [props.adminId])

    const getResults = () =>{
        
        var resultLists = {};
        for (const [user, countries] of Object.entries(props.results)){
            for (const [country, score] of Object.entries(countries)){
                if (resultLists[country]) {
                    resultLists[country] += score;
                } else {
                    resultLists[country] = score;
                }
            }
        }

        let resultJSX =[];
        var resultlist = Object.keys(resultLists).map((key)=>{
            return [key, resultLists[key]]
        })
        resultlist.sort(function(first, second) {
            return second[1] - first[1];
        });
        resultlist.forEach((cou)=>{
            var flag = "";
            if (props.flags[cou[0].toLowerCase()]) {
                flag = props.flags[cou[0].toLowerCase()];
            };
            resultJSX.push(
                <div key={cou[0]} className="result_list_row">
                    {flag.length === 14 ? <div>{String.fromCodePoint(flag.substr(0,7), flag.substr(7,14))}</div>: null}
                    <div className="result_list_name">{cou[0]}</div>
                    <div className="result_list_score">{cou[1]}</div>
                </div>
            )
        })
        setResultList(resultJSX);
        return resultLists;
       
    }
    
    const deleteGame = () =>{
        if (window.confirm("Er du sikker på at du vil slette spillet?")) {

            const usersRef = db.collection("users").doc(props.adminId).collection("users");
            usersRef.get().then((users) =>{
                users.forEach((user) =>{
                    const countriesRef = usersRef.doc(user.id).collection("countries");
                    countriesRef.get().then((countries) =>{
                        countries.forEach((country)=>{
                            countriesRef.doc(country.id).delete()
                        })
                    })
                    usersRef.doc(user.id).delete();
                }   
                )
            })
            
            try{
                let current_pin = null;
                db.collection("pin").doc("current_pin").get().then((doc)=>{
                    if(doc.exists){
                        current_pin = doc.data().current_pin
                    }
                    else{
                        console.log("no pin found");
                    }
                }).then(()=>{
                    db.collection('users').doc(props.adminId).set({ pin:current_pin, "canVote": false, "usersCanJoin": true, "started": false});
                    db.collection("pin").doc("current_pin").set({current_pin: (current_pin + Math.floor(Math.random()*100))});
                }
                )
            }
            catch{
                console.log("error")
            }
        }

    }

    useEffect(()=> {
        getResults();

    },[props.results, props.flags])

    return(
        <div>
            { activateNRKCon ? <div className="nrk_options"></div> : null}
            {topMenu ? <div className="top_menu">
                <div className="top_menu_box close_button" onClick={() => setTopMenu(false)}><img src={Close} alt="close"></img></div>
                <div className="top_menu_box"><MaterialUIswitch label={"Vis NRK"} default={props.nrk} action={props.setNrk}/></div>
                <div className="top_menu_box" ><MaterialUIswitch label={"Skjul NRKkontrollere"} default={activateNRKCon} action={setActivateNRKCon}/></div>
                <div className="top_menu_box"><MaterialUIswitch label={"Vis spillkode"} default={showGameCode} action={setShowGameCode}/></div>
                <div className="top_menu_box"><MaterialUIswitch label={"Vis brukere"} default={showUsers} action={setShowUsers}/></div>
                <div className="top_menu_box"><MaterialUIswitch label={"Tillat stemming"} default={activeVoting} action={changeVotingStatus}/></div>
                <div className="top_menu_box"><MaterialUIswitch label={"Vis resultatliste"} default={showResultList} action={setShowResultList}/></div>
                <div className="top_menu_box">
                        <Link to={'/results'}>
                            <NormalButton name="Gå til resultater"></NormalButton>
                        </Link>
                </div>
                <div className="top_menu_box">
                        <NormalButton name="Slett spill/Start nytt" action={deleteGame}></NormalButton>
                </div>
                <div className="top_menu_box">
                        <NormalButton name="Logg ut" action={logOut}></NormalButton>
                </div>
            </div> : <div className="top_menu_icon" onClick={() => setTopMenu(true)}><img src={Menu} alt="menu"></img></div>}
            <div className="host_info_container">
                    {showGameCode ? <div className="game_code_box">
                        Kode: {gameCode}
                    </div> : null}
                    {showUsers ? <div className="users_list_box"> 
                        Brukere: <br/>
                        {props.users}
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