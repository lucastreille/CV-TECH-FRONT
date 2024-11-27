import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import "../css/DetailsCv.css";

const DetailsCv = () => {
  const { id } = useParams(); // Récupère l'ID du CV depuis l'URL
  const [cv, setCv] = useState(null);
  const [recommendations, setRecommendations] = useState([]); // Initialisation de recommendations comme un tableau vide
  const [newRecommendation, setNewRecommendation] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  // Fonction pour ajouter une nouvelle recommandation
  const handleRecommendationSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Vous devez être connecté pour envoyer une recommandation.");
      return;
    }

    try {
      const response = await api.post(
        "/cv/give-recommandation-cv",
        { idCv: id, recommendation: newRecommendation },
        { headers: { Authorization: `Bearer ${token}` } }
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

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/");
    }

    fetchCvDetails();
    fetchRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigate]);

  return (
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
          <p className="detailsCv-experience">
            <strong>Expérience Pédagogique:</strong> {cv.experiencePedagogique}
          </p>
          <p className="detailsCv-experience">
            <strong>Expérience Professionnelle:</strong> {cv.experiencePro}
          </p>
        </div>
      ) : (
        <p className="detailsCv-notFound">Le CV demandé est introuvable.</p>
      )}

      {/* Formulaire pour envoyer une recommandation */}
      <div className="detailsCv-recommendationForm">
        <h2 className="detailsCv-formTitle">Ajouter une Recommandation</h2>
        <form onSubmit={handleRecommendationSubmit} className="detailsCv-form">
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

      {/* Affichage des recommandations */}
      <div className="detailsCv-recommendations">
        <h2 className="detailsCv-recommendationsTitle">Recommandations</h2>
        {recommendations.length > 0 ? (
          <ul className="detailsCv-recommendationList">
            {recommendations.map((rec, index) => (
              <li key={index} className="detailsCv-recommendationItem">
                <p className="detailsCv-recommendationText">
                  {rec.recommendation
                    ? rec.recommendation
                    : "Recommandation indisponible"}
                </p>
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
  );  
};

export default DetailsCv;
