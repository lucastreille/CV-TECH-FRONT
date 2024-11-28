import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import '../css/UpdateCv.css';

const UpdateCv = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cv, setCv] = useState({
    nom: "",
    prenom: "",
    description: "",
    experiencePedagogique: [],
    experiencePro: [],
    is_visible: false,
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCvDetails = async () => {
      try {
        const response = await api.get(`/cv/details-cv/${id}`);
        const cvData = response.data.cv;
        setCv({
          ...cvData,
          is_visible: cvData.is_visible ? true : false, // Convert to boolean for checkbox
        });
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
      [name]: value,
    }));
  };

  const handleCheck = (e) => {
    setCv((prevState) => ({
      ...prevState,
      is_visible: e.target.checked,
    }));
  };

  const handleAddField = (field) => {
    setCv((prevState) => ({
      ...prevState,
      [field]: [...prevState[field], ""],
    }));
  };

  const handleChangeField = (field, index, value) => {
    setCv((prevState) => ({
      ...prevState,
      [field]: prevState[field].map((item, idx) =>
        idx === index ? value : item
      ),
    }));
  };

  const handleRemoveField = (field, index) => {
    setCv((prevState) => ({
      ...prevState,
      [field]: prevState[field].filter((_, idx) => idx !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put(`/cv/updateCv/${id}`, {
        ...cv,
        is_visible: cv.is_visible ? 1 : 0, // Convert boolean to 1/0 for the backend
      });
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
            <label>Expérience Pédagogique :</label>
            {cv.experiencePedagogique.map((exp, index) => (
              <div key={index} style={{ marginBottom: "10px" }}>
                <input
                  type="text"
                  value={exp}
                  onChange={(e) =>
                    handleChangeField("experiencePedagogique", index, e.target.value)
                  }
                  placeholder={`Expérience pédagogique ${index + 1}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => handleRemoveField("experiencePedagogique", index)}
                >
                  Supprimer
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddField("experiencePedagogique")}
            >
              Ajouter une expérience pédagogique
            </button>
          </div>

          <div>
            <label>Expérience Professionnelle :</label>
            {cv.experiencePro.map((exp, index) => (
              <div key={index} style={{ marginBottom: "10px" }}>
                <input
                  type="text"
                  value={exp}
                  onChange={(e) =>
                    handleChangeField("experiencePro", index, e.target.value)
                  }
                  placeholder={`Expérience professionnelle ${index + 1}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => handleRemoveField("experiencePro", index)}
                >
                  Supprimer
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddField("experiencePro")}
            >
              Ajouter une expérience professionnelle
            </button>
          </div>

          <div>
            <label htmlFor="is_visible">CV visible :</label>
            <input
              type="checkbox"
              id="is_visible"
              checked={cv.is_visible}
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
