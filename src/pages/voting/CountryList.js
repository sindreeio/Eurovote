import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { firebaseAuth, db } from '../../database/config';
import Countryvoter from './CountryVoter';



function CountryList(prop){
    const [countries, setCountries] = useState([]);
    const [index, setIndex] = useState(2);
    let {username, adminId} = useParams()

    useEffect(()=>{
        db.collection("countries").orderBy("turn").get().then((countries)=>{
            var countryIdList =[]
            countries.forEach((country) =>{
                countryIdList.push(country.id);
            });
            setCountries(countryIdList);
        })
        console.log(username);
        console.log(adminId);
    },[])

    return(
        <div>
            <Countryvoter username={username} countryId={countries[index]}/>
        </div>
    )
}


export default CountryList;
