import {useState, useEffect} from 'react';
import {firebaseAuth} from '../database/config.js';


const useUserId = () =>{
    const [uid, setUid] = useState();
    useEffect(()=>{
        firebaseAuth.onAuthStateChanged((user)=>{
            if (user){
                setUid(user.uid);
            }
            else{
                setUid("null");
            }
            
        })
    })

    return uid;
}

export default useUserId;