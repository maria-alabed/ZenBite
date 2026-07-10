import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/admin.css";

/*
  لوحة تحكم الأدمن — نسخة React كاملة.

  شو صار متوصل فعليًا بالـ API (نفس الـ endpoints المستخدمة بباقي المشروع):
    - /api/categories        -> جدول "الأصناف" وفلتر صفحة الأطباق
    - /api/offers             -> جدول "العروض"

  شو لسا mock/محلي (لأنه ما كان في endpoints واضحة بالفرونت المرسل):
    - orders, tables, addons, reviews, analytics, admin users
    كل قسم من هدول عليه تعليق "// TODO API" بمكان الـ fetch يلي لازم تضيفو،
    والشكل يلي البيانات لازم توصل فيه (نفس أسماء الحقول تقريبًا متل جدول الداتابيس).
*/

const NAV_TITLES = {
  dashboard: "Dashboard",
  menu: "Menu items",
  offers: "Offers",
  orders: "Orders",
  tables: "Tables",
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

const MOCK_ORDERS = [
  { id: "#0034", table: "T03", items: "Dragon Roll ×2, Miso Ramen", total: 42.5, time: "2 min ago", status: "Pending" },
  { id: "#0033", table: "T01", items: "Pad Thai, Green Curry, Bubble Tea", total: 28.99, time: "8 min ago", status: "Preparing" },
  { id: "#0032", table: "T07", items: "Korean BBQ Feast (offer)", total: 27.99, time: "14 min ago", status: "Ready" },
  { id: "#0031", table: "T04", items: "Bibimbap ×2, Kimchi Pancake", total: 38.97, time: "22 min ago", status: "Served" },
  { id: "#0030", table: "T02", items: "Lobster Thermidor, Seafood Paella", total: 57.98, time: "35 min ago", status: "Completed" },
];

const MOCK_TABLES = [
  { num: "T01", cap: 4, occupied: true }, { num: "T02", cap: 4, occupied: false },
  { num: "T03", cap: 6, occupied: true }, { num: "T04", cap: 2, occupied: true },
  { num: "T05", cap: 6, occupied: false }, { num: "T06", cap: 8, occupied: true },
  { num: "T07", cap: 4, occupied: true }, { num: "T08", cap: 4, occupied: false },
  { num: "T09", cap: 4, occupied: true }, { num: "T10", cap: 6, occupied: false },
];

const MOCK_WAITER_CALLS = [
  { id: 1, table: "T02", time: "2 min ago" },
  { id: 2, table: "T05", time: "5 min ago" },
];

const MOCK_TOP_DISHES = [
  { name: "Dragon Roll", orders: 18, pct: 90 },
  { name: "Margherita Pizza", orders: 14, pct: 70 },
  { name: "Pad Thai", orders: 12, pct: 60 },
  { name: "Korean BBQ", orders: 9, pct: 45 },
  { name: "Bubble Tea", orders: 8, pct: 40 },
];

/* ---------------- Component ---------------- */

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState("dashboard");
  const [openModalId, setOpenModalId] = useState(null);
  const navigate = useNavigate();

  // بيانات حقيقية من الـ API
  const [categories, setCategories] = useState([]);
  const [offers, setOffers] = useState([]);

  // بيانات mock لحد ما تضيفو الـ endpoints
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [waiterCalls, setWaiterCalls] = useState(MOCK_WAITER_CALLS);
  const [tables] = useState(MOCK_TABLES);

  // فلاتر صفحة الأطباق
  const [menuSearch, setMenuSearch] = useState("");
  const [menuCatFilter, setMenuCatFilter] = useState("");

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
    axios
      .get("http://localhost:5000/api/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err));

    axios
      .get("http://localhost:5000/api/offers")
      .then((res) => setOffers(res.data))
      .catch((err) => console.error(err));

    // TODO API: بدّل هيدا بـ axios.get("http://localhost:5000/api/orders")
    // TODO API: بدّل هيدا بـ axios.get("http://localhost:5000/api/tables")
  }, []);

  const pendingCount = useMemo(
    () => orders.filter((o) => o.status === "Pending").length,
    [orders],
  );

  const filteredMenu = useMemo(() => {
    // ملاحظة: هون لازم يصير عندك state لكل الأطباق (مو بس الفئات) جايي من
    // /api/products عشان الجدول يعرض شي حقيقي. حاليًا الجدول فاضي إذا معك بس categories.
    return [];
  }, [menuSearch, menuCatFilter]);

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
    );
    // TODO API: axios.put(`http://localhost:5000/api/orders/${orderId}`, { status: newStatus })
  };

  const resolveCall = (id) => {
    setWaiterCalls((prev) => prev.filter((c) => c.id !== id));
    // TODO API: axios.post(`http://localhost:5000/api/waiter-calls/${id}/resolve`)
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
      <h2 className="sr-only">ZenBite admin dashboard with 9 management sections</h2>

      <div className="admin-shell">
        {/* SIDEBAR */}
        <div className="sidebar">
          <div className="logo">
            <div className="logo-name">ZenBite</div>
            <div className="logo-sub">Admin Panel</div>
          </div>

          <NavItem view="dashboard" active={activeView} onClick={setActiveView} icon="ti-layout-dashboard" label="Dashboard" />

          <div className="nav-section">Management</div>
          <NavItem view="menu" active={activeView} onClick={setActiveView} icon="ti-tools-kitchen-2" label="Menu items" />
          <NavItem view="offers" active={activeView} onClick={setActiveView} icon="ti-tag" label="Offers" />
          <NavItem view="orders" active={activeView} onClick={setActiveView} icon="ti-clipboard-list" label="Orders" badge={pendingCount} />
          <NavItem view="tables" active={activeView} onClick={setActiveView} icon="ti-layout-grid" label="Tables" />
          <NavItem view="addons" active={activeView} onClick={setActiveView} icon="ti-plus" label="Add-ons" />
          <NavItem view="reviews" active={activeView} onClick={setActiveView} icon="ti-star" label="Reviews" />

          <div className="nav-section">Reports</div>
          <NavItem view="analytics" active={activeView} onClick={setActiveView} icon="ti-chart-bar" label="Analytics" />

          <div className="nav-section">System</div>
          <NavItem view="users" active={activeView} onClick={setActiveView} icon="ti-users" label="Admins" />
          <NavItem view="settings" active={activeView} onClick={setActiveView} icon="ti-settings" label="Settings" />

          <div className="sidebar-footer">
            <div className="admin-info">
              <div className="admin-avatar">
                {adminData?.name ? adminData.name.charAt(0).toUpperCase() : "SA"}
              </div>
              <div>
                <div className="admin-name">{adminData?.name || "Super Admin"}</div>
                <div className="admin-role">{adminData?.email || "admin@zenbite.com"}</div>
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
                <button className="topbar-btn" onClick={() => setActiveView("orders")}>
                  <i className="ti ti-bell" aria-hidden="true" /> {pendingCount} new
                  {pendingCount > 0 && <div className="notif-dot" />}
                </button>
              </div>
              <button className="topbar-btn" onClick={() => window.open("/", "_blank")}>
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
                topDishes={MOCK_TOP_DISHES}
                waiterCalls={waiterCalls}
                onResolveCall={resolveCall}
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
              <OffersView offers={offers} onAddEdit={() => openModal("add-offer")} />
            )}

            {activeView === "orders" && (
              <OrdersView orders={orders} onStatusChange={updateOrderStatus} />
            )}

            {activeView === "tables" && (
              <TablesView tables={tables} onAdd={() => openModal("add-table")} />
            )}

            {activeView === "addons" && <AddonsView onAdd={() => openModal("add-addon")} />}

            {activeView === "reviews" && <ReviewsView />}

            {activeView === "analytics" && <AnalyticsView />}

            {activeView === "users" && <UsersView onAdd={() => openModal("add-user")} />}

            {activeView === "settings" && (
              <SettingsView settings={settings} onToggle={toggleSetting} />
            )}
          </div>
        </div>
      </div>

      {/* MODALS */}
      <Modal id="add-dish" title="Add new dish" open={openModalId === "add-dish"} onClose={closeModal}>
        <DishForm onSubmit={closeModal} />
      </Modal>
      <Modal id="edit-dish" title="Edit dish" open={openModalId === "edit-dish"} onClose={closeModal}>
        <DishForm onSubmit={closeModal} />
      </Modal>
      <Modal id="add-offer" title="Add / edit offer" open={openModalId === "add-offer"} onClose={closeModal}>
        <OfferForm onSubmit={closeModal} />
      </Modal>
      <Modal id="add-table" title="Add table" open={openModalId === "add-table"} onClose={closeModal}>
        <TableForm onSubmit={closeModal} />
      </Modal>
      <Modal id="add-addon" title="Add add-on" open={openModalId === "add-addon"} onClose={closeModal}>
        <AddonForm onSubmit={closeModal} />
      </Modal>
      <Modal id="add-user" title="Admin account" open={openModalId === "add-user"} onClose={closeModal}>
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
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ---------------- Views ---------------- */

function DashboardView({ orders, pendingCount, topDishes, waiterCalls, onResolveCall, onViewOrders }) {
  return (
    <div>
      <div className="stats-grid">
        <StatCard icon="ti-currency-dollar" label="Today's revenue" value="$1,248" sub="↑ 12% vs yesterday" />
        <StatCard icon="ti-clipboard-list" label="Orders today" value="34" sub="↑ 8% vs yesterday" />
        <StatCard icon="ti-layout-grid" label="Tables active" value="6/10" sub="4 available" />
        <StatCard icon="ti-clock" label="Pending orders" value={pendingCount} sub="Need attention" down />
      </div>

      <div className="dash-grid">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Recent orders</span>
            <button className="btn-edit" onClick={onViewOrders}>View all</button>
          </div>
          <div className="card-body">
            {orders.map((o) => (
              <div className="order-row" key={o.id}>
                <span className="order-num">{o.id}</span>
                <span className="order-table">Table {o.table}</span>
                <span className={`status-badge ${STATUS_CLASS[o.status]}`}>{o.status}</span>
                <span className="order-amount">${o.total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><span className="card-title">Top dishes today</span></div>
          <div className="card-body">
            {topDishes.map((d, i) => (
              <div className="top-dish" key={d.name}>
                <div className="dish-rank">{i + 1}</div>
                <div className="dish-name">{d.name}<div className="dish-orders">{d.orders} orders</div></div>
                <div className="dish-bar-wrap"><div className="dish-bar" style={{ width: `${d.pct}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="waiter-calls">
        <div className="card-header" style={{ padding: "0 0 12px", border: "none" }}>
          <span className="card-title">Waiter calls</span>
        </div>
        {waiterCalls.length === 0 && (
          <p style={{ fontSize: 12, color: "var(--text3)" }}>No active calls 🎉</p>
        )}
        {waiterCalls.map((c) => (
          <div className="waiter-row" key={c.id}>
            <div className="waiter-icon"><i className="ti ti-bell" aria-hidden="true" /></div>
            <div className="waiter-text">
              <div style={{ fontSize: 12, fontWeight: 700 }}>Table {c.table}</div>
              <div className="waiter-time">{c.time}</div>
            </div>
            <button className="btn-xs btn-resolve" onClick={() => onResolveCall(c.id)}>Resolve</button>
          </div>
        ))}
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

function MenuView({ categories, dishes, search, setSearch, catFilter, setCatFilter, onAdd, onEdit }) {
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
        <select className="filter-select" value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
        <button className="btn-add" onClick={onAdd}><i className="ti ti-plus" aria-hidden="true" /> Add dish</button>
      </div>

      <div className="card">
        <table className="data-table">
          <thead>
            <tr><th>Dish</th><th>Category</th><th>Price</th><th>Rating</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {dishes.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: 24, color: "var(--text3)" }}>
                  ما في أطباق — لسا لازم توصلو هالجدول بـ /api/products (TODO API)
                </td>
              </tr>
            )}
            {dishes.map((d) => (
              <tr key={d.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <img className="dish-thumb" src={d.image} alt={d.name} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 12 }}>{d.name}</div>
                      <div style={{ fontSize: 11, color: "var(--text3)" }}>{d.description}</div>
                    </div>
                  </div>
                </td>
                <td style={{ fontSize: 12, color: "var(--text2)" }}>{d.category}</td>
                <td style={{ fontWeight: 700, color: "var(--orange)", fontSize: 12 }}>${d.price}</td>
                <td style={{ fontSize: 12 }}>⭐ {d.rating}</td>
                <td>
                  <span className={`avail-tag ${d.availability === "out_of_stock" ? "avail-no" : "avail-yes"}`}>
                    {d.availability === "out_of_stock" ? "Out of stock" : "Available"}
                  </span>
                </td>
                <td>
                  <div className="actions">
                    <button className="btn-edit" onClick={onEdit}><i className="ti ti-edit" aria-hidden="true" /></button>
                    <button className="btn-del"><i className="ti ti-trash" aria-hidden="true" /></button>
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

function OffersView({ offers, onAddEdit }) {
  return (
    <div>
      <div className="filter-bar">
        <div className="search-box"><i className="ti ti-search" aria-hidden="true" /><input placeholder="Search offers..." /></div>
        <select className="filter-select"><option>All offers</option><option>Active</option><option>Expired</option></select>
        <button className="btn-add" onClick={onAddEdit}><i className="ti ti-plus" aria-hidden="true" /> Add offer</button>
      </div>
      <div className="card">
        <table className="data-table">
          <thead>
            <tr><th>Offer</th><th>Category</th><th>Old price</th><th>New price</th><th>Discount</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {offers.map((o) => (
              <tr key={o.id}>
                <td style={{ fontWeight: 700, fontSize: 12 }}>{o.title}</td>
                <td style={{ fontSize: 12, color: "var(--text2)" }}>{o.category}</td>
                <td style={{ fontSize: 12, textDecoration: "line-through", color: "var(--text3)" }}>${o.old_price}</td>
                <td style={{ fontWeight: 700, color: "var(--orange)", fontSize: 12 }}>${o.new_price}</td>
                <td><span className="avail-tag" style={{ background: "#fff3cd", color: "#856404" }}>-{o.discount_percent}%</span></td>
                <td>
                  <div className="actions">
                    <button className="btn-edit" onClick={onAddEdit}><i className="ti ti-edit" aria-hidden="true" /></button>
                    <button className="btn-del"><i className="ti ti-trash" aria-hidden="true" /></button>
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
  return (
    <div>
      <div className="filter-bar">
        <div className="search-box"><i className="ti ti-search" aria-hidden="true" /><input placeholder="Search by order # or table..." /></div>
        <select className="filter-select">
          <option value="">All status</option>
          <option>Pending</option><option>Preparing</option><option>Ready</option>
          <option>Served</option><option>Completed</option><option>Cancelled</option>
        </select>
      </div>
      <div className="card">
        <table className="data-table">
          <thead>
            <tr><th>Order #</th><th>Table</th><th>Items</th><th>Total</th><th>Time</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td style={{ fontWeight: 700, color: "var(--orange)", fontSize: 12 }}>{o.id}</td>
                <td style={{ fontSize: 12, fontWeight: 600 }}>{o.table}</td>
                <td style={{ fontSize: 11, color: "var(--text2)" }}>{o.items}</td>
                <td style={{ fontWeight: 700, fontSize: 12 }}>${o.total.toFixed(2)}</td>
                <td style={{ fontSize: 11, color: "var(--text3)" }}>{o.time}</td>
                <td><span className={`status-badge ${STATUS_CLASS[o.status]}`}>{o.status}</span></td>
                <td>
                  <select
                    className="filter-select"
                    style={{ padding: "4px 6px", fontSize: 11 }}
                    value={o.status}
                    onChange={(e) => onStatusChange(o.id, e.target.value)}
                  >
                    {Object.keys(STATUS_CLASS).map((s) => (
                      <option key={s} value={s}>{s}</option>
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

function TablesView({ tables, onAdd }) {
  return (
    <div>
      <div className="filter-bar">
        <div className="search-box"><i className="ti ti-search" aria-hidden="true" /><input placeholder="Search table..." /></div>
        <button className="btn-add" onClick={onAdd}><i className="ti ti-plus" aria-hidden="true" /> Add table</button>
      </div>
      <div className="tables-grid">
        {tables.map((t) => (
          <div key={t.num} className={`table-card ${t.occupied ? "occupied" : "available"}`}>
            <button className="qr-btn" title="Print QR"><i className="ti ti-qrcode" aria-hidden="true" /></button>
            <div className="table-status-dot" />
            <div className="table-num">{t.num}</div>
            <div className="table-cap">{t.cap} seats · {t.occupied ? "Occupied" : "Available"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AddonsView({ onAdd }) {
  return (
    <div>
      <div className="filter-bar">
        <select className="filter-select">
          <option>All categories</option><option>Italian Kitchen</option><option>Japanese Kitchen</option>
          <option>Korean Kitchen</option><option>Seafood</option><option>Desserts</option><option>Drinks</option>
        </select>
        <button className="btn-add" onClick={onAdd}><i className="ti ti-plus" aria-hidden="true" /> Add add-on</button>
      </div>
      <div className="card" style={{ padding: 16 }}>
        <p style={{ fontSize: 12, color: "var(--text3)" }}>
          وصّلو هالقسم بـ /api/addons (TODO API) عشان يطلع نفس الإضافات المستخدمة بصفحة تفاصيل المنتج.
        </p>
      </div>
    </div>
  );
}

function ReviewsView() {
  return (
    <div>
      <div className="filter-bar">
        <select className="filter-select"><option>All reviews</option><option>Pending approval</option><option>Approved</option><option>Rejected</option></select>
      </div>
      <div className="card" style={{ padding: 16 }}>
        <p style={{ fontSize: 12, color: "var(--text3)" }}>
          TODO API: /api/reviews — ما لقيت جدول reviews بالداتابيس المرسلة، لازم تضيفوه أول شي.
        </p>
      </div>
    </div>
  );
}

function AnalyticsView() {
  return (
    <div className="card" style={{ padding: 16 }}>
      <p style={{ fontSize: 12, color: "var(--text3)" }}>
        TODO API: هالقسم بيحتاج endpoint خاص يرجع aggregate مالي (إيرادات، طلبات، أعلى الأطباق مبيعًا...) —
        الأفضل تعملوه بالباك اند كـ query واحد بدل ما تحسبوه بالفرونت.
      </p>
    </div>
  );
}

function UsersView({ onAdd }) {
  return (
    <div>
      <div className="filter-bar">
        <button className="btn-add" onClick={onAdd}><i className="ti ti-plus" aria-hidden="true" /> Add admin</button>
      </div>
      <div className="card" style={{ padding: 16 }}>
        <p style={{ fontSize: 12, color: "var(--text3)" }}>
          هيدا القسم لازم يستخدم جدول admin_users الموجود عندك بالداتابيس (TODO API: GET /api/admins).
        </p>
      </div>
    </div>
  );
}

function SettingsView({ settings, onToggle }) {
  return (
    <div className="settings-sections">
      <div className="setting-card">
        <div className="setting-card-title"><i className="ti ti-building-store" aria-hidden="true" /> Restaurant info</div>
        <div className="form-row"><label className="form-label">Restaurant name</label><input className="form-input" defaultValue="ZenBite Restaurant" /></div>
        <div className="form-row-2">
          <div className="form-row"><label className="form-label">Phone</label><input className="form-input" defaultValue="+1 (555) 000-0000" /></div>
          <div className="form-row"><label className="form-label">Email</label><input className="form-input" defaultValue="info@zenbite.com" /></div>
        </div>
        <button className="form-submit">Save changes</button>
      </div>

      <div className="setting-card">
        <div className="setting-card-title"><i className="ti ti-adjustments" aria-hidden="true" /> App settings</div>
        <ToggleRow label="Waiter call notifications" desc="Alert when a table calls for a waiter" checked={settings.waiterCallNotif} onToggle={() => onToggle("waiterCallNotif")} />
        <ToggleRow label="New order notifications" desc="Alert when a new order is placed" checked={settings.newOrderNotif} onToggle={() => onToggle("newOrderNotif")} />
        <ToggleRow label="Auto-print orders" desc="Automatically print to kitchen printer" checked={settings.autoPrint} onToggle={() => onToggle("autoPrint")} />
      </div>

      <div className="setting-card">
        <div className="setting-card-title"><i className="ti ti-credit-card" aria-hidden="true" /> Payment methods</div>
        <ToggleRow label="Cash on delivery" checked={settings.cashOnDelivery} onToggle={() => onToggle("cashOnDelivery")} />
        <ToggleRow label="Credit / debit card" checked={settings.card} onToggle={() => onToggle("card")} />
        <ToggleRow label="Apple Pay / Google Pay" checked={settings.digitalWallet} onToggle={() => onToggle("digitalWallet")} />
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
      <button className={`toggle ${checked ? "on" : ""}`} onClick={onToggle} aria-label={`Toggle ${label}`} />
    </div>
  );
}

/* ---------------- Forms (تحتاج ربط API فعلي عند الحفظ) ---------------- */

function DishForm({ onSubmit }) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); /* TODO API: POST /api/products */ }}>
      <div className="form-row"><label className="form-label">Name (English)</label><input className="form-input" placeholder="e.g. Dragon Roll" /></div>
      <div className="form-row"><label className="form-label">Name (Arabic)</label><input className="form-input" placeholder="e.g. دراغون رول" /></div>
      <div className="form-row-2">
        <div className="form-row"><label className="form-label">Base price ($)</label><input className="form-input" type="number" placeholder="12.99" /></div>
        <div className="form-row"><label className="form-label">Calories</label><input className="form-input" type="number" placeholder="320" /></div>
      </div>
      <div className="form-row"><label className="form-label">Image URL</label><input className="form-input" placeholder="https://..." /></div>
      <button className="form-submit" type="submit">Save dish</button>
    </form>
  );
}

function OfferForm({ onSubmit }) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); /* TODO API: POST /api/offers */ }}>
      <div className="form-row"><label className="form-label">Title (English)</label><input className="form-input" placeholder="e.g. Pizza & Fries Combo" /></div>
      <div className="form-row-2">
        <div className="form-row"><label className="form-label">Old price ($)</label><input className="form-input" type="number" placeholder="33.99" /></div>
        <div className="form-row"><label className="form-label">New price ($)</label><input className="form-input" type="number" placeholder="24.99" /></div>
      </div>
      <button className="form-submit" type="submit">Save offer</button>
    </form>
  );
}

function TableForm({ onSubmit }) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); /* TODO API: POST /api/tables */ }}>
      <div className="form-row"><label className="form-label">Table number</label><input className="form-input" placeholder="e.g. T11" /></div>
      <div className="form-row"><label className="form-label">Capacity (seats)</label><input className="form-input" type="number" placeholder="4" /></div>
      <button className="form-submit" type="submit">Add table</button>
    </form>
  );
}

function AddonForm({ onSubmit }) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); /* TODO API: POST /api/addons */ }}>
      <div className="form-row"><label className="form-label">Name (English)</label><input className="form-input" placeholder="Extra Cheese" /></div>
      <div className="form-row-2">
        <div className="form-row"><label className="form-label">Price ($)</label><input className="form-input" type="number" placeholder="1.50" /></div>
        <div className="form-row"><label className="form-label">Emoji</label><input className="form-input" placeholder="🧀" /></div>
      </div>
      <button className="form-submit" type="submit">Add add-on</button>
    </form>
  );
}

function UserForm({ onSubmit }) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); /* TODO API: POST /api/admins */ }}>
      <div className="form-row"><label className="form-label">Full name</label><input className="form-input" placeholder="Admin Name" /></div>
      <div className="form-row"><label className="form-label">Email</label><input className="form-input" type="email" placeholder="admin@zenbite.com" /></div>
      <div className="form-row"><label className="form-label">Password</label><input className="form-input" type="password" placeholder="Min. 8 characters" /></div>
      <button className="form-submit" type="submit">Save account</button>
    </form>
  );
}