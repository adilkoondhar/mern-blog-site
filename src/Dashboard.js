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

    const [back, setBack] = useState(false);

    const [loadingCircle, setLoadingCircle] = useState(false);


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
            } else {
                axios.get(process.env.REACT_APP_BACKEND_API + "/posts")
                    .then(res => {
                        setBlogs(res.data);
                        setIsLoading(false);
                        setBack(false);
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

        if (title === "" || content === "") {
            alert("Please fill all the fields");
            return;
        }

        setLoadingCircle(true);

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
            }).finally(() => {
            setLoadingCircle(false);
            setBlogData({
                title: "",
                content: ""
            });
        });

    }

    return (
        <>
            <Navbar name={"Login"} red={"/login"}/>
            <Navheader name={"Dashboard"} back={back} refresh={refreshPage}/>
            {storedUser && <>
                <form className="dashboardForm" onSubmit={onSubmit}>
                    <input name="title" className="Input" type="text" placeholder="Title"
                           value={title} onChange={onChange}/>
                    <textarea name="content" placeholder="Take a note..." rows={5} value={content} onChange={onChange}/>
                    <button className="dashboardBtn"> { loadingCircle ? <div className="loading-circle"></div> : <>Publish blog</>}</button>
                </form>
            </>}
            <h3 className="dashboardH3">My Blogs</h3>

            {blogs.map((blog, index) => {
                return (
                    <Blog key={index} back={back} title={blog.title} writer={blog.user} content={blog.content} date={blog.date.substring(0, 10)} email={blog.email} refresh={refreshPage}/>
                );
            })}
        </>
    );
}

export default Dashboard;