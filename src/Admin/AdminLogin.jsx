import { useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";
import ufeLogo from "../assets/ufelogo.png";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError("Нэвтрэх нэр эсвэл нууц үг буруу");
    } else {
      navigate("/admin");
    }
  };

  return (
    /* 🔴 NEW FULLSCREEN WRAPPER */
    <div className="login-page">
      <div className="login-wrapper">
        <div className="login-box">
          {/* Logo */}
          <div className="login-logo">
            <img src={ufeLogo} alt="UFE" />
            <h2>E-News</h2>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <input
                type="email"
                placeholder="Нэвтрэх нэр"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder="Нууц үг"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="login-btn" disabled={loading}>
              {loading ? "Түр хүлээнэ үү..." : "НЭВТРЭХ"}
            </button>

            {error && <p className="error-text">{error}</p>}
          </form>

          <p className="footer-text">
            ©2026 Бакалаврын Сургалтын Алба
          </p>
        </div>
      </div>
    </div>
  );
}
