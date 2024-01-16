import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from "./Signup.js";
import Login from "./Login.js";
import Dashboard from "./Dashboard.js";
import PrivateRoute from "./PrivateRoute.js";
import UserPosts from "./UserPosts.js";
function App() {

  return (
    <>
        <Router>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                    path="/profile"
                    element={
                        <PrivateRoute isAuthenticated={true} />
                    }
                />
                <Route path="/posts/:user" element={<UserPosts />} />
            </Routes>
        </Router>
    </>
  )
}

export default App
