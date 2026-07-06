export function CaloriesBadge({ calories }) {
  if (!calories) return null;

  let color = "#27ae60";
  let bg = "#e8f8ed";
  if (calories > 500) {
    color = "#e67e22";
    bg = "#fef5e8";
  }
  if (calories > 800) {
    color = "#e74c3c";
    bg = "#fde8e8";
  }

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 14px",
        borderRadius: "20px",
        fontSize: "13px",
        fontWeight: 600,
        color: color,
        background: bg,
        border: `1px solid ${color}30`,
        marginBottom: "8px",
      }}
    >
      🔥 {calories} kcal
    </div>
  );
}

export function AvailabilityBadge({ availability }) {
  if (availability !== "out_of_stock") return null;

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 12px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: 600,
        color: "#e74c3c",
        background: "#fde8e8",
        border: "1px solid #e74c3c",
        marginBottom: "8px",
      }}
    >
      ❌ Out of Stock
    </div>
  );
}
