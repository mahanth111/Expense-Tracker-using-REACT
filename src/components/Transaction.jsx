// src/components/Transaction.jsx
import React from "react";
import { getCategoryColor } from "../categoryColors";

export const Transaction = ({ transaction, deleteTransaction, isDelete }) => {
  const sign = transaction.amount < 0 ? "-" : "+";
  const category = transaction.category || "Other";
  const color = getCategoryColor(category);

  const getFormattedDateTime = () => {
    if (!transaction.createdAt) return "";

    const d =
      typeof transaction.createdAt.toDate === "function"
        ? transaction.createdAt.toDate()
        : new Date(transaction.createdAt);

    const date = d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const time = d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return `${date} • ${time}`;
  };

  const liStyle = {
    borderLeftColor: color,
  };

  const tagStyle = {
    backgroundColor: `${color}22`,
    color: color,
    border: `1px solid ${color}`,
    padding: "2px 8px",
    borderRadius: "6px",
    marginLeft: "10px",
    fontWeight: 600,
    fontSize: "12px",
  };

  return (
    <li
      className={transaction.amount < 0 ? "minus" : "plus"}
      style={liStyle}
    >
      {/* LEFT SIDE — FORCE LEFT ALIGN IN RECENT HISTORY */}
      <div
        style={{
          textAlign: "left",
          flex: isDelete ? "initial" : 1, // 🔑 key fix
        }}
      >
        {transaction.text}
        {transaction.category && (
          <span className="category-tag" style={tagStyle}>
            {transaction.category}
          </span>
        )}
      </div>

      {/* AMOUNT */}
      <span className="txn-amount">
        {sign}₹{Math.abs(transaction.amount)}
      </span>

      {/* RIGHT SIDE (Delete + Date) — ONLY IN FULL HISTORY */}
      {isDelete && (
        <div className="txn-right">
          <button
            className="delete-btn"
            onClick={() => deleteTransaction(transaction.id)}
          >
            x
          </button>

          <span className="txn-separator">|</span>

          <span className="txn-date">{getFormattedDateTime()}</span>
        </div>
      )}
    </li>
  );
};
