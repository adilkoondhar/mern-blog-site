import React, {useState} from "react";
import axios from "axios";
import "./css/login.css";
import Navbar from "./components/Navbar.js";
import Navheader from "./components/Navheader.js";
import { useNavigate } from "react-router-dom";

const Login = () => {

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
            });
    }

    return (
        <>
            <Navbar name={"Signup"} red={"/signup"}/>
            <Navheader name={"Login"}/>
            <form className="loginForm" onSubmit={onSubmit}>
                <input name="email" type="email" placeholder="Enter your email" value={email} onChange={onChange}/>
                <input name="password" type="password" placeholder="Enter your password" value={password} onChange={onChange}/>
                <button>Login</button>
            </form>
        </>
    );
}

export default Login;