import React, { useState, useEffect } from "react";
import api from "../api/api";
import {jwtDecode} from "jwt-decode";

const Accueil = () => {
  const [userName, setUserName] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;

    const fetchUserDetails = async () => {
      try {
        const response = await api.get(`/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserName(response.data.username);
      } catch {
        setError("Erreur lors de la récupération des données utilisateur.");
      }
    };

    fetchUserDetails();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Bienvenue, {userName || "Utilisateur"} !</h1>
      <p>Ceci est votre tableau de bord personnel.</p>
    </div>
  );
};

export default Accueil;
