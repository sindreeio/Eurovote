import React, { useEffect, useState }  from 'react';
import { firebaseAuth, db} from '../../database/config.js';
import {Redirect, Link} from 'react-router-dom';
import Overlay from './overlay.js';
import './hostPage.css';
import useUserId from '../../hooks/authentication';
import {useFlags, useUserResults, useUsers} from '../../hooks/hostHooks';
import Delete from '../../components/assets/delete_white_24dp.svg';


function HostPage(){
    const [doRedirectToLogin, setRedirectToLogin] = useState(false);
    const [showNRK, setShowNRK] = useState(true);
    const uid = useUserId()
    const [totalResults, setTotalResults] = useState({});
    const flags = useFlags();
    const {newUser, removedUser} = useUsers(uid);
    const [userList, setUserList] = useState([]);
    const [users, setUsers] = useState({})
    const newResult = useUserResults(uid, newUser);

    useEffect(() => {
        
    })

    useEffect(() => {

        let results = {...totalResults};

        for (var i in newResult[1]) {
            if(results[newResult[0]]) {
                results[newResult[0]][newResult[1][i][0]] = newResult[1][i][1];
            } else {
                results[newResult[0]] = {};
                results[newResult[0]][newResult[1][i][0]] = newResult[1][i][1];
            }
        }
        removedUser.forEach((user) => {
            if(results[user]) {
                results[user] = {};
            }
        });

        setTotalResults(results);
    }, [newResult, removedUser])

    const removeUser = (username, adminId) => {
        if (window.confirm("OBS: Spilleren må selv logge ut før du kan slette den. Er du sikker på at du vil forsette?")) {
            var dbref = db.collection("users").doc(adminId).collection("users").doc(username);
            dbref.collection("countries").get().then((snapshot) => {
                snapshot.forEach((doc) => {doc.ref.delete()})
            }).then(dbref.delete())
        }
    }

    useEffect(() => {
        let existingUsers = users;
        newUser.forEach((user) => {existingUsers[user] = user})
        removedUser.forEach((user) => {delete existingUsers[user]})
        setUsers(existingUsers);
        let newUserList = [];
        Object.values(existingUsers).forEach( (user) => {
            newUserList.push(
                <div className="overlay_userlist_element">
                    <div className="overlay_userlist_username">{user}</div>
                    <div onClick={() => removeUser(user, uid)} className="overlay_userlist_delete"><img src={Delete} alt="Slett"></img></div>
                </div>
            );
        })
        setUserList(newUserList);
        
    }, [newUser, removedUser])


    return(
        <div className="host_content">
            {uid === "null" ? <Redirect to="/"/> : null}
            {showNRK ? <div className="iframe_container">
                <iframe src="https://www.nrk.no/embed/PS*NRK1?autoplay=true" title="NRK" className="iframe" scrolling="yes"></iframe>
            </div> : null}
            <Overlay setNrk={setShowNRK} nrk={showNRK} adminId={uid} flags={flags} results={totalResults} users={userList}/>
        </div>
    )
}


export default HostPage;