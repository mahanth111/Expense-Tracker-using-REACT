// src/categoryColors.js
export const CATEGORY_COLORS = {
  Food: "#00cec9",
  Travel: "#74b9ff",
  Shopping: "#fd79a8",
  Bills: "#ffeaa7",
  Entertainment: "#b6faa0",
  Other: "#a29bfe",
  Subscriptions: "#bdc3c7"   // <<< NEW: Grey color
};

// helper: returns color (fallback to Other)
export const getCategoryColor = (category) =>
  CATEGORY_COLORS[category] || CATEGORY_COLORS["Other"];
