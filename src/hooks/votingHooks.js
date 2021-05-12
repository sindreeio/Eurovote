import { useEffect, useState } from 'react';
import { db } from '../database/config';


const useCountries= () =>{
    const [myCountries, setCountries] = useState([]);
    const [countryIds, setCountryIds] = useState([]);


    useEffect(()=>{
        db.collection("countries").orderBy("turn").get().then((countries)=>{
            var countryIdList =[]
            var countrylist = []
            countries.forEach((country) =>{
                console.log(country.id)
                countrylist.push(country.data());
                countryIdList.push(country.id)
            });
            setCountries(countrylist);
            setCountryIds(countryIdList)
        })

    },[])
    return {myCountries, countryIds};
}

export default useCountries;