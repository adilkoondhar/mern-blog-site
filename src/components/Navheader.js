import React from "react";
import "../css/navheader.css";
const Navheader = (props) => {
    const onclick = () => {
        props.refresh();
    }
    return (
        <div className="NavHeader">
            { !props.back ? <h3>{props.name}</h3> : <h3 className="goBack" onClick={onclick}>Go back</h3> }
        </div>
    );
}

export default Navheader;