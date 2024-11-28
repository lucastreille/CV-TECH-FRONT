import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "../css/CreateCv.css";

const CreateCv = () => {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [description, setDescription] = useState("");
  const [experiencePedagogique, setExperiencePedagogique] = useState([]);
  const [experiencePro, setExperiencePro] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("authToken");

  const handleAddExperiencePedagogique = () => {
    setExperiencePedagogique([...experiencePedagogique, ""]);
  };

  const handleChangeExperiencePedagogique = (index, value) => {
    const updatedExperiences = [...experiencePedagogique];
    updatedExperiences[index] = value;
    setExperiencePedagogique(updatedExperiences);
  };

  const handleRemoveExperiencePedagogique = (index) => {
    const updatedExperiences = experiencePedagogique.filter(
      (_, i) => i !== index
    );
    setExperiencePedagogique(updatedExperiences);
  };

  const handleChangeExperiencePro = (index, value) => {
    const updatedExperiences = [...experiencePro];
    updatedExperiences[index] = value;
    setExperiencePro(updatedExperiences);
  };

  const handleRemoveExperiencePro = (index) => {
    const updatedExperiences = experiencePro.filter((_, i) => i !== index);
    setExperiencePro(updatedExperiences);
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post(
        "/cv/createCv",
        {
          nom,
          prenom,
          description,
          experiencePedagogique,
          experiencePro,
          is_visible: isVisible ? 1 : 0,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/");
    } catch (err) {
      setError(
        "Erreur lors de la création du CV : " +
          (err.response?.data?.message || err.message)
      );
    }

    setIsSubmitting(false);
  };

  return (
    <div className="create-cv-container">
      <h1 className="create-cv-title">Créer un CV</h1>

      {error && <div className="create-cv-error">{error}</div>}

      <form onSubmit={handleSubmit} className="create-cv-form">
        <div className="form-group">
          <label htmlFor="nom" className="form-label">
            Nom :
          </label>
          <input
            type="text"
            id="nom"
            className="form-input"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="prenom" className="form-label">
            Prénom :
          </label>
          <input
            type="text"
            id="prenom"
            className="form-input"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description :
          </label>
          <textarea
            id="description"
            className="form-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            minLength="10"
          />
        </div>

        <div className="form-group experience-section">
          <label className="form-label">Expérience Pédagogique :</label>
          {experiencePedagogique.map((exp, index) => (
            <div key={index} className="experience-item">
              <input
                type="text"
                className="form-input"
                value={exp}
                onChange={(e) =>
                  handleChangeExperiencePedagogique(index, e.target.value)
                }
                placeholder={`Expérience pédagogique ${index + 1}`}
                required
              />
              <button
                type="button"
                className="btn btn-remove"
                onClick={() => handleRemoveExperiencePedagogique(index)}
              >
                Supprimer
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-add"
            onClick={handleAddExperiencePedagogique}
          >
            Ajouter une expérience pédagogique
          </button>
        </div>

        <div className="form-group experience-section">
          <label className="form-label">Expérience Professionnelle :</label>
          {experiencePro.map((exp, index) => (
            <div key={index} className="experience-item">
              <input
                type="text"
                className="form-input"
                value={exp}
                onChange={(e) =>
                  handleChangeExperiencePro(index, e.target.value)
                }
                placeholder={`Expérience professionnelle ${index + 1}`}
                required
              />
              <button
                type="button"
                className="btn btn-remove"
                onClick={() => handleRemoveExperiencePro(index)}
              >
                Supprimer
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-add"
            onClick={() => setExperiencePro([...experiencePro, ""])}
          >
            Ajouter une expérience professionnelle
          </button>
        </div>

        <div className="form-group checkbox-group">
          <label className="form-label">
            <input
              type="checkbox"
              className="form-checkbox"
              checked={isVisible}
              onChange={() => setIsVisible(!isVisible)}
            />
            Rendre mon CV visible
          </label>
        </div>

        <button
          type="submit"
          className="btn btn-submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Création en cours..." : "Créer le CV"}
        </button>
      </form>
    </div>
  );
};

export default CreateCv;
