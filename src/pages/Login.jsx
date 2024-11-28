import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import MenuLoggedOut from "../components/MenuLoggedOut";
import "../css/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", { email, password });
      const { token } = response.data;

      localStorage.setItem("authToken", token);

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la connexion");
    }
  };

  return (
    <div>
      <MenuLoggedOut />

      <div className="login-container">
        <h1 className="login-title">Connexion</h1>

        <form onSubmit={handleLogin} className="login-form">
          <div className="login-form-group">
            <label className="login-label">Email :</label>
            <input
              className="login-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-form-group">
            <label className="login-label">Mot de passe :</label>
            <input
              className="login-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-button">
            Se connecter
          </button>
        </form>

        {error && <p className="login-error">{error}</p>}

        <p className="login-register-link">
          Vous n'avez pas de compte ? <a href="/register">S'inscrire ici</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
