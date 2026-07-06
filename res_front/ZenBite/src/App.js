import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { LanguageProvider } from './context/LanguageContext';
import MenuPage from "./pages/MenuPage";
import HomePage from "./pages/HomePage";
import ProductDetails from "./pages/ProductDetails";
import OffersPage from "./pages/OffersPage";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <LanguageProvider>
        <Routes>

          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />  
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/offer" element={<OffersPage />} />
        </Routes>
        </LanguageProvider>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;