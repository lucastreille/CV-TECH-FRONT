import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const CreateCv = () => {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [description, setDescription] = useState("");
  const [experiencePedagogique, setExperiencePedagogique] = useState("");
  const [experiencePro, setExperiencePro] = useState("");
  const [isVisible, setIsVisible] = useState(true); 
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const navigate = useNavigate();

  const token = localStorage.getItem("authToken");


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
      setError("Erreur lors de la création du CV : " + (err.response?.data?.message || err.message));
    }

    setIsSubmitting(false);
  };

  return (
    <div>
      <h1>Créer un CV</h1>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nom">Nom :</label>
          <input
            type="text"
            id="nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="prenom">Prénom :</label>
          <input
            type="text"
            id="prenom"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="description">Description :</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            minLength="10"
          />
        </div>

        <div>
          <label htmlFor="experiencePedagogique">Expérience Pédagogique :</label>
          <textarea
            id="experiencePedagogique"
            value={experiencePedagogique}
            onChange={(e) => setExperiencePedagogique(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="experiencePro">Expérience Professionnelle :</label>
          <textarea
            id="experiencePro"
            value={experiencePro}
            onChange={(e) => setExperiencePro(e.target.value)}
            required
          />
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={isVisible}
              onChange={() => setIsVisible(!isVisible)} 
            />
            Rendre mon CV visible
          </label>
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Création en cours..." : "Créer le CV"}
        </button>
      </form>
    </div>
  );
};

export default CreateCv;
