import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "../css/Dashboard.css";

const DashboardLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className="dashboard-layout">
      <div className="sidebar">
        <h2 onClick={() => navigate("/")}>Dashboard</h2>
        <ul>
          <li onClick={() => navigate("/")}>{"<-"} Revenir à l'accueil</li>
          <div style={{ height: '25px' }} />
          <li onClick={() => navigate("/dashboard")}>Accueil</li>
          <li onClick={() => navigate("/dashboard/mes-cv")}>Mes CV</li>
          <li onClick={() => navigate("/dashboard/create-cv")}>Créer un CV</li>
          <li onClick={() => navigate("/dashboard/reco")}>Mes Recommandations</li>
          <li onClick={handleLogout}>Déconnexion</li>
        </ul>
      </div>

      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
