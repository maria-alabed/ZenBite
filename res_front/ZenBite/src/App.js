import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { LanguageProvider } from './context/LanguageContext';
import MenuPage from "./pages/MenuPage";
import HomePage from "./pages/HomePage";
import ProductDetails from "./pages/ProductDetails";
import OffersPage from "./pages/OffersPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";

// ✅ Protected Route Component
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("adminToken");
  
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
}

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <LanguageProvider>
          <Routes>
            {/* 🔓 المسارات العامة */}
            <Route path="/" element={<HomePage />} />
            <Route path="/menu" element={<MenuPage />} />  
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/offer" element={<OffersPage />} />
            
            {/* 🔐 مسارات الأدمن */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* ✅ إعادة توجيه /admin إلى /admin/dashboard أو /admin/login */}
            <Route 
              path="/admin" 
              element={
                localStorage.getItem("adminToken") 
                  ? <Navigate to="/admin/dashboard" replace /> 
                  : <Navigate to="/admin/login" replace />
              } 
            />
          </Routes>
        </LanguageProvider>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;