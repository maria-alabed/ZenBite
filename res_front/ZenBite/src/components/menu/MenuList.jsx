import MenuCard from "./MenuCard";

const MenuList = ({ items }) => {
  return (
    <div className="menu-grid">
      {items.map((item) => (
        <MenuCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default MenuList;