import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../utils/translations";

function CustomerReviews() {
  const { language } = useLanguage();
  const t = translations[language];

  const reviews = [
    {
      id: 1,
      name: "Sarah M.",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 5,
      comment: t.review1 || "The food is absolutely amazing! Fresh, flavorful, and beautifully presented."
    },
    {
      id: 2,
      name: "John D.",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 4,
      comment: t.review2 || "Great experience. The sushi and ramen were top quality."
    },
    {
      id: 3,
      name: "Emily R.",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
      rating: 5,
      comment: t.review3 || "Best Asian restaurant I've ever tried. Highly recommended!"
    }
  ];

  const renderStars = (count) => {
    return "⭐".repeat(count);
  };

  return (
    <section className="reviews-section">
      <h2>
        {t.customer} <span>{t.reviews}</span>
      </h2>

      <p className="reviews-desc">
        {t.whatOurCustomersSay}
      </p>

      <div className="reviews-grid">
        {reviews.map((review) => (
          <div className="review-card" key={review.id}>
            <div className="review-header">
              <img src={review.image} alt={review.name} />
              <div>
                <h4>{review.name}</h4>
                <div className="stars">{renderStars(review.rating)}</div>
              </div>
            </div>
            <p className="comment">"{review.comment}"</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CustomerReviews;