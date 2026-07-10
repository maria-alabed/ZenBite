import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/adminLogin.css";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ بيانات دخول تجريبية (للتجربة فقط)
  const DEMO_CREDENTIALS = {
    email: "admin@zenbite.com",
    password: "admin123"
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ✅ تجربة الدخول باستخدام البيانات التجريبية أولاً
      if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
        // محاكاة توكن
        const mockToken = "demo_token_" + Date.now();
        const mockAdmin = {
          id: 1,
          name: "Super Admin",
          email: "admin@zenbite.com"
        };

        localStorage.setItem("adminToken", mockToken);
        localStorage.setItem("adminData", JSON.stringify(mockAdmin));

        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 500);
        return;
      }

      // ❌ إذا كانت البيانات غلط
      throw new Error("Invalid email or password");

      /* 
      // 🔐 عند جاهزية الـ API الحقيقي، استخدم هذا الكود بدل الـ mock:
      const response = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminData", JSON.stringify(data.admin));
      navigate("/admin/dashboard");
      */

    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
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
            {error && (
              <div className="admin-login-error">
                ⚠️ {error}
              </div>
            )}

            <div className="admin-login-field">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="admin@zenbite.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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