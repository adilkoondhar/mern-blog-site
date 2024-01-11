import React, {useState} from "react";
import axios from "axios";
import "./css/profile.css";
import Navbar from "./components/Navbar.js";
import Navheader from "./components/Navheader.js";
import img1 from "./images/img1.png";
import {Navigate} from "react-router-dom";
import penFill from "./icons/pen-fill.svg";
import penFill0 from "./icons/pen-fill0.svg";


const Profile = () => {

    const [loadingCircle, setLoadingCircle] = useState(false);

    // const [refreshImage, setRefreshImage] = useState(true);

    const localUser = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")).user
        : {
            firstName: "",
            lastName: "",
            email: "",
            image: ""
        };

    const { firstName: firstNames, lastName: lastNames, email, image } = localUser;

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
                    alert("Password updated");
                })
                .catch(err => {
                    alert("Password not updated");
                }).finally(() => {
                setLoadingCircle(false);
                setUserData(prevState => {
                    return {
                    ...prevState,
                    oldPassword: "",
                    newPassword: "",
                    repPassword: ""
                    }
                });
            });
        }
    }

    const uploadImage = (e) => {
        const formData = new FormData();
        formData.append("file", e.target.files[0]);
        formData.append("upload_preset", process.env.REACT_APP_UPLOAD_PRESET);

        axios.post(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload`, formData).then((res) => {
            const token = JSON.parse(localStorage.getItem("user")).token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            // pass image and user email via axios

            axios.post(process.env.REACT_APP_BACKEND_API + "/user/image", {
                image: res.data.url,
                email: email
            }, config)
                .then(res => {
                    refreshImage();
                });
        });


    }

    const [profileImage, setProfileImage] = useState(image);

    const refreshImage = async () => {
        await axios.get(process.env.REACT_APP_BACKEND_API + `/user/${email}`)
            .then(res => {
                setProfileImage(res.data.image);
            });
    }

    refreshImage();

    const onClick2 = () => {
        document.getElementById("imageInput").click();
    }

    const storedUser = localStorage.getItem("user");

    if (storedUser) {
        return (
            <>
                <Navbar name={"Logout"} red={"/logout"}/>
                <Navheader name={"Profile"}/>
                <div className="profileDiv">
                    <div className="imageDiv">
                        <img className="profileImg" src={profileImage} alt="Upload your image"/>
                        <img className="profileEditIcon profileIcon" src={penFill0} onClick={onClick2}/>
                        <input id="imageInput" type="file" onChange={uploadImage} style={{display: 'none'}}/>
                    </div>
                    <br/>
                    <div className="profileHeader">
                        {check ? <h4>{firstName} {lastName}</h4> : <>
                            <input style={{width: `${firstName.length * 18}px`}} className="h4ProfileInput" type="text" onChange={onChange} name="firstName" disabled={check}
                                   value={firstName}/>
                            <input style={{width: `${lastName.length * 17}px`}} className="h4ProfileInput" type="text" onChange={onChange} name="lastName" disabled={check}
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