import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import './Style.css'; 

import ListeCvVisible from './pages/ListeCvVisible';
import Login from "./pages/Login";
import Register from "./pages/Register"; 


import DetailsCv from "./pages/DetailsCv";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ListeCvVisible />} />
        <Route path="/cv/details/:id" element={<DetailsCv />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
