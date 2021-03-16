import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { firebaseAuth, db } from '../../database/config';
import Countryvoter from './CountryVoter';
import Countrylist from './CountryList';
import{Swiper, SwiperSlide} from 'swiper/react'
import SwiperCore, {Pagination, Virtual} from 'swiper';
import '../landingPage/landingPage.css';
import './voting.css';
import 'swiper/swiper.scss';
import 'swiper/components/pagination/pagination.scss';
SwiperCore.use([Pagination, Virtual]);

function VotingPage(prop){
    const [myCountries, setCountries] = useState([]);
    const [countryIds, setCountryIds] = useState([])
    let {username, adminId} = useParams()

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
    return(
        <div>
            {myCountries ? <Countrylist countries={myCountries} countryIds={countryIds} adminId={adminId} username={username}/>: null}
        </div>
    )
}




export default VotingPage;
