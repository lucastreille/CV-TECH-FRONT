import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import '../css/ListeCvVisible.css';

const ListeCvVisible = () => {
  const [cvs, setCvs] = useState([]);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const fetchVisibleCvs = async () => {
    try {
      const response = await api.get("/cv/show-visible-cv");
      setCvs(response.data.cvs);
    } catch (err) {
      setError(
        "Erreur lors du chargement des CVs : " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
    }
    fetchVisibleCvs();
  }, []);

  const handleViewDetails = (cvId) => {
    if (isLoggedIn) {
      navigate(`/cv/details/${cvId}`);
    } else {
      alert("Veuillez vous connecter pour voir les détails");
    }
  };

  const handleSearch = (e) => {
    const search = e.target.value;
    if (search === "") {
      fetchVisibleCvs();
    } else {
      const filteredCvs = cvs.filter((cv) => {
        return cv.nom.toLowerCase().includes(search.toLowerCase()) || cv.prenom.toLowerCase().includes(search.toLowerCase());
      });
      setCvs(filteredCvs);
    }
  }

  // const handleModifDetails = (cvId) => {
  //   if (isLoggedIn) {
  //     navigate(`/cv/updateCv/${cvId}`);
  //   } else {
  //     alert("Veuillez vous connecter pour modifier le cv");
  //   }
  // }

  return (
    <div className="listeCvVisible-container">
      <input type="text" placeholder="Rechercher par nom ou prénom" className="listeCvVisible-search" onChange={handleSearch} />
      <h1 className="listeCvVisible-title">Liste des CVs</h1>

      {error && <div className="listeCvVisible-error">{error}</div>}

      <ul className="listeCvVisible-list">
        {cvs.length > 0 ? (
          cvs.map((cv) => (
            <li key={cv._id} className="listeCvVisible-item">
              <h3 className="listeCvVisible-item-title">
                {cv.nom} {cv.prenom}
              </h3>
              <p className="listeCvVisible-item-description">{cv.description}</p>
              <p className="listeCvVisible-item-description">
                Expérience Pédagogique: {cv.experiencePedagogique}
              </p>
              <p className="listeCvVisible-item-description">
                Expérience Professionnelle: {cv.experiencePro}
              </p>

              {isLoggedIn && (
                <button
                  className="listeCvVisible-button"
                  onClick={() => handleViewDetails(cv._id)}
                >
                  Voir les détails
                </button>
              )}
            </li>
          ))
        ) : (
          <p className="listeCvVisible-emptyMessage">
            Aucun CV visible trouvé.
          </p>
        )}
      </ul>
    </div>
  );
};

export default ListeCvVisible;
