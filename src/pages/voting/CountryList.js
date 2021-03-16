import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { firebaseAuth, db } from '../../database/config';
import Countryvoter from './CountryVoter';
import{Swiper, SwiperSlide} from 'swiper/react'
import SwiperCore, {Pagination, Virtual, Navigation} from 'swiper';
import '../landingPage/landingPage.css';
import './voting.css';

import 'swiper/swiper.scss';
import 'swiper/components/pagination/pagination.scss';
import 'swiper/components/navigation/navigation.scss';
SwiperCore.use([Pagination, Virtual, Navigation]);

function CountryList(props) {
    const [score, setScore] = useState(0);
    const [countries, setCountries] = useState([]);
    const [countryIds, setCountryIds] = useState([]);
    const [index,setIndex] = useState(0)

    useEffect(() =>{
        setCountries(props.countries)
        setCountryIds(props.countryIds)
        console.log(props.countryIds)
    }, [props.countries, props.countryIds])
    
    let countrylist = []
    if (countries){
        countrylist = props.countries.map((country, index) => (
            <SwiperSlide key={country} virtualIndex={index}>
                <div className="header"> {String.fromCharCode(country.flag[0],country.flag[1],country.flag[2],country.flag[3])} {country.name}</div>
            </SwiperSlide>
        ));
        
    }

    
    return(
        <div className="votingDiv">
         {countrylist.length ?
            <Swiper
                slidesPerView={1}
                pagination = {{dynamicBullets: true}}
                virtual
                onSlideChange={(e) => setIndex(e.activeIndex)}
                navigation
            >
                {countrylist}
            </Swiper>    
            :
            null
        }
        <div className="votingcontainer">
            <Countryvoter countryId={countryIds[index]} adminId={props.adminId} username={props.username} score={setScore}/>
        </div>   
        <div className="bottom_bar">
            <div className="total_score">Totalt: {score}</div>
            <div className="reaction_bar">
                <div className="reaction">❤️</div>
                <div className="reaction">😂</div>
                <div className="reaction">🥳</div>
            </div>
        </div>
        </div>
    )
}


export default CountryList;