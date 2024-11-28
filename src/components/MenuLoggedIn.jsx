import React from "react";
import { Link } from "react-router-dom";
import "../css/Menu.css";
import { useNavigate } from "react-router-dom";



const MenuLoggedIn = () => {
    const navigate = useNavigate();

const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };



  return (
    <div className="menu-out">
    <nav className="menu-logged-out">
      <ul className="menu-list">
         <li><Link to="/" className="menu-item">Cv</Link></li>
        <li><Link to="/dashboard" className="menu-item">Dashboard</Link></li>
        <li onClick={handleLogout}  style={{ cursor: "pointer", color: "white" }}>Déconnexion</li>
        </ul>
    </nav>
    </div>
  );
};

export default MenuLoggedIn;
