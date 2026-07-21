import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/admin.css";

const NAV_TITLES = {
  dashboard: "Dashboard",
  menu: "Menu items",
  offers: "Offers",
  orders: "Orders",
  addons: "Add-ons",
  reviews: "Reviews",
  analytics: "Analytics",
  users: "Admins",
  settings: "Settings",
};

const STATUS_CLASS = {
  Pending: "s-pending",
  Preparing: "s-preparing",
  Ready: "s-ready",
  Served: "s-served",
  Completed: "s-completed",
  Cancelled: "s-cancelled",
};

/* ---------------- Mock data (بديل مؤقت لحد ما تضيفو الـ endpoints) ---------------- */

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState("dashboard");
  const [openModalId, setOpenModalId] = useState(null);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  // بيانات حقيقية من الـ API
  const [categories, setCategories] = useState([]);
  const [offers, setOffers] = useState([]);
  const [topDishes, setTopDishes] = useState([]);
  // بيانات mock لحد ما تضيفو الـ endpoints
  const [orders, setOrders] = useState([]);
  const [addons, setAddons] = useState([]); // فلاتر صفحة الأطباق
  const [menuSearch, setMenuSearch] = useState("");
  const [menuCatFilter, setMenuCatFilter] = useState("");
  const [offerSearch, setOfferSearch] = useState("");
  // إعدادات (toggles)
  const [settings, setSettings] = useState({
    waiterCallNotif: true,
    newOrderNotif: true,
    autoPrint: false,
    cashOnDelivery: true,
    card: true,
    digitalWallet: false,
  });

  // ✅ جلب بيانات الأدمن من localStorage
  const adminData = JSON.parse(localStorage.getItem("adminData") || "{}");
  useEffect(() => {
    axios.get("http://localhost:5000/api/orders/recent").then((res) => {
      console.log(res.data);
      setOrders(res.data);
    });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err));

    axios
      .get("http://localhost:5000/api/offers")
      .then((res) => setOffers(res.data))
      .catch((err) => console.error(err));

    axios
      .get("http://localhost:5000/api/products")
      .then((res) => {
        console.log("PRODUCTS FROM API:", res.data);
        setProducts(res.data);
      })
      .catch((err) => console.log(err));

    axios
      .get("http://localhost:5000/api/products/top")
      .then((res) => {
        setTopDishes(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/addons")
      .then((res) => {
        console.log(res.data);
        setAddons(res.data.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const pendingCount = useMemo(
    () => orders.filter((o) => o.status === "Pending").length,
    [orders],
  );

  const filteredMenu = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(menuSearch.toLowerCase());

      const matchesCategory =
        !menuCatFilter || product.category === menuCatFilter;

      return matchesSearch && matchesCategory;
    });
  }, [products, menuSearch, menuCatFilter]);
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
    );
  };

  const toggleSetting = (key) =>
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  const openModal = (id) => setOpenModalId(id);
  const closeModal = () => setOpenModalId(null);

  // ✅ دالة تسجيل الخروج
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    navigate("/admin/login");
  };

  return (
    <div className="admin-root">
      <h2 className="sr-only">
        ZenBite admin dashboard with 9 management sections
      </h2>

      <div className="admin-shell">
        {/* SIDEBAR */}
        <div className="sidebar">
          <div className="logo">
            <div className="logo-name">ZenBite</div>
            <div className="logo-sub">Admin Panel</div>
          </div>

          <NavItem
            view="dashboard"
            active={activeView}
            onClick={setActiveView}
            icon="ti-layout-dashboard"
            label="Dashboard"
          />

          <div className="nav-section">Management</div>
          <NavItem
            view="menu"
            active={activeView}
            onClick={setActiveView}
            icon="ti-tools-kitchen-2"
            label="Menu items"
          />
          <NavItem
            view="offers"
            active={activeView}
            onClick={setActiveView}
            icon="ti-tag"
            label="Offers"
          />
          <NavItem
            view="orders"
            active={activeView}
            onClick={setActiveView}
            icon="ti-clipboard-list"
            label="Orders"
            badge={pendingCount}
          />

          <NavItem
            view="addons"
            active={activeView}
            onClick={setActiveView}
            icon="ti-plus"
            label="Add-ons"
          />
          <NavItem
            view="reviews"
            active={activeView}
            onClick={setActiveView}
            icon="ti-star"
            label="Reviews"
          />

          <NavItem
            view="users"
            active={activeView}
            onClick={setActiveView}
            icon="ti-users"
            label="Admins"
          />
          <NavItem
            view="settings"
            active={activeView}
            onClick={setActiveView}
            icon="ti-settings"
            label="Settings"
          />

          <div className="sidebar-footer">
            <div className="admin-info">
              <div className="admin-avatar">
                {adminData?.name
                  ? adminData.name.charAt(0).toUpperCase()
                  : "SA"}
              </div>
              <div>
                <div className="admin-name">
                  {adminData?.name || "Super Admin"}
                </div>
                <div className="admin-role">
                  {adminData?.email || "admin@zenbite.com"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div className="main">
          <div className="topbar">
            <div className="topbar-title">{NAV_TITLES[activeView]}</div>
            <div className="topbar-right">
              <div className="notif-wrap">
                <button
                  className="topbar-btn"
                  onClick={() => setActiveView("orders")}
                >
                  <i className="ti ti-bell" aria-hidden="true" /> {pendingCount}
                  {}
                  new
                  {pendingCount > 0 && <div className="notif-dot" />}
                </button>
              </div>
              <button
                className="topbar-btn"
                onClick={() => window.open("/", "_blank")}
              >
                <i className="ti ti-eye" aria-hidden="true" /> View site
              </button>
              {/* ✅ زر تسجيل الخروج */}
              <button className="topbar-btn logout-btn" onClick={handleLogout}>
                <i className="ti ti-logout" aria-hidden="true" /> Logout
              </button>
            </div>
          </div>

          <div className="content">
            {activeView === "dashboard" && (
              <DashboardView
                orders={orders}
                pendingCount={pendingCount}
                topDishes={topDishes}
                onViewOrders={() => setActiveView("orders")}
              />
            )}

            {activeView === "menu" && (
              <MenuView
                categories={categories}
                dishes={filteredMenu}
                search={menuSearch}
                setSearch={setMenuSearch}
                catFilter={menuCatFilter}
                setCatFilter={setMenuCatFilter}
                onAdd={() => openModal("add-dish")}
                onEdit={() => openModal("edit-dish")}
              />
            )}

            {activeView === "offers" && (
              <OffersView
                offers={offers}
                search={offerSearch}
                setSearch={setOfferSearch}
                onAddEdit={() => openModal("add-offer")}
              />
            )}

            {activeView === "orders" && (
              <OrdersView orders={orders} onStatusChange={updateOrderStatus} />
            )}

            {activeView === "addons" && (
              <AddonsView
                addons={addons}
                onAdd={() => openModal("add-addon")}
              />
            )}

            {activeView === "reviews" && <ReviewsView />}

            {activeView === "analytics" && <AnalyticsView />}

            {activeView === "users" && (
              <UsersView onAdd={() => openModal("add-user")} />
            )}

            {activeView === "settings" && (
              <SettingsView settings={settings} onToggle={toggleSetting} />
            )}
          </div>
        </div>
      </div>

      {/* MODALS */}
      <Modal
        id="add-dish"
        title="Add new dish"
        open={openModalId === "add-dish"}
        onClose={closeModal}
      >
        <DishForm
          categories={categories}
          onSubmit={(data) => {
            axios
              .post("http://localhost:5000/api/products", data)
              .then(() => {
                closeModal();

                axios
                  .get("http://localhost:5000/api/products")
                  .then((res) => setProducts(res.data));
              })
              .catch((err) => console.log(err));
          }}
        />
        {}
      </Modal>
      <Modal
        id="edit-dish"
        title="Edit dish"
        open={openModalId === "edit-dish"}
        onClose={closeModal}
      >
        <DishForm
          categories={categories}
          onSubmit={(data) => {
            axios
              .post("http://localhost:5000/api/products", data)
              .then(() => {
                closeModal();

                axios
                  .get("http://localhost:5000/api/products")
                  .then((res) => setProducts(res.data));
              })
              .catch((err) => console.log(err));
          }}
        />
        {}
      </Modal>
      <Modal
        id="add-offer"
        title="Add / edit offer"
        open={openModalId === "add-offer"}
        onClose={closeModal}
      >
        <OfferForm
          onSubmit={(data) => {
            axios
              .post("http://localhost:5000/api/offers", data)
              .then(() => {
                closeModal();

                axios
                  .get("http://localhost:5000/api/offers")
                  .then((res) => setOffers(res.data));
              })
              .catch((err) => console.log(err));
          }}
        />
        {}
      </Modal>
      <Modal
        id="add-table"
        title="Add table"
        open={openModalId === "add-table"}
        onClose={closeModal}
      ></Modal>
      <Modal
        id="add-addon"
        title="Add add-on"
        open={openModalId === "add-addon"}
        onClose={closeModal}
      >
        <AddonForm
          categories={categories}
          onSubmit={(data) => {
            axios
              .post("http://localhost:5000/api/addons", data)
              .then(() => {
                closeModal();

                axios.get("http://localhost:5000/api/addons").then((res) => {
                  setAddons(res.data.data);
                });
              })
              .catch((err) => console.log(err));
          }}
        />
        {}
      </Modal>
      <Modal
        id="add-user"
        title="Admin account"
        open={openModalId === "add-user"}
        onClose={closeModal}
      >
        <UserForm onSubmit={closeModal} />
      </Modal>
    </div>
  );
}

/* ---------------- Small building blocks ---------------- */

function NavItem({ view, active, onClick, icon, label, badge }) {
  return (
    <div
      className={`nav-item ${active === view ? "active" : ""}`}
      onClick={() => onClick(view)}
    >
      <i className={`ti ${icon}`} aria-hidden="true" /> {label}
      {typeof badge === "number" && badge > 0 && (
        <span className="nav-badge">{badge}</span>
      )}
    </div>
  );
}

function Modal({ title, open, onClose, children }) {
  return (
    <div
      className={`modal-overlay ${open ? "open" : ""}`}
      style={{ display: open ? "flex" : "none" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <div className="modal-title">
          {title}
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ---------------- Views ---------------- */

function DashboardView({
  orders,
  pendingCount,
  topDishes,
  waiterCalls,
  onResolveCall,
  onViewOrders,
}) {
  return (
    <div>
      <div className="stats-grid">
        <StatCard
          icon="ti-currency-dollar"
          label="Today's revenue"
          value="$1,248"
        />
        <StatCard icon="ti-clipboard-list" label="Orders today" value="34" />

        <StatCard
          icon="ti-clock"
          label="Pending orders"
          value={pendingCount}
          down
        />
      </div>

      <div className="dash-grid">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Recent orders</span>
            <button className="btn-edit" onClick={onViewOrders}>
              View all
            </button>
          </div>
          <div className="card-body">
            {orders.map((o) => (
              <div className="order-row" key={o.id}>
                <span className="order-num">{o.id}</span>
                <span className="order-table">Table {o.table}</span>
                <span className={`status-badge ${STATUS_CLASS[o.status]}`}>
                  {o.status}
                </span>
                <span className="order-amount">
                  ${Number(o.total_price || 0).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Top Dishes Rating</span>
          </div>
          <div className="card-body">
            {topDishes.map((d, i) => (
              <div className="top-dish" key={d.name}>
                <div className="dish-rank">{i + 1}</div>
                <div className="dish-name">
                  {d.name}
                  <div className="dish-orders">{d.orders} orders</div>
                </div>
                <div className="dish-bar-wrap">
                  <div className="dish-bar" style={{ width: `${d.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub, down }) {
  return (
    <div className="stat-card">
      <i className={`ti ${icon} stat-icon`} aria-hidden="true" />
      <div className="stat-label">{label}</div>
      <div className="stat-val">{value}</div>
      <div className={`stat-sub ${down ? "down" : ""}`}>{sub}</div>
    </div>
  );
}

function MenuView({
  categories,
  dishes,
  search,
  setSearch,
  catFilter,
  setCatFilter,
  onAdd,
  onEdit,
  onDelete,
}) {
  console.log("DISHES IN MENU:", dishes);

  return (
    <div>
      <div className="filter-bar">
        <div className="search-box">
          <i className="ti ti-search" aria-hidden="true" />
          <input
            placeholder="Search dishes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="filter-select"
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
        <button className="btn-add" onClick={onAdd}>
          <i className="ti ti-plus" aria-hidden="true" /> Add dish
        </button>
      </div>

      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Dish</th>
              <th>Category</th>
              <th>Price</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dishes.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    textAlign: "center",
                    padding: 24,
                    color: "var(--text3)",
                  }}
                ></td>
              </tr>
            )}
            {dishes.map((d) => (
              <tr key={d.id}>
                <td>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <img className="dish-thumb" src={d.image} alt={d.name} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 12 }}>
                        {d.name}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text3)" }}>
                        {d.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ fontSize: 12, color: "var(--text2)" }}>
                  {d.category}
                </td>
                <td
                  style={{
                    fontWeight: 700,
                    color: "var(--orange)",
                    fontSize: 12,
                  }}
                >
                  ${d.price}
                </td>
                <td style={{ fontSize: 12 }}>⭐ {d.rating || 0}</td>
                {}
                <td>
                  <span
                    className={`avail-tag ${
                      d.is_available ? "avail-yes" : "avail-no"
                    }`}
                  >
                    {d.is_available ? "Available" : "Out of stock"}
                  </span>
                </td>
                <td>
                  <div className="actions">
                    <button className="btn-edit" onClick={onEdit}>
                      <i className="ti ti-edit" aria-hidden="true" />
                    </button>
                    <button className="btn-del" onClick={() => onDelete(d.id)}>
                      {}
                      <i className="ti ti-trash" aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OffersView({ offers, search, setSearch, onAddEdit }) {
  const filteredOffers = offers.filter((o) =>
    o.title.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div>
      <div className="filter-bar">
        <div className="search-box">
          <i className="ti ti-search" aria-hidden="true" />
          <input
            placeholder="Search offers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="filter-select">
          <option>All offers</option>
          <option>Active</option>
          <option>Expired</option>
        </select>
        <button className="btn-add" onClick={onAddEdit}>
          <i className="ti ti-plus" aria-hidden="true" /> Add offer
        </button>
      </div>
      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Offer</th>
              <th>Category</th>
              <th>Old price</th>
              <th>New price</th>
              <th>Discount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOffers.map((o) => (
              <tr key={o.id}>
                <td style={{ fontWeight: 700, fontSize: 12 }}>{o.title}</td>
                <td style={{ fontSize: 12, color: "var(--text2)" }}>
                  {o.category}
                </td>
                <td
                  style={{
                    fontSize: 12,
                    textDecoration: "line-through",
                    color: "var(--text3)",
                  }}
                >
                  ${o.old_price}
                </td>
                <td
                  style={{
                    fontWeight: 700,
                    color: "var(--orange)",
                    fontSize: 12,
                  }}
                >
                  ${o.new_price}
                </td>
                <td>
                  <span
                    className="avail-tag"
                    style={{ background: "#fff3cd", color: "#856404" }}
                  >
                    -{o.discount_percent}%
                  </span>
                </td>
                <td>
                  <div className="actions">
                    <button className="btn-edit" onClick={onAddEdit}>
                      <i className="ti ti-edit" aria-hidden="true" />
                    </button>
                    <button className="btn-del">
                      <i className="ti ti-trash" aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
function OrdersView({ orders, onStatusChange }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filteredOrders = orders.filter((o) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      String(o.id).includes(searchValue) ||
      String(o.table).toLowerCase().includes(searchValue);

    const matchesStatus = !statusFilter || o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="filter-bar">
        <div className="search-box">
          <i className="ti ti-search" aria-hidden="true" />

          <input
            placeholder="Search by order "
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All status</option>
          <option value="Pending">Pending</option>
          <option value="Preparing">Preparing</option>
          <option value="Ready">Ready</option>
          <option value="Served">Served</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Table</th>
              <th>Items</th>
              <th>Total</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>

                <td>{o.table}</td>

                <td>{o.items}</td>

                <td>${Number(o.total_price || 0).toFixed(2)}</td>

                <td>{o.time}</td>

                <td>
                  <span className={`status-badge ${STATUS_CLASS[o.status]}`}>
                    {o.status}
                  </span>
                </td>

                <td>
                  <select
                    className="filter-select"
                    value={o.status}
                    onChange={(e) => onStatusChange(o.id, e.target.value)}
                  >
                    {Object.keys(STATUS_CLASS).map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AddonsView({ addons, onAdd }) {
  console.log(addons);
  console.log(typeof addons);
  console.log(Array.isArray(addons));
  return (
    <div>
      <div className="filter-bar">
        <select className="filter-select">
          <option>All categories</option>
          <option>Italian Kitchen</option>
          <option>Japanese Kitchen</option>
          <option>Korean Kitchen</option>
          <option>Seafood</option>
          <option>Desserts</option>
          <option>Drinks</option>
        </select>
        <button className="btn-add" onClick={onAdd}>
          <i className="ti ti-plus" aria-hidden="true" /> Add add-on
        </button>
      </div>
      <div className="card" style={{ padding: 16 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
            </tr>
          </thead>

          <tbody>
            {addons.map((a) => (
              <tr key={a.id}>
                <td>{a.name}</td>
                <td>${a.price}</td>
                <td>{a.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReviewsView() {
  return (
    <div>
      <div className="filter-bar">
        <select className="filter-select">
          <option>All reviews</option>
          <option>Pending approval</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>
      </div>
      <div className="card" style={{ padding: 16 }}>
        <p style={{ fontSize: 12, color: "var(--text3)" }}>
          TODO API: /api/reviews — ما لقيت جدول reviews بالداتابيس المرسلة، لازم
          تضيفوه أول شي.
        </p>
      </div>
    </div>
  );
}

function AnalyticsView() {
  return (
    <div className="card" style={{ padding: 16 }}>
      <p style={{ fontSize: 12, color: "var(--text3)" }}>
        TODO API: هالقسم بيحتاج endpoint خاص يرجع aggregate مالي (إيرادات،
        طلبات، أعلى الأطباق مبيعًا...) — الأفضل تعملوه بالباك اند كـ query واحد
        بدل ما تحسبوه بالفرونت.
      </p>
    </div>
  );
}

function UsersView({ onAdd }) {
  return (
    <div>
      <div className="filter-bar">
        <button className="btn-add" onClick={onAdd}>
          <i className="ti ti-plus" aria-hidden="true" /> Add admin
        </button>
      </div>
      <div className="card" style={{ padding: 16 }}>
        <p style={{ fontSize: 12, color: "var(--text3)" }}>
          هيدا القسم لازم يستخدم جدول admin_users الموجود عندك بالداتابيس (TODO
          API: GET /api/admins).
        </p>
      </div>
    </div>
  );
}

function SettingsView({ settings, onToggle }) {
  return (
    <div className="settings-sections">
      <div className="setting-card">
        <div className="setting-card-title">
          <i className="ti ti-building-store" aria-hidden="true" /> Restaurant
          info
        </div>
        <div className="form-row">
          <label className="form-label">Restaurant name</label>
          <input className="form-input" defaultValue="ZenBite Restaurant" />
        </div>
        <div className="form-row-2">
          <div className="form-row">
            <label className="form-label">Phone</label>
            <input className="form-input" defaultValue="+1 (555) 000-0000" />
          </div>
          <div className="form-row">
            <label className="form-label">Email</label>
            <input className="form-input" defaultValue="info@zenbite.com" />
          </div>
        </div>
        <button className="form-submit">Save changes</button>
      </div>

      <div className="setting-card">
        <div className="setting-card-title">
          <i className="ti ti-adjustments" aria-hidden="true" /> App settings
        </div>
        <ToggleRow
          label="Waiter call notifications"
          desc="Alert when a table calls for a waiter"
          checked={settings.waiterCallNotif}
          onToggle={() => onToggle("waiterCallNotif")}
        />
        <ToggleRow
          label="New order notifications"
          desc="Alert when a new order is placed"
          checked={settings.newOrderNotif}
          onToggle={() => onToggle("newOrderNotif")}
        />
        <ToggleRow
          label="Auto-print orders"
          desc="Automatically print to kitchen printer"
          checked={settings.autoPrint}
          onToggle={() => onToggle("autoPrint")}
        />
      </div>

      <div className="setting-card">
        <div className="setting-card-title">
          <i className="ti ti-credit-card" aria-hidden="true" /> Payment methods
        </div>
        <ToggleRow
          label="Cash on delivery"
          checked={settings.cashOnDelivery}
          onToggle={() => onToggle("cashOnDelivery")}
        />
        <ToggleRow
          label="Credit / debit card"
          checked={settings.card}
          onToggle={() => onToggle("card")}
        />
        <ToggleRow
          label="Apple Pay / Google Pay"
          checked={settings.digitalWallet}
          onToggle={() => onToggle("digitalWallet")}
        />
      </div>
    </div>
  );
}

function ToggleRow({ label, desc, checked, onToggle }) {
  return (
    <div className="setting-row">
      <div>
        <div className="setting-row-label">{label}</div>
        {desc && <div className="setting-row-desc">{desc}</div>}
      </div>
      <button
        className={`toggle ${checked ? "on" : ""}`}
        onClick={onToggle}
        aria-label={`Toggle ${label}`}
      />
    </div>
  );
}

/* ---------------- Forms (تحتاج ربط API فعلي عند الحفظ) ---------------- */
function DishForm({ categories, onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    name_ar: "",
    description: "",
    description_ar: "",
    price: "",
    image: "",
    category_id: "",
    calories: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        if (!form.category_id) {
          alert("Choose category first");
          return;
        }

        console.log("DATA SENT:", form);

        onSubmit(form);
      }}
    >
      <input
        className="form-input"
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
      />

      <input
        className="form-input"
        name="name_ar"
        placeholder="Arabic Name"
        value={form.name_ar}
        onChange={handleChange}
      />

      <input
        className="form-input"
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
      />

      <input
        className="form-input"
        name="description_ar"
        placeholder="Arabic Description"
        value={form.description_ar}
        onChange={handleChange}
      />

      <input
        className="form-input"
        name="price"
        type="number"
        placeholder="Price"
        value={form.price}
        onChange={handleChange}
      />

      <input
        className="form-input"
        name="image"
        placeholder="Image URL"
        value={form.image}
        onChange={handleChange}
      />

      <select
        className="form-input"
        name="category_id"
        value={form.category_id}
        onChange={handleChange}
      >
        <option value="">Choose category</option>

        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <input
        className="form-input"
        name="calories"
        type="number"
        placeholder="Calories"
        value={form.calories}
        onChange={handleChange}
      />

      <button className="form-submit">Save dish</button>
    </form>
  );
}

function OfferForm({ onSubmit }) {
  const [form, setForm] = useState({
    title: "",
    old_price: "",
    new_price: "",
    discount_percent: "",
    category_id: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        console.log("OFFER DATA:", form);
        onSubmit(form);
      }}
    >
      <div className="form-row">
        <label className="form-label">Title (English)</label>
        <input
          className="form-input"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Pizza & Fries Combo"
        />
      </div>

      <div className="form-row-2">
        <div className="form-row">
          <label className="form-label">Old price ($)</label>
          <input
            className="form-input"
            type="number"
            name="old_price"
            value={form.old_price}
            onChange={handleChange}
            placeholder="33.99"
          />
        </div>

        <div className="form-row">
          <label className="form-label">New price ($)</label>
          <input
            className="form-input"
            type="number"
            name="new_price"
            value={form.new_price}
            onChange={handleChange}
            placeholder="24.99"
          />
        </div>
      </div>

      <div className="form-row">
        <label className="form-label">Discount %</label>
        <input
          className="form-input"
          type="number"
          name="discount_percent"
          value={form.discount_percent}
          onChange={handleChange}
          placeholder="20"
        />
      </div>

      <button className="form-submit">Save offer</button>
    </form>
  );
}

function AddonForm({ categories, onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    category_id: "",
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        console.log("ADDON DATA:", form);
        onSubmit(form);
      }}
    >
      <input
        className="form-input"
        placeholder="Addon name"
        value={form.name}
        onChange={(e) =>
          setForm({
            ...form,
            name: e.target.value,
          })
        }
      />

      <input
        className="form-input"
        type="number"
        placeholder="Price"
        value={form.price}
        onChange={(e) =>
          setForm({
            ...form,
            price: e.target.value,
          })
        }
      />

      <select
        className="form-input"
        value={form.category_id}
        onChange={(e) =>
          setForm({
            ...form,
            category_id: e.target.value,
          })
        }
      >
        <option value="">Choose category</option>

        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <button className="form-submit">Add addon</button>
    </form>
  );
}

function UserForm({ onSubmit }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(); /* TODO API: POST /api/admins */
      }}
    >
      <div className="form-row">
        <label className="form-label">Full name</label>
        <input className="form-input" placeholder="Admin Name" />
      </div>
      <div className="form-row">
        <label className="form-label">Email</label>
        <input
          className="form-input"
          type="email"
          placeholder="admin@zenbite.com"
        />
      </div>
      <div className="form-row">
        <label className="form-label">Password</label>
        <input
          className="form-input"
          type="password"
          placeholder="Min. 8 characters"
        />
      </div>
      <button className="form-submit" type="submit">
        Save account
      </button>
    </form>
  );
}
