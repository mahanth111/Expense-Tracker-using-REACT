export const CATEGORY_COLORS = {
  Food: "#00cec9",
  Travel: "#74b9ff",
  Shopping: "#fd79a8",
  Bills: "#ffeaa7",
  Other: "#a29bfe",
  Subscriptions: "#bdc3c7"
};

// helper: returns color (fallback to Other)
export const getCategoryColor = (category) =>
  CATEGORY_COLORS[category] || CATEGORY_COLORS["Other"];
