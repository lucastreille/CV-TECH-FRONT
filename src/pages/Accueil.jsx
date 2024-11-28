import React, { useState, useEffect } from "react";
import api from "../api/api";
import {jwtDecode} from "jwt-decode";

const Accueil = () => {
  const [userName, setUserName] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

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
        setNewUserName(response.data.username);
      } catch {
        setError("Erreur lors de la récupération des données utilisateur.");
      }
    };

    fetchUserDetails();
  }, []);

  const handleUserNameChange = (e) => {
    setNewUserName(e.target.value);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("authToken");
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;

    try {
      const response = await api.put(
        `/users/updateUser/${userId}`,
        { username: newUserName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserName(response.data.username);
      setSuccessMessage("Pseudo mis à jour avec succès !");
      setError(null);
    } catch {
      setError("Erreur lors de la mise à jour du pseudo.");
      setSuccessMessage("");
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Bienvenue, {userName || "Utilisateur"} !</h1>
      <p>Ceci est votre tableau de bord personnel.</p>

      <label htmlFor="username">Modifier votre pseudo :</label>
      <input
        type="text"
        id="username"
        value={newUserName}
        onChange={handleUserNameChange}
      />
      <button onClick={handleSubmit}>Enregistrer</button>

      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Accueil;
