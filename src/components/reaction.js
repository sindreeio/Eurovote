import React, { useEffect, useState } from 'react';
import './reaction.css';

function Reaction(props) {
    const [emoji, setEmoji] = useState("🥳");

    const test = (Math.random() * 90).toString() + "vw";
    useEffect(() => {
        switch (props.name) {
        case "heart":
            setEmoji("❤️");
            break;
        case "lol":
            setEmoji("😂");
            break;
        case "party":
            setEmoji("🥳");
            break;
        case "vomit":
            setEmoji("🤮");
            break;
        default:
            break;
       } 
    }, [props.name])
    return(
        <div style={{marginLeft: test}} className="reaction_animation fadeOutUp">{emoji}</div>
    )
}

export default Reaction;