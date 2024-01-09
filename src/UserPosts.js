import React, {useState} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./css/dashboard.css";
import Navbar from "./components/Navbar.js";
import Navheader from "./components/Navheader.js";
import Blog from "./components/Blog.js";
import img1 from "./images/img1.png";
import "./css/userPosts.css";

const UserPosts = () => {
    const { user } = useParams();
    const mail = user.replace("%40", "@");
    console.log(mail);

    const [blogs, setBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [author, setAuthor] = useState("");
    const [userImage, setUserImage] = useState("");
    const [once, setOnce] = useState(true);

    const loadAll = async () => {
        await axios.get(process.env.REACT_APP_BACKEND_API + `/user/posts/${mail}`)
            .then(res => {
                res.data.map(async (blog, index) => {
                    console.log(blog.email);
                    await axios.get(process.env.REACT_APP_BACKEND_API + `/user/${blog.email}`).then(res => {
                        console.log(res.data.image);
                        setBlogs(blogs => [...blogs, {...blog, image: res.data.image}])
                        if (once) {
                            setUserImage(res.data.image);
                            setOnce(false);
                        }
                    }).catch(err => {
                        console.log(err);
                    });
                });
                setAuthor(res.data[0].user);
            })
            .catch(err => {
                console.log(err);
            });
    }

    if (isLoading) {
        setBlogs([]);
        loadAll();
        setIsLoading(false);
    }

    return (
        <>
            <Navbar name={"Login"} red={"/login"}/>
            <Navheader name={"Dashboard"} back={true}/>
            {!isLoading && <h3 className="dashboardH3">All from {author}</h3>}

            <div className="authorDetails">
                <a href="mailto:{mail}">{mail}</a>
                <h1>{author}</h1>
                {!isLoading && <img src={userImage} alt="img1"/>}
            </div>

            {blogs.map((blog, index) => {
                return (
                    <Blog key={index} back={true} title={blog.title} writer={blog.user} content={blog.content}
                          date={blog.date.substring(0, 10)} email={blog.email} pic={blog.image}/>
                );
            })}
        </>
    );
}

export default UserPosts;