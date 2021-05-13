import React, { useEffect, useState } from 'react';
import './resultList.css'

function ResultList(props) {

    const clickCheck = (event) => {
        if(event.target === event.currentTarget) {
            props.hide()
        }
    }

    return(
        <div className="result_list_background" onClick={(e) => clickCheck(e)}>

            <div className="result_list_container">Din foreløpige resultatliste her:</div>
        </div>
    )
}

export default ResultList