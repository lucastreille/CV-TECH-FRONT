import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import "../css/DetailsCv.css";
import MenuLoggedIn from "../components/MenuLoggedIn";

const DetailsCv = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cv, setCv] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [newRecommendation, setNewRecommendation] = useState("");
  const [connectedUserId, setConnectedUserId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCvDetails = async () => {
    try {
      const response = await api.get(`/cv/details-cv/${id}`);
      setCv(response.data.cv);
      setLoading(false);
    } catch (err) {
      setError(
        "Erreur lors du chargement du CV : " +
          (err.response?.data?.message || err.message)
      );
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await api.get(`/cv/list-recommandation-cv/${id}`);
      const validRecommendations =
        response.data.recommantation?.filter(
          (rec) => rec && rec.recommendation
        ) || [];
      setRecommendations(validRecommendations);
    } catch (err) {
      setError(
        "Erreur lors du chargement des recommandations : " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
    } else {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setConnectedUserId(decoded.id);
    }

    fetchCvDetails();
    fetchRecommendations();
  }, [id, navigate]);

  const handleRecommendationSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(
        "/cv/give-recommandation-cv",
        { idCv: id, recommendation: newRecommendation },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      const newRecommendationData = response.data.recommantation;
      if (newRecommendationData && newRecommendationData.recommendation) {
        setRecommendations([newRecommendationData, ...recommendations]);
      }
      setNewRecommendation("");
    } catch (err) {
      setError(
        "Erreur lors de l'envoi de la recommandation : " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  const handleDeleteRecommendation = async (recommendationId) => {
    try {
      await api.delete(`/cv/delete-recommendation/${recommendationId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      setRecommendations(
        recommendations.filter((rec) => rec._id !== recommendationId)
      );
    }
    catch (err) {
      setError(
        "Erreur lors de la suppression de la recommandation : " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  return (
    <div>
      <MenuLoggedIn />
      <div className="detailsCv-container">
        <h1 className="detailsCv-title">Détails du CV</h1>

        {error && <div className="detailsCv-error">{error}</div>}

        {loading ? (
          <p className="detailsCv-loading">Chargement des détails...</p>
        ) : cv ? (
          <div className="detailsCv-content">
            <h3 className="detailsCv-name">
              {cv.nom} {cv.prenom}
            </h3>
            <p className="detailsCv-description">
              <strong>Description:</strong> {cv.description}
            </p>
            <div className="detailsCv-experience">
              <strong>Expérience Pédagogique:</strong>
              <ul>
                {cv.experiencePedagogique.map((exp, index) => (
                  <li key={index}>{exp}</li>
                ))}
              </ul>
            </div>
            <div className="detailsCv-experience">
              <strong>Expérience Professionnelle:</strong>
              <ul>
                {cv.experiencePro.map((exp, index) => (
                  <li key={index}>{exp}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p className="detailsCv-notFound">Le CV demandé est introuvable.</p>
        )}

        <div className="detailsCv-recommendationForm">
          <h2 className="detailsCv-formTitle">Ajouter une Recommandation</h2>
          <form
            onSubmit={handleRecommendationSubmit}
            className="detailsCv-form"
          >
            <textarea
              value={newRecommendation}
              onChange={(e) => setNewRecommendation(e.target.value)}
              placeholder="Écrivez votre recommandation ici..."
              rows="4"
              className="detailsCv-textarea"
              required
            />
            <button type="submit" className="detailsCv-submitButton">
              Envoyer
            </button>
          </form>
        </div>

        <div className="detailsCv-recommendations">
          <h2 className="detailsCv-recommendationsTitle">Recommandations</h2>
          {recommendations.length > 0 ? (
            <ul className="detailsCv-recommendationList">
              {recommendations.map((rec) => (
                <li key={rec._id} className="detailsCv-recommendationItem">
                  <p className="detailsCv-recommendationText">
                    {rec.recommendation}
                  </p>
                  {connectedUserId === cv?.userId && rec._id && (
                    <button
                      className="detailsCv-deleteButton"
                      onClick={() => handleDeleteRecommendation(rec._id)}
                    >
                      Supprimer
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="detailsCv-noRecommendations">
              Aucune recommandation pour ce CV.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailsCv;
