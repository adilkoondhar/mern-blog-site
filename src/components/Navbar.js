import React from "react";
import "../css/navbar.css";
import {Link, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
const Navbar = (props) => {
    const navigate = useNavigate();
    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("profileImage");
        toast.success("Logged out successfully");
        navigate("/login");
    }

    const onClickH2 = () => {
        navigate("/");
    }

    const onClick = () => {
        navigate("/profile");
    }

    const storedUser = localStorage.getItem("user");

    const user = storedUser ? JSON.parse(storedUser).user : null;

  return (
    <nav className="Navbar">
        <h2 onClick={onClickH2}>Personal Blogging App</h2>
        <ul>
            <li>{storedUser && <p onClick={onClick}>{user.firstName}</p> }</li>
            <li>{storedUser ? <p onClick={logout}>Logout</p> : <Link className="NavBtn" to={props.red}>{props.name}</Link> }</li>
        </ul>
    </nav>
  );
}

export default Navbar;