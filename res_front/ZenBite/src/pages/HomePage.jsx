import { useState } from "react";
import HeroSection from "../components/home/HeroSection";
import TopCategories from "../components/home/TopCategories";
import AsianJourney from "../components/home/AsianJourney";
import PopularDishes from "../components/home/PopularDishes";
import CustomerReviews from "../components/home/CustomerReviews";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import CartSidebar from "../components/cart/CartSidebar";
import { useLanguage } from "../context/LanguageContext";
import "../styles/homepage.css";

const HomePage = () => {
  const [openCart, setOpenCart] = useState(false);
  const { language } = useLanguage();
  
  const [selectedCategory, setSelectedCategory] = useState("Sushi Bar");
  
  return (
    <>
      <Navbar />

      <HeroSection />
      <PopularDishes />

      <TopCategories
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <AsianJourney />
      <CustomerReviews />
      <Footer />

      <CartSidebar
        isOpen={openCart}
        onClose={() => setOpenCart(false)}
      />
    </>
  );
};

export default HomePage;