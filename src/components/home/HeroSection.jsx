import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../utils/translations";
import heroFood from '../../assets/images/hero-food.png';

const HeroSection = () => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <section className="hero">
      <div className="hero-left">
        <span className="welcome-badge">
          {t.welcomeToZenBite} 👋
        </span>

        <h1>
          {t.weServeThe}
          <br />
          <span>{t.taste}</span>
          <br />
          {t.youLove} 😍
        </h1>

        <p>
          {t.heroDescription}
        </p>

        <div className="hero-buttons">
          <a href="#menu" className="explore-btn">
            {t.ourBestDishes}
          </a>
          <a href="#categories" className="view-btn">
            {t.viewCategories}
          </a>
        </div>
      </div>

      <div className="hero-right">
        <img src={heroFood} alt="food" />
      </div>
    </section>
  );
};

export default HeroSection;