import React, {useState} from "react";
import axios from "axios";
import "./css/profile.css";
import Navbar from "./components/Navbar.js";
import Navheader from "./components/Navheader.js";
import image from "./images/img1.png";
import {Navigate} from "react-router-dom";
import penFill from "./icons/pen-fill.svg";
import penFill0 from "./icons/pen-fill0.svg";


const Profile = () => {

    const [loadingCircle, setLoadingCircle] = useState(false);

    const localUser = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")).user
        : {
            firstName: "",
            lastName: "",
            email: "",
            image: ""
        };

    // const [user, setUser] = useState({
    //     firstName: "John",
    //     lastName: "Doe",
    //     email: "name@name.com",
    //     password: "",
    //     img: "abc"
    // });

    const { firstName: firstNames, lastName: lastNames, email } = localUser;

    const [check, setCheck] = useState(true)
    const onClick = () => {
        setCheck(!check);
    };

    const [userData, setUserData] = useState({
        firstName: firstNames,
        lastName: lastNames,
        oldPassword: "",
        newPassword: "",
        repPassword: ""
    });

    const { oldPassword, newPassword, repPassword, firstName, lastName } = userData;

    const onChange = e => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    }

    const onSubmit = e => {
        e.preventDefault();
        if (newPassword !== repPassword) {
            alert("Passwords do not match");
            return;
        }
        else {
            setLoadingCircle(true);
            const token = JSON.parse(localStorage.getItem("user")).token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            axios.post(process.env.REACT_APP_BACKEND_API + "/user/update", {
                oldPassword: oldPassword,
                password: newPassword,
                firstName: firstName,
                lastName: lastName,
            }, config)
                .then(res => {
                    console.log(res.data);
                    alert("Password updated");
                })
                .catch(err => {
                    console.log(err);
                    alert("Password not updated");
                }).finally(() => {
                setLoadingCircle(false);
                setUserData({
                    oldPassword: "",
                    newPassword: "",
                    repPassword: ""
                });
            });
        }
    }

    const storedUser = localStorage.getItem("user");

    if (storedUser) {
        return (
            <>
                <Navbar name={"Logout"} red={"/logout"}/>
                <Navheader name={"Profile"}/>
                <div className="profileDiv">
                    <div className="imageDiv">
                    <img className="profileImg" src={image} alt="imageOne"/>
                    <img className="profileEditIcon profileIcon" src={penFill0}/>
                    </div>
                    <br/>
                    <div className="profileHeader">
                        {check ? <h4>{firstName} {lastName}</h4> : <>
                            <input className="h4Input" type="text" onChange={onChange} name="firstName" disabled={check}
                                   value={firstName}/>
                            <input className="h4Input" type="text" onChange={onChange} name="lastName" disabled={check}
                                   value={lastName}/>
                        </>}
                        <img className="profileEditIcon" onClick={onClick} src={penFill}/>
                    </div>
                    <h4>Password</h4>
                    <form className="profileForm" onSubmit={onSubmit}>
                        <input name="oldPassword" className="Input" type="password"
                               placeholder="Old password" onChange={onChange} value={oldPassword}/>
                        <input name="newPassword" className="Input" type="password"
                               placeholder="New password" onChange={onChange} value={newPassword}
                               pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                               title="Minimum 8 characters, one uppercase and lowercase letter, and a number"
                        />
                        <input name="repPassword" className="Input" type="password" placeholder="Repeat password"
                               onChange={onChange} value={repPassword}/>
                        <button className="profileBtn">{loadingCircle ?
                            <div className="loading-circle"></div> : <>Update password</>}</button>
                    </form>
                </div>
            </>
        );
    } else {
        return (
            <Navigate to={"/login"}/>
        )
    }
}

export default Profile;