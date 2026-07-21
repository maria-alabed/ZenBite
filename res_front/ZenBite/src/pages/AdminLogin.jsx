import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/adminLogin.css";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("adminToken", data.token);

      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-box">
          {/* Logo */}
          <div className="admin-login-header">
            <div className="admin-login-logo">🍜</div>
            <h1>ZenBite</h1>
            <p>Admin Panel</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="admin-login-form">
            {error && <div className="admin-login-error">⚠️ {error}</div>}

            <div className="admin-login-field">
              <label>Username</label>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="admin-login-field">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="admin-login-btn"
              disabled={loading}
            >
              {loading ? "Logging in..." : "🔐 Login"}
            </button>

            <div className="admin-login-footer">
              <small>Demo: admin@zenbite.com / admin123</small>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
