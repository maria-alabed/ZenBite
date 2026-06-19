import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../utils/translations";
import journey from '../../assets/images/journey.png';

function AsianJourney() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <section className="journey">
      <div className="journey-content">
        <h2>
          {t.our} <span className="orange">{t.asian}</span> {t.journey}
        </h2>

        <h4>
          {t.asianFinestFlavors}
          <br />
          {t.directlyToYourTable}
        </h4>

        <p>
          {t.asianJourneyDesc}
        </p>

        <div className="journey-stats">
          <div>
            <h3>50+</h3>
            <span>{t.signatureDishes}</span>
          </div>

          <div>
            <h3>10+</h3>
            <span>{t.asianCategories}</span>
          </div>

          <div>
            <h3>5★</h3>
            <span>{t.customerRating}</span>
          </div>
        </div>
      </div>

      <div className="journey-image">
        <img src={journey} alt="Asian Restaurant" />
      </div>
    </section>
  );
}

export default AsianJourney;