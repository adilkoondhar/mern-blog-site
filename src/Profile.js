import React, {useState} from "react";
import axios from "axios";
import "./css/profile.css";
import Navbar from "./components/Navbar.js";
import Navheader from "./components/Navheader.js";
import image from "./images/img1.png";
import {Navigate} from "react-router-dom";


const Profile = () => {

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
        }
        else {
            const token = JSON.parse(localStorage.getItem("user")).token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            axios.post("http://localhost:3000/api/user/update", {
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
                    <img className="blogImg" src={image} alt="imageOne"/>
                    <br/>
                    <div className="profileHeader">
                        <input className="h4Input" type="text" onChange={onChange} name="firstName" disabled={check} value={firstName}/>
                        <input className="h4Input" type="text" onChange={onChange} name="lastName" disabled={check} value={lastName}/>
                        <p onClick={onClick}>Edit</p>
                    </div>
                    <h4>Password</h4>
                    <form className="profileForm" onSubmit={onSubmit}>
                        <input name="oldPassword" className="Input" type="password"
                               placeholder="Enter your old password" onChange={onChange} value={oldPassword}/>
                        <input name="newPassword" className="Input" type="password"
                               placeholder="Enter your new password" onChange={onChange} value={newPassword}/>
                        <input name="repPassword" className="Input" type="password" placeholder="Repeat password"
                               onChange={onChange} value={repPassword}/>
                        <button>Update password</button>
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