const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');
const port = 3000;
const mongoose = require('mongoose');
const cors = require('cors');

mongoose.connect('mongodb://localhost:27017/mernBlogDB', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    image: String
});

const User = mongoose.model('User', userSchema);

// Create a posts schema and model with post title, content, author email, and date

const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    email: String,
    date: Date,
    user: String,
    image: String
});

const Post = mongoose.model('Post', postSchema);

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

const secret = "this-is-a-secret";

// Generate a token for the user

const generateToken = (user) => {
    return jwt.sign({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        image: user.image
    }, secret, {
        expiresIn: '30d',
    });
}

app.post('/api/user', asyncHandler(async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    console.log(req.body);
    const {firstName, lastName, email, password} = req.body;

    const salt = await bcrypt.genSaltSync();

    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        image: ""
    }).then((user) => {
        res.json({
            token: generateToken(user),
            user: user
        });
    });
}));

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, secret);

            req.user = await User.findOne({email: decoded.email}).select('-password');

            next();
        } catch (error) {
            console.log(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }

    if(!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }

});

// create a path to update the user in database

app.post('/api/user/update', protect, asyncHandler(async (req, res) => {

    const {firstName, lastName, password, image} = req.body;
    console.log(req.body);
    const salt = await bcrypt.genSaltSync();
    const hashedPassword = await bcrypt.hash(password, salt);
    User.updateOne({'email': req.user.email}, {$set: {'firstName': firstName, 'lastName': lastName, 'password': hashedPassword, 'image': image}})
        .then((user) => {
            res.json(user);
        })
}));

// global variable to store the email of the logged in user

let emaill = "";
let userr = "";

app.post('/api/login',  asyncHandler(async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    console.log(req.body);
    await User.findOne({'email': req.body.email} )
        .then( async (user) => {
            if(await bcrypt.compare(req.body.password, user.password)) {
                emaill = req.body.email;
                userr = user.firstName + " " + user.lastName;
                console.log('User found');
                res.json({
                    token: generateToken(user),
                    user: user
                });
                console.log(user);
            } else {
                console.log('User not found')
            }
        })
}));



app.post('/api/post', protect, asyncHandler(async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    console.log(req.body);
    const {title, content} = req.body;

    const date = new Date();
    // Create a new post with the title, content, email, and date
    Post.create({title, content, email: req.user.email, date, user: req.user.firstName + ' ' + req.user.lastName, image: req.user.image}).then((post) => {
        res.json(post);
    });
}));

// app.post('/api/post/delete', protect, asyncHandler(async (req, res) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     console.log(req.body);
//     const {title, content} = req.body;
//
//     const date = new Date();
//     Post.deleteOne({title, content, email: req.user.email, date, user: req.user.firstName + ' ' + req.user.lastName}).then((post) => {
//         res.json(post);
//     });
// }));

// create a delete post route to delete a post by matching title and content

app.delete('/api/user/posts/:title', protect, asyncHandler(async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    console.log(req.params.title);
    Post.deleteOne({title: req.params.title, email: req.user.email}).then((post) => {
        res.json(post);
    });
}));

// create update post route to update a post by matching title and content



app.post('/api/user/posts/:title', protect, asyncHandler(async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    console.log(req.params.title);
    Post.updateOne({title: req.params.title, email: req.user.email}, {$set: {title: req.body.title, content: req.body.content}}).then((post) => {
        res.json(post);
    });
}));


// Create a GET route to get all posts

app.get('/api/user/posts', protect, asyncHandler(async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    Post.find({email: req.user.email}).then((posts) => {
        res.json(posts);
    });
}));

app.get('/api/user/posts/:email', asyncHandler(async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    Post.find({email: req.params.email}).then((posts) => {
        res.json(posts);
    });
}));

app.get('/api/posts', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    Post.find({}).then((posts) => {
        res.json(posts);
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});