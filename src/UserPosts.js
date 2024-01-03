import React, {useState} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./css/dashboard.css";
import Navbar from "./components/Navbar.js";
import Navheader from "./components/Navheader.js";
import Blog from "./components/Blog.js";

const UserPosts = () => {
    const { user } = useParams();
    const mail = user.replace("%40", "@");
    console.log(mail);

    const [back, setBack] = useState(true);
    const [blogs, setBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [author, setAuthor] = useState("");

    if (isLoading) {
    axios.get(process.env.REACT_APP_BACKEND_API + `/user/posts/${mail}`)
        .then(res => {
            setBlogs(res.data);
            setIsLoading(false);
            setAuthor(res.data[0].user);
        })
        .catch(err => {
            console.log(err);
            setIsLoading(false); // Handle error state
        });
    }

    return (
        <>
            <Navbar name={"Login"} red={"/login"}/>
            <Navheader name={"Dashboard"} back={back} />
            {!isLoading && <h3 className="dashboardH3">{author}'s blogs</h3>}

            {blogs.map((blog, index) => {
                return (
                    <Blog key={index} back={back} title={blog.title} writer={blog.user} content={blog.content} date={blog.date} email={blog.email}/>
                );
            })}
        </>
    );
}

export default UserPosts;