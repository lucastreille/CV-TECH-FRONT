import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api"; 

const UpdateCv = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [cv, setCv] = useState({
    nom: "",
    prenom: "",
    description: "",
    experiencePedagogique: "",
    experiencePro: "",
    is_visible: false
  });
  
  const [error, setError] = useState(null); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCvDetails = async () => {
      try {
        const response = await api.get(`/cv/details-cv/${id}`);
        setCv(response.data.cv);
      } catch (err) {
        setError("Erreur lors du chargement du CV.");
      }
    };

    fetchCvDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCv((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCheck = (e) => {
    setCv((prevState) => ({
      ...prevState,
      is_visible: e.target.checked ? 1 : 0
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await api.put(`/cv/updateCv/${id}`, cv);
      navigate(`/dashboard/mes-cv`); 
    } catch (err) {
      setError("Erreur lors de la mise à jour du CV.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Mettre à jour le CV</h1>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="nom">Nom :</label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={cv.nom}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="prenom">Prénom :</label>
            <input
              type="text"
              id="prenom"
              name="prenom"
              value={cv.prenom}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="description">Description :</label>
            <textarea
              id="description"
              name="description"
              value={cv.description}
              onChange={handleChange}
              required
              minLength="10"
            />
          </div>

          <div>
            <label htmlFor="experiencePedagogique">Expérience Pédagogique :</label>
            <input
              type="text"
              id="experiencePedagogique"
              name="experiencePedagogique"
              value={cv.experiencePedagogique}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="experiencePro">Expérience Professionnelle :</label>
            <input
              type="text"
              id="experiencePro"
              name="experiencePro"
              value={cv.experiencePro}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="is_visible">CV visible :</label>
            <input
              type="checkbox"
              id="is_visible"
              checked={cv.is_visible === 1}
              onChange={handleCheck}
            />
          </div>

          <button type="submit">Mettre à jour</button>
        </form>
      )}
    </div>
  );
};

export default UpdateCv;
