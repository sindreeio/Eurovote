import {useState, useEffect} from 'react';
import {db} from '../database/config.js';
import Reaction from '../components/reaction';


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
                users.push(<div>{element.id}</div>);
                
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