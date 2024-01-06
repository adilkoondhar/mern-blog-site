import React from "react";
import "../css/navheader.css";
import {useNavigate} from "react-router-dom";

const Navheader = (props) => {
    const navigate = useNavigate();
    const onclick = () => {
        navigate('/');
    }
    return (
        <div className="NavHeader">
            { !props.back ? <h1 className="navH1">{props.name}</h1> : <h1 className="goBack" onClick={onclick}>&lt; Go back</h1> }
        </div>
    );
}

export default Navheader;