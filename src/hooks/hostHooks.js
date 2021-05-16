import {useState, useEffect} from 'react';
import {db} from '../database/config.js';
import Reaction from '../components/reaction';
import Delete from '../components/assets/delete_white_24dp.svg';


export const useGameCode = (adminId) =>{
    const [gameCode,setGameCode] = useState(false);

    useEffect(() => {
        db.collection("users").doc(adminId).get().then((doc) => {
            if (doc.data()) {
                setGameCode(doc.data().pin);
            }
        })
    }, [adminId])

    return gameCode;
};


export const useFlags = (adminId) =>{
    const [flags, setFlags] = useState();

    useEffect(() =>{
        db.collection("countries").get().then((countries)=>{
            var flagList = {}
            countries.forEach((country)=>{
                flagList[country.id] = country.data().flag;
            })
            setFlags(flagList);
        })
    }, [adminId])
    return flags;
}

const removeUser = (username, adminId) => {
    if (window.confirm("OBS: Spilleren må selv logge ut før du kan slette den. Er du sikker på at du vil forsette?")) {
        var dbref = db.collection("users").doc(adminId).collection("users").doc(username);
        dbref.collection("countries").get().then((snapshot) => {
            snapshot.forEach((doc) => {doc.ref.delete()})
        }).then(dbref.delete())
    }
}

export const useUsers = (adminId, flags) =>{
    const [users, setUsers] = useState([]);
    const [newResults, setNewResults] = useState();
    const [usernames, setUsernames] = useState([])
    useEffect(() => {

        const unsubscribe = db.collection("users").doc(adminId).collection("users").onSnapshot((snapshot) => {
            let users = [];
            let usernames = []                

            snapshot.forEach(element => {
                usernames.push(element.id)
                users.push(
                    <div className="overlay_userlist_element">
                        <div className="overlay_userlist_username">{element.id}</div>
                        <div onClick={() => removeUser(element.id, adminId)} className="overlay_userlist_delete"><img src={Delete} alt="Slett"></img></div>
                    </div>
                );
                
            })
            setUsers(users);
            setUsernames(usernames);
            setNewResults(Date.now());
        })
        return () => unsubscribe()
    }, [adminId, flags])
    return {users, usernames, newResults};
}


export const useLatestReaction = (adminId) =>{
    const [time, setTime] = useState(0);
    const [myName, setMyName] = useState("lol");

    useEffect(() => {
        const unsubscribe = db.collection("users").doc(adminId).collection("reactions").doc("reaction").onSnapshot((snapshot) => {
            if (snapshot.data()) {
                setMyName(snapshot.data().name);
                setTime(snapshot.data().time);                
            }
        });
        return () => unsubscribe()
    }, [adminId]);

    return {myName, time};
}


export const useEmojis = (time, myName) =>{
    const [emojis, setEmojis] = useState([]);
    const [oldTime, setOldTime] = useState(0);


    useEffect(() => {
        if (Date.now() - oldTime > 5000) {
            setEmojis([<Reaction key={time} name={myName} />]);
        } else {
            setEmojis([...emojis, <Reaction key={time} name={myName}/>]);
        }
        setOldTime(Date.now());
        

    },[time])
    return emojis;
}