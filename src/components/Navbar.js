import React from "react";
import "../css/navbar.css";
import {Link, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
const Navbar = (props) => {
    const navigate = useNavigate();
    const logout = () => {
        localStorage.removeItem("user");
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
        {storedUser && <p className="prof" onClick={onClick}>{user.firstName}</p> }
        {storedUser ? <p className="btn" onClick={logout}>Logout</p> : <Link className="btn" to={props.red}>{props.name}</Link> }
    </nav>
  );
}

export default Navbar;