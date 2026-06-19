const BASE_URL = "http://localhost:5000/api";

export const getMenu = async () => {
  try {
    const res = await fetch(`${BASE_URL}/menu`);
    if (!res.ok) throw new Error("Failed to fetch menu");

    return await res.json();
  } catch (error) {
    console.error("Menu API error:", error);
    return [];
  }
};