import React, {useState} from "react";
import axios from "axios";
import "./css/dashboard.css";
import Navbar from "./components/Navbar.js";
import Navheader from "./components/Navheader.js";
import Blog from "./components/Blog.js";
const Dashboard = () => {

    const storedUser = localStorage.getItem("user");

    const [blogs, setBlogs] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    const [specificUser, setSpecificUser] = useState(false);

    const [tempUser, setTempUser] = useState("");

    const [back, setBack] = useState(false);

    function aUser(user) {
        setSpecificUser(true);
        setTempUser(user);
        setIsLoading(true);
        setBack(true);
        setBlogs([]);
    }

    function refreshPage() {
        setIsLoading(true);
        setBlogs([]);
        setBack(false);
    }

        if (isLoading) {
            if (storedUser) {
                const token = JSON.parse(localStorage.getItem("user")).token;
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                axios.get(process.env.REACT_APP_BACKEND_API + "/user/posts", config)
                    .then(res => {
                        setBlogs(res.data);
                        setIsLoading(false);
                        setBack(false);
                    })
                    .catch(err => {
                        console.log(err);
                        setIsLoading(false); // Handle error state
                    });
            } else if (specificUser) {
                axios.get(process.env.REACT_APP_BACKEND_API + `/user/posts/${tempUser}`)
                    .then(res => {
                        setBlogs(res.data);
                        setIsLoading(false);
                        setSpecificUser(false);
                        setBack(true);
                    })
                    .catch(err => {
                        console.log(err);
                        setIsLoading(false); // Handle error state
                    });
            }
            else {
                axios.get(process.env.REACT_APP_BACKEND_API + "/posts")
                    .then(res => {
                        setBlogs(res.data);
                        setIsLoading(false);
                        setBack(false);
                        setSpecificUser(false);
                    })
                    .catch(err => {
                        console.log(err);
                        setIsLoading(false); // Handle error state
                    });
            }
        }


    const [blogData, setBlogData] = useState({
        title: "",
        content: ""
    });

    const { title, content } = blogData;

    const onChange = e => {
        setBlogData({ ...blogData, [e.target.name]: e.target.value });
    }

    const onSubmit = e => {
        e.preventDefault();
        const token = JSON.parse(localStorage.getItem("user")).token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        axios.post(process.env.REACT_APP_BACKEND_API + "/post", {
            title: title,
            content: content
        }, config)
            .then(res => {
                console.log(res.data);
                setIsLoading(true);
            })
            .catch(err => {
                console.log(err);
                alert("Blog not published");
            });

    }

    return (
        <>
            <Navbar name={"Login"} red={"/login"}/>
            <Navheader name={"Dashboard"} back={back} refresh={refreshPage}/>
            {storedUser && <>
            <form className="dashboardForm" onSubmit={onSubmit}>
                <input name="title" className="Input" type="text" placeholder="Enter your name" onChange={onChange}/>
                <textarea name="content" placeholder="Take a note..." rows={5} onChange={onChange}/>
                <button>Publish blog</button>
            </form> </>}
            <h3 className="dashboardH3">My Blogs</h3>

            {blogs.map((blog, index) => {
                return (
                    <Blog key={index} back={back} onlyUser={aUser} title={blog.title} writer={blog.user} content={blog.content} date={blog.date} email={blog.email} refresh={refreshPage}/>
                );
            })}
        </>
    );
}

export default Dashboard;