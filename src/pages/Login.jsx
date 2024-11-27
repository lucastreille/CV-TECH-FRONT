import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import MenuLoggedOut from "../components/MenuLoggedOut";

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

      navigate("/dashboard");

    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la connexion");
    }

  };

  return (
    
    <div>
      <MenuLoggedOut />

      <h1>Connexion</h1>

      <form onSubmit={handleLogin}>

        <div>
          <label>Email :</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Mot de passe :</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Se connecter</button>
        
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <p>
        Vous n'avez pas de compte ? <a href="/register">S'inscrire ici</a>
      </p>

    </div>

  );

};

export default Login;
