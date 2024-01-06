import React, {useState} from "react";
import axios from "axios";
import "./css/login.css";
import Navbar from "./components/Navbar.js";
import Navheader from "./components/Navheader.js";
import {Navigate, useNavigate} from "react-router-dom";

const Login = () => {

    const [loadingCircle, setLoadingCircle] = useState(false);

    const navigate = useNavigate();

    const [userData, setUserData] = useState({
        email: "",
        password: ""
    });

    const { email, password } = userData;

    const onChange = e => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    }

    const onSubmit = e => {
        e.preventDefault();
        setLoadingCircle(true);
        axios.post(process.env.REACT_APP_BACKEND_API + "/login", {
            email: email,
            password: password
        })
            .then(res => {
                console.log(res.data);
                localStorage.setItem("user", JSON.stringify(res.data));
                navigate("/");
            })
            .catch(err => {
                console.log(err);
                alert("Login failed");
            }).finally(() => {
            setLoadingCircle(false);
            setUserData({
                email: "",
                password: ""
            });
        });
    }

    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
    return (
        <>
            <Navbar name={"Signup"} red={"/signup"}/>
            <Navheader name={"Login"}/>
            <form className="loginForm" onSubmit={onSubmit}>
                <input name="email" type="email" placeholder="Email" value={email} onChange={onChange}/>
                <input name="password" type="password" placeholder="Password" value={password} onChange={onChange}/>
                <button className="loginBtn">{ loadingCircle ? <div className="loading-circle"></div> : <>Login</> }</button>
            </form>
        </>
    ); } else {
        return (
            <Navigate to={'/'} />
        );
    }
}

export default Login;