// src/components/AddTransaction.jsx
import React, { useState, useEffect, useRef } from "react";

export const AddTransaction = ({ addTransaction, addSubscription }) => {
  // transaction fields (original)
  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  // subscription fields
  const [subName, setSubName] = useState("");
  const [subAmount, setSubAmount] = useState("");
  const [subCycle, setSubCycle] = useState("monthly");
  const [subNextRenewal, setSubNextRenewal] = useState("");

  // active mode: "transaction" or "subscription"
  const [mode, setMode] = useState("transaction");

  // keep subscription name auto-filled from text when switching if empty
  useEffect(() => {
    if (mode === "subscription" && (subName === "" || subName === text)) {
      setSubName(text);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, text]);

  // keep modal content height stable: compute max of both forms' heights and apply as minHeight
  const txRef = useRef(null);
  const subRef = useRef(null);
  const [minHeight, setMinHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      const h1 = txRef.current ? txRef.current.offsetHeight : 0;
      const h2 = subRef.current ? subRef.current.offsetHeight : 0;
      const maxH = Math.max(h1, h2, 240); // fallback
      setMinHeight(maxH);
    };

    // run on mount + after a short delay (forms render)
    const t = setTimeout(updateHeight, 50);
    window.addEventListener("resize", updateHeight);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", updateHeight);
    };
  }, [mode]);

  const resetTransactionForm = () => {
    setText("");
    setAmount("");
    setCategory("");
  };

  const resetSubscriptionForm = () => {
    setSubName("");
    setSubAmount("");
    setSubCycle("monthly");
    setSubNextRenewal("");
  };

  const onSubmitTransaction = async (e) => {
    e.preventDefault();
    if (!text || !amount || !category) return;

    const numericAmount = Number(amount);
    if (Number.isNaN(numericAmount)) return alert("Enter a valid amount");

    try {
      await addTransaction?.({ text, amount: +numericAmount, category });
    } catch (err) {
      console.error("Error adding transaction:", err);
    }

    resetTransactionForm();
  };

  const onSubmitSubscription = async (e) => {
    e.preventDefault();
    if (!subName || !subAmount || !subNextRenewal) {
      return alert("Please fill subscription name, amount and renewal date");
    }

    const numericAmount = Number(subAmount);
    if (Number.isNaN(numericAmount)) return alert("Enter a valid amount");

    // create transaction record (category "Subscriptions")
    try {
      await addTransaction?.({
        text: subName,
        amount: +numericAmount,
        category: "Subscriptions",
      });
    } catch (err) {
      console.error("Error adding subscription transaction:", err);
    }

    // create subscription record
    if (typeof addSubscription === "function") {
      try {
        await addSubscription({
          name: subName,
          amount: Number(numericAmount),
          cycle: subCycle,
          nextRenewal: subNextRenewal,
          mutedUntil: null,
        });
      } catch (err) {
        console.error("Error creating subscription record:", err);
      }
    } else {
      console.warn("addSubscription prop not provided - subscription not saved.");
    }

    resetSubscriptionForm();
    // optionally switch back to transaction mode:
    // setMode("transaction");
  };

  // small helper for tab button styles (keeps original look simple)
  const tabBase = {
    flex: 1,
    textAlign: "center",
    padding: "8px 10px",
    cursor: "pointer",
    userSelect: "none",
    borderRadius: 6,
    fontWeight: 600,
  };
  const activeTabStyle = { background: "linear-gradient(135deg,#7b61ff,#a67bff)", color: "#fff" };
  const inactiveTabStyle = { background: "transparent", color: "#333", border: "1px solid rgba(0,0,0,0.06)" };

  return (
    <div style={{ width: "100%", overflow: "hidden", minHeight: minHeight }}>
      {/* Heading stays identical for transaction mode to preserve original feel */}
      <h3 style={{ marginBottom: 12 }}>{mode === "transaction" ? "Add new transaction" : "Add new subscription"}</h3>

      {/* Tabs (small, non-intrusive, below heading) */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <div
          role="button"
          tabIndex={0}
          onClick={() => setMode("transaction")}
          onKeyDown={(e) => { if (e.key === "Enter") setMode("transaction"); }}
          style={{ ...tabBase, ...(mode === "transaction" ? activeTabStyle : inactiveTabStyle) }}
        >
          Transaction
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={() => setMode("subscription")}
          onKeyDown={(e) => { if (e.key === "Enter") setMode("subscription"); }}
          style={{ ...tabBase, ...(mode === "subscription" ? activeTabStyle : inactiveTabStyle) }}
        >
          Subscription
        </div>
      </div>

      {/* Slider: both forms exist side-by-side, width 200% -> each takes 50% */}
      <div
        style={{
          display: "flex",
          width: "200%",
          transition: "transform 320ms ease",
          transform: mode === "transaction" ? "translateX(0%)" : "translateX(-50%)",
        }}
      >
        {/* Transaction form (left) — EXACT structure and order as your original form */}
        <form
          ref={txRef}
          onSubmit={onSubmitTransaction}
          className="add-form-container"
          style={{ width: "50%", boxSizing: "border-box", paddingRight: 12 }}
        >
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Text"
          />

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount (negative for expense)"
          />

          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Select Category</option>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Shopping">Shopping</option>
            <option value="Bills">Bills</option>
            <option value="Other">Other</option>
          </select>

          <button className="btn">Add Transaction</button>
        </form>

        {/* Subscription form (right) — layout mirrors the original style (inputs in same order) */}
        <form
          ref={subRef}
          onSubmit={onSubmitSubscription}
          className="add-form-container"
          style={{ width: "50%", boxSizing: "border-box", paddingLeft: 12 }}
        >
          <input
            type="text"
            value={subName}
            onChange={(e) => setSubName(e.target.value)}
            placeholder="Subscription name"
          />

          <input
            type="number"
            value={subAmount}
            onChange={(e) => setSubAmount(e.target.value)}
            placeholder="Amount"
          />

          <select value={subCycle} onChange={(e) => setSubCycle(e.target.value)}>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>

          <input
            type="date"
            value={subNextRenewal}
            onChange={(e) => setSubNextRenewal(e.target.value)}
            placeholder="Next renewal date"
          />
          <button className="btn">Add Subscription</button>
        </form>
      </div>
    </div>
  );
};
