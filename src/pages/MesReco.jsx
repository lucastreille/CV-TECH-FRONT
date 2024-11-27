import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

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
      const response = await api.get("/cv/list-recommandation-cv", {
        headers: { Authorization: `Bearer ${token}` } 
      });

      console.log(response.data); 

      setRecommendations(response.data.recommantation || []); 
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
      await api.delete(`/cv/delete-recommandation/${recommendationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setRecommendations(recommendations.filter(rec => rec._id !== recommendationId));
    } catch (err) {
      setError("Erreur lors de la suppression de la recommandation.");
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Mes Recommandations</h1>
      {loading && <p>Chargement...</p>}
      {error && <p>{error}</p>}
      
      {recommendations.length > 0 ? (
        <ul>
          {recommendations.map((rec) => (
            <li key={rec._id}>
              <p>{rec.recommendation}</p>
              <button onClick={() => handleDeleteRecommendation(rec._id)}>
                Supprimer
              </button>
              <button onClick={() => navigate(`/cv/details/${rec.idCv}`)}>
                Voir le CV
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucune recommandation trouvée.</p>
      )}
    </div>
  );
};

export default MesReco;
