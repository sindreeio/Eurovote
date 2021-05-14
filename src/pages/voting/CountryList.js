import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { firebaseAuth, db } from '../../database/config';
import Countryvoter from './CountryVoter';
import{Swiper, SwiperSlide} from 'swiper/react'
import SwiperCore, {Pagination, Virtual, Navigation} from 'swiper';
import '../landingPage/landingPage.css';
import './voting.css';
import ResultList from './ResultList';
import Result from '../../components/assets/format_list_numbered_rtl_white_24dp.svg'
import 'swiper/swiper.scss';
import 'swiper/components/pagination/pagination.scss';
import 'swiper/components/navigation/navigation.scss';
SwiperCore.use([Pagination, Virtual, Navigation]);

function CountryList(props) {
    const [score, setScore] = useState(0);
    const [countries, setCountries] = useState([]);
    const [countryIds, setCountryIds] = useState([]);
    const [index,setIndex] = useState(0)
    const [showResults, setShowResults] = useState(false);
    const [mySwiper, setMySwiper] = useState(null);

    const changeSwiperSlide = (index) => {
        mySwiper.slideTo(index);
    }

    useEffect(() =>{
        setCountries(props.countries)
        setCountryIds(props.countryIds)
        console.log(props.countryIds)
    }, [props.countries, props.countryIds])
    
    let countrylist = []
    if (countries.length !== 0){
        countrylist = props.countries.map((country, index) => (
            <SwiperSlide key={country} virtualIndex={index}>
                <div className="header"> {String.fromCharCode(country.flag[0],country.flag[1],country.flag[2],country.flag[3])} {country.name}</div>
            </SwiperSlide>
        ));
        
    }
    const sendReaction = (name) => {
        db.collection("users").doc(props.adminId).collection("reactions").doc("reaction").set({"name": name, "time": Date.now()});
    }
    
    return(
        <div>
            {showResults ? <ResultList hide={() => setShowResults(false)} countries={countries} adminId={props.adminId} username={props.username} index={setIndex} changeIndex={changeSwiperSlide}/> : null}
            <div className="votingDiv">
            {countrylist.length ?
                <Swiper
                    onInit = {(s) => setMySwiper(s)}
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
            <div className="vote_bottom_bar">
                <div className="list_icon" onClick={() => setShowResults(!showResults)}><img className="list_icon_img" src={Result} alt="Res"></img></div>
                <div className="total_score" >Totalt: {score}</div>
                <div className="reaction_bar">
                    <div className="reaction" onClick={() => sendReaction("heart")}>❤️</div>
                    <div className="reaction" onClick={() => sendReaction("lol")}>😂</div>
                    <div className="reaction" onClick={() => sendReaction("party")}>🥳</div>
                    <div className="reaction" onClick={() => sendReaction("vomit")}>🤮</div>
                </div>
            </div>
            </div>
        </div>
    )
}


export default CountryList;