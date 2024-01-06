import React, {useState} from "react";
import "../css/blog.css";
import image from "../images/img1.png";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const Blog = (props) => {

    const navigate = useNavigate();

    const [check, setCheck] = React.useState(true);
    const [check2, setCheck2] = React.useState(false);
    const onClick = () => {
        setCheck(!check);
    }

    const [blogData, setBlogData] = React.useState({
        title: props.title,
        content: props.content
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
        // post request to update post
        axios.post(process.env.REACT_APP_BACKEND_API + `/user/posts/${props.title}`, {
            title: title,
            content: content
        }, config)
            .then(res => {
                console.log(res.data);
                // window.location.reload();
            })
            .catch(err => {
                console.log(err);
                alert("Blog not updated");
            });
        setCheck(!check);
    }


    // delete post by matching title
    const deletePost = (e) => {
        e.preventDefault();
        const token = JSON.parse(localStorage.getItem("user")).token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        axios.delete(process.env.REACT_APP_BACKEND_API + `/user/posts/${props.title}`, config)
            .then(res => {
                console.log(res);
                props.refresh();
            })
            .catch(err => {
                console.log(err);
            });
    }

    const seeMore = (e) => {
        // props.onlyUser(props.email);
        const mail = props.email.replace("@", "%40");
        navigate(`/posts/${mail}`);
    }

    const storedUser = localStorage.getItem("user");

    const [deleting, setDeleting] = useState(false);

    const confirmDelete = e => {
        setDeleting(!deleting);
    }

    return (
        <div className="Blog">
            <div className="blogHeader">
                <img className="blogImg" src={image} alt="blogImage"/>
                {check ? <h4 className="h4Ele">{title}</h4> : <textarea maxLength={75} rows={title.split('\n').length + 1} className="h4Input" onChange={onChange} name="title" disabled={check} value={title}/>}
                <h6 className="blogA">{props.writer + " - " + props.date}</h6>
            </div>
            {check ? <p className="pEle" >{content}</p> : <textarea maxLength={3000} rows={content.split('\n').length + 1 > content.length / 80 ? content.split('\n').length + 1 : content.length / 80} className="pInput" onChange={onChange} name="content" disabled={check} value={content}/>}
            <div className="blogFooter">
                {storedUser ? <>
                {!deleting ? <> <a onClick={confirmDelete}>Delete</a>
            {check ? <a onClick={onClick}>Edit</a> : <a onClick={onSubmit}>Save</a>} </> : <>
                    <a onClick={deletePost}>Confirm</a>
                    <a onClick={confirmDelete}>Cancel</a>
                </>}
                </> : <>
                {!props.back && <a onClick={seeMore}>See more from this user</a>}
                </>}
            </div>
        </div>
    );
}

export default Blog;