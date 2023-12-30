import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from "./Signup.js";
import Login from "./Login.js";
import Dashboard from "./Dashboard.js";
import PrivateRoute from "./PrivateRoute.js";
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
            </Routes>
        </Router>
        <ToastContainer />
    </>
  )
}

export default App
