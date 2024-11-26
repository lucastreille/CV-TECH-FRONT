import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const Register = () => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {

      await api.post("/auth/register", { username, email, password });
      navigate("/login");

    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription");
    }
    
  };

  return (

    <div style={styles.container}>

      <h1>Inscription</h1>
      
      <form onSubmit={handleRegister} style={styles.form}>
        
        <div style={styles.inputGroup}>
          <label>Nom :</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Entrez votre nom"
          />
        </div>

        <div style={styles.inputGroup}>
          <label>Email :</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Entrez votre email"
          />
        </div>

        <div style={styles.inputGroup}>
          <label>Mot de passe :</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Entrez votre mot de passe"
          />
        </div>

        <button type="submit" style={styles.button}>S'inscrire</button>

      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

    </div>

  );

};

const styles = {
  container: {
    width: '100%',
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#fff',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputGroup: {
    marginBottom: '15px',
  },
  button: {
    padding: '10px',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default Register;
