const MenuCard = ({ item }) => {
  return (
    <div className="menu-card">
      <img src={item.image} alt={item.name} />

      <h3>{item.name}</h3>
      <p>{item.description}</p>

      <span>{item.price} $</span>

      <button>Add to Cart 🛒</button>
    </div>
  );
};

export default MenuCard;