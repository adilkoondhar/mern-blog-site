import React, {useState} from "react";
import {Navigate, useNavigate} from "react-router-dom";
import { toast } from "react-toastify";
import "./css/signup.css";
import Navbar from "./components/Navbar.js";
import Navheader from "./components/Navheader.js";
import axios from "axios";
const Signup = () => {

    const [loadingCircle, setLoadingCircle] = useState(false);

    const [userData, setUserData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        repPass: ""
    });

    const { firstName, lastName, email, password, repPass } = userData;

    const navigate = useNavigate();

    const onChange = e => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    }

    const onSubmit = e => {
        e.preventDefault();
        if (password !== repPass) {
            toast.error("Passwords do not match");
        }
        else {
            setLoadingCircle(true);
            axios.post(process.env.REACT_APP_BACKEND_API + "/user", {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password
            })
                .then(res => {
                    localStorage.setItem("user", JSON.stringify(res.data));
                    navigate("/");
                })
                .catch(err => {
                    alert("Signup failed");
                }).finally(() => {
                setLoadingCircle(false);
                setUserData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    password: "",
                    repPass: ""
                });
                });
        }
    }

    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
    return (
        <>
            <Navbar name={"Login"} red={"/login"}/>
            <Navheader name={"Signup"} />
            <form className="signupForm" onSubmit={onSubmit}>
                <input
                    name="firstName"
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={onChange}
                    maxLength={20}
                    required
                />
                <input
                    name="lastName"
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={onChange}
                    maxLength={20}
                    required
                />
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={onChange}
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={onChange}
                    required
                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                    title="Minimum 8 characters, one uppercase and lowercase letter, and a number"
                />
                <input
                    name="repPass"
                    type="password"
                    placeholder="Repeat Password"
                    value={repPass}
                    onChange={onChange}
                />
                <button className="signupBtn" type="submit">{ loadingCircle ? <div className="loading-circle"></div> : <>Signup</> }</button>
            </form>
        </>
    ); } else {
        return (
            <Navigate to={'/'} />
        );
    }
};

export default Signup;
