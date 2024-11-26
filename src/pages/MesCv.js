import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

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
    <div className="mes-cv-container">
      <h1>Mes CV</h1>
      {cvs.length === 0 ? (
        <p>Vous n'avez aucun CV pour le moment. Créez-en un pour commencer !</p>
      ) : (
        <div className="cv-list">
          {cvs.map((cv) => (
            <div key={cv._id} className="cv-card">
              <h2>
                {cv.nom} {cv.prenom}
              </h2>
              <p><strong>Description :</strong> {cv.description}</p>
              <p><strong>Expérience Pédagogique :</strong> {cv.experiencePedagogique}</p>
              <p><strong>Expérience Professionnelle :</strong> {cv.experiencePro}</p>
              <p><strong>Visible :</strong> {cv.is_visible ? "Oui" : "Non"}</p>
              <button
                onClick={() => handleEditCv(cv._id)}
                className="edit-cv-button"
              >
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
