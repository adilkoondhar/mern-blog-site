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
            { !props.back ? <h3>{props.name}</h3> : <h3 className="goBack" onClick={onclick}>Go back</h3> }
        </div>
    );
}

export default Navheader;