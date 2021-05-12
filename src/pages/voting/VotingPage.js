import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../database/config';
import Countrylist from './CountryList';
import SwiperCore, {Pagination, Virtual} from 'swiper';
import '../landingPage/landingPage.css';
import useCountries from '../../hooks/votingHooks';
import './voting.css';
import 'swiper/swiper.scss';
import 'swiper/components/pagination/pagination.scss';
SwiperCore.use([Pagination, Virtual]);

function VotingPage(prop){
    // const [myCountries, setCountries] = useState([]);
    // const [countryIds, setCountryIds] = useState([])
    const {myCountries, countryIds} = useCountries();
    let {username, adminId} = useParams()

    // useEffect(()=>{
    //     db.collection("countries").orderBy("turn").get().then((countries)=>{
    //         var countryIdList =[]
    //         var countrylist = []
    //         countries.forEach((country) =>{
    //             console.log(country.id)
    //             countrylist.push(country.data());
    //             countryIdList.push(country.id)
    //         });
    //         setCountries(countrylist);
    //         setCountryIds(countryIdList)
    //     })

    // },[])
    return(
        <div style={{height: "100vh"}}>
            {myCountries ? <Countrylist countries={myCountries} countryIds={countryIds} adminId={adminId} username={username}/>: null}
        </div>
    )
}




export default VotingPage;
