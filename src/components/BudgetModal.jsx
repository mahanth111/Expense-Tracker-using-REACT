import React, { useState } from "react";

const categories = ["Food", "Travel", "Shopping", "Bills"];

const BudgetModal = ({ budgets, setBudget, deleteBudget }) => {
  const [category, setCategory] = useState(categories[0]);
  const [amount, setAmount] = useState("");

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!amount) return alert("Enter a valid budget amount");

    await setBudget(category, Number(amount));
    setAmount("");
  };

  return (
    <div style={{ maxHeight: "70vh", overflowY: "auto", padding: "10px" }}>

      <h2 style={{ marginBottom: "15px", textAlign: "center" }}>
        Monthly Budgets
      </h2>

      <div
        style={{
          background: "rgba(255,255,255,0.08)",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "20px",
          border: "1px solid rgba(255,255,255,0.15)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
      >
        <h3 style={{ marginBottom: "12px" }}>Set a New Budget</h3>

        <form
          onSubmit={handleAdd}
          style={{ display: "flex", flexDirection: "column", gap: "10px" }}
        >
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #aaa",
              background: "#fff",
            }}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Set monthly limit"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #aaa",
            }}
          />

          <button
            className="btn"
            type="submit"
            style={{
              marginTop: "5px",
              padding: "10px",
              background: "linear-gradient(135deg, #7b61ff, #9f79ff)",
              borderRadius: "8px",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Save Budget
          </button>
        </form>
      </div>

      <h3 style={{ marginBottom: "10px" }}>Your Budgets</h3>

      {Object.keys(budgets).length === 0 && (
        <p style={{ opacity: 0.7 }}>No budgets set yet.</p>
      )}

      <ul style={{ listStyle: "none", padding: 0, marginTop: "10px" }}>
        {Object.entries(budgets).map(([cat, amt]) => (
          <li
            key={cat}
            style={{
              padding: "15px",
              marginBottom: "12px",
              borderRadius: "12px",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <span
                  style={{
                    background: "#7b61ff",
                    padding: "5px 10px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    color: "#fff",
                  }}
                >
                  {cat}
                </span>
                <p style={{ margin: "8px 0 0 0", fontSize: "15px" }}>
                  Monthly Limit: <strong>₹{amt}</strong>
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <button
                  className="btn"
                  onClick={() => {
                    const newAmount = prompt(`Update budget for ${cat}`, amt);
                    if (newAmount) setBudget(cat, Number(newAmount));
                  }}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "8px",
                    background: "#4A90E2",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Update
                </button>

                <button
                  className="btn"
                  onClick={() => {
                    if (confirm("Delete this budget?")) deleteBudget(cat);
                  }}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "8px",
                    background: "#FF5C5C",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

    </div>
  );
};

export default BudgetModal;
