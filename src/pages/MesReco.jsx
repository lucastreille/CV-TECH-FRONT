import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "../css/MesReco.css";

const MesReco = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchRecommendations = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setError("Vous devez être connecté.");
      return;
    }

    try {
      const response = await api.get("/cv/get-recommendations", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(response.data);

      setRecommendations(response.data.recommandations || []);
      setLoading(false);
    } catch (err) {
      setError("Erreur lors du chargement des recommandations.");
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleDeleteRecommendation = async (recommendationId) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setError("Vous devez être connecté.");
      return;
    }

    try {
      await api.delete(`/cv/delete-recommendation/${recommendationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRecommendations(
        recommendations.filter((rec) => rec._id !== recommendationId)
      );
    } catch (err) {
      setError("Erreur lors de la suppression de la recommandation.");
      console.error(err);
    }
  };

  return (
    <div className="recommendations-container">
      <h1 className="recommendations-title">Mes Recommandations</h1>
      {loading && <p className="recommendations-loading">Chargement...</p>}
      {error && <p className="recommendations-error">{error}</p>}

      {recommendations.length > 0 ? (
        <ul className="recommendations-list">
          {recommendations.map((rec) => (
            <li key={rec._id} className="recommendation-item">
              <p className="recommendation-text">{rec.recommendation}</p>
              <div className="recommendation-actions">
                <button
                  className="recommendation-delete-btn"
                  onClick={() => handleDeleteRecommendation(rec._id)}
                >
                  Supprimer
                </button>
                <button
                  className="recommendation-view-cv-btn"
                  onClick={() => navigate(`/cv/details/${rec.idCv}`)}
                >
                  Voir le CV
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="recommendations-empty">Aucune recommandation trouvée.</p>
      )}
    </div>
  );
};

export default MesReco;
