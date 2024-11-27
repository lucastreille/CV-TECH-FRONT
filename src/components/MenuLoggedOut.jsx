import React from "react";
import { Link } from "react-router-dom";
import "../css/Menu.css";

const MenuLoggedOut = () => {
  return (
    <div className="menu-out">
    <nav className="menu-logged-out">
      <ul className="menu-list">
         <li><Link to="/" className="menu-item">Cv</Link></li>
        <li><Link to="/login" className="menu-item">Login</Link></li>
        <li><Link to="/register" className="menu-item">S'inscrire</Link></li>
      </ul>
    </nav>
    </div>
  );
};

export default MenuLoggedOut;
