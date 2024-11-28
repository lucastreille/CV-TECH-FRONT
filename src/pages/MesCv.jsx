import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "../css/MesCv.css";

const MesCv = () => {
  const [cvs, setCvs] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchUserCvs = async () => {
      try {
        const response = await api.get("/cv/liste-user-cv", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCvs(response.data.cvs);
      } catch (err) {
        setError("Erreur lors de la récupération de vos CV.");
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchUserCvs();
    } else {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleEditCv = (id) => {
    navigate(`/dashboard/cv/updateCv/${id}`);
  };

  if (isLoading) {
    return <p>Chargement de vos CV...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="mescv-container">
    <h1 className="mescv-title">Mes CV</h1>
    {cvs.length === 0 ? (
      <p className="mescv-empty">Vous n'avez aucun CV pour le moment. Créez-en un pour commencer !</p>
    ) : (
      <div className="mescv-grid">
        {cvs.map((cv) => (
          <div key={cv._id} className="mescv-card">
            <h2 className="mescv-card-title">{cv.nom} {cv.prenom}</h2>
            <p className="mescv-description">{cv.description}</p>
            <div className="mescv-section">
              <h3 className="mescv-section-title">Expérience Pédagogique</h3>
              <ul className="mescv-list">
                {cv.experiencePedagogique.map((exp, index) => (
                  <li key={index} className="mescv-list-item">{exp}</li>
                ))}
              </ul>
            </div>
            <div className="mescv-section">
              <h3 className="mescv-section-title">Expérience Professionnelle</h3>
              <ul className="mescv-list">
                {cv.experiencePro.map((exp, index) => (
                  <li key={index} className="mescv-list-item">{exp}</li>
                ))}
              </ul>
            </div>
            <p className="mescv-visibility">Visible : {cv.is_visible ? "Oui" : "Non"}</p>
            <button onClick={() => handleEditCv(cv._id)} className="mescv-edit-button">
              Modifier
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
  );
};

export default MesCv;
