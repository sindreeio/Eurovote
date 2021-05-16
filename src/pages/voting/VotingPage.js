import React, { useEffect, useState } from 'react';
import { useParams, Redirect } from 'react-router-dom';
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
    
    const {myCountries, countryIds} = useCountries();
    let username = localStorage.getItem('eurovote_username');
    let adminId = localStorage.getItem('eurovote_uid');
    
    return(
        <div style={{height: "100vh"}}>
            {username == null ? <Redirect to={`/`}/> : null}
            {(username && myCountries) ? <Countrylist countries={myCountries} countryIds={countryIds} adminId={adminId} username={username}/>: null}
        </div>
    )
}




export default VotingPage;
