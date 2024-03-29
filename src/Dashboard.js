import React, {useState} from "react";
import axios from "axios";
import "./css/dashboard.css";
import Navbar from "./components/Navbar.js";
import Navheader from "./components/Navheader.js";
import Blog from "./components/Blog.js";
import img1 from "./images/img1.png";
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

    const loadAll = async () => {
        if (storedUser) {
            const token = JSON.parse(localStorage.getItem("user")).token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            setBlogs([]);
            await axios.get(process.env.REACT_APP_BACKEND_API + "/user/posts", config)
                .then(res => {
                    res.data.map(async (blog, index) => {
                        await axios.get(process.env.REACT_APP_BACKEND_API + `/user/${blog.email}`).then(res => {
                            setBlogs(blogs => [...blogs, {...blog, image: res.data.image}])
                        });
                    });
                    setBack(false);
                });
        } else {
            setBlogs([]);
            await axios.get(process.env.REACT_APP_BACKEND_API + "/posts")
                .then(res => {
                    res.data.map(async (blog, index) => {
                        await axios.get(process.env.REACT_APP_BACKEND_API + `/user/${blog.email}`).then(res => {
                            setBlogs(blogs => [...blogs, {...blog, image: res.data.image}])
                        });
                    });
                    // setBlogs(blogsWithImages);
                    setBack(false);
                });
        }
    }

    if (isLoading) {
        setBlogs([]);
        loadAll();
        setIsLoading(false);
    }

    const [blogData, setBlogData] = useState({
        title: "",
        content: ""
    });

    const {title, content} = blogData;

    const onChange = e => {
        setBlogData({...blogData, [e.target.name]: e.target.value});
    }

    const onSubmit = async e => {
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

        await axios.post(process.env.REACT_APP_BACKEND_API + "/post", {
            title: title,
            content: content
        }, config)
            .catch(err => {
                alert("Blog not published");
            }).finally(() => {
            setLoadingCircle(false);
            setBlogData({
                title: "",
                content: ""
            });
            refreshPage();
        });

    }

    const now = new Date();
    const currentHour = now.getHours();

    let greeting;

    if (currentHour >= 4 && currentHour < 12) {
        greeting = "Good morning";
    } else if (currentHour >= 12 && currentHour < 18) {
        greeting = "Good afternoon";
    } else if (currentHour >= 18 && currentHour < 22) {
        greeting = "Good evening";
    } else {
        greeting = "Good night";
    }

    return (
        <>
            <Navbar name={"Login"} red={"/login"}/>
            {storedUser || back ? <Navheader name={"Dashboard"} back={back} refresh={refreshPage}/> : <Navheader name={`${greeting} Readers!`} back={back} refresh={refreshPage}/>}
            {storedUser ? <>
                    <form className="dashboardForm" onSubmit={onSubmit}>
                        <input maxLength={75} name="title" className="Input" type="text" placeholder="Title"
                               value={title} onChange={onChange}/>
                        <textarea maxLength={3000} name="content" placeholder="What's in your mind?" rows={content.split('\n').length + 1} value={content} onChange={onChange}/>
                        <button className="dashboardBtn"> {loadingCircle ?
                            <div className="loading-circle"></div> : <>Publish blog</>}</button>
                    </form>
                    <h3 className="dashboardH3">My Blogs</h3>
                </> :
                <h3 className="dashboardH3">All Blogs</h3>}

            {blogs.map((blog, index) => {
                return (
                    <Blog key={index} back={back} title={blog.title} writer={blog.user} content={blog.content}
                          date={blog.date.substring(0, 10)} email={blog.email} refresh={refreshPage} pic={blog.image}/>
                );
            })}
        </>
    );
}

export default Dashboard;