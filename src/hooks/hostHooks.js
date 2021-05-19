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


export const useFlags = () =>{
    const [flags, setFlags] = useState({});
    useEffect(() =>{
        db.collection("countries").get().then((countries)=>{
            var flagList = {}
            countries.forEach((country)=>{
                flagList[country.id] = country.data().flag;
            })
            console.log("FLAGS")
            setFlags(flagList);
        })
    }, [])
    return flags;
}


export const useUsers = (adminId) =>{
    const [newUser, setNewUser] = useState([]);
    const [removedUser, setRemovedUser] = useState([]);
    useEffect(() => {
        
        const unsubscribe = db.collection("users").doc(adminId).collection("users").onSnapshot((snapshot) => {
            let newUser = [];     
            let removedUser = [];       
            snapshot.docChanges().forEach((c) => {
                console.log("USEUSERS")
                if (c.type === "added" ){ 
                    newUser.push(c.doc.id)
                }
                else if (c.type === "removed"){
                    removedUser.push(c.doc.id)
                }
            })
            setRemovedUser(removedUser)
            setNewUser(newUser);
        })
        return () => {console.log("UNSUB"); unsubscribe()}
    }, [adminId])
    return {newUser, removedUser};
}

export const useUserResults = (adminId, username) => {
    const [newResults, setNewResults] = useState([]);
    useEffect(() => {
        username.forEach((user) => {
            const unsubscribe = db.collection("users").doc(adminId).collection("users").doc(user).collection("countries").onSnapshot((snapshot) => {
                let userResults = [user];
                let results = []
                snapshot.docChanges().forEach((change) => {
                    let newResult = []
                    if(change.doc.data() !== null) {
                        let data = change.doc.data(); 
                        newResult.push(change.doc.id);
                        newResult.push(data.factor + data.costume + data.show + data.performance +data.song);
                        results.push(newResult);
                    }
                    //results[user][change.doc.id] = change.doc.data().total
                })
                userResults.push(results)
                setNewResults(userResults);
                
            })
            return () => {console.log("UNSUB"); unsubscribe()}
        })
    }, [username, adminId])
    return newResults;
}

export const useLatestReaction = (adminId) =>{
    const [time, setTime] = useState(0);
    const [myName, setMyName] = useState("lol");

    useEffect(() => {
        
        const unsubscribe = db.collection("users").doc(adminId).collection("reactions").doc("reaction").onSnapshot((snapshot) => {
            if (snapshot.data()) {
                console.log("REACTION")
                setMyName(snapshot.data().name);
                setTime(snapshot.data().time);                
            }
        });
        return () => {console.log("UNSUB"); unsubscribe()}
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