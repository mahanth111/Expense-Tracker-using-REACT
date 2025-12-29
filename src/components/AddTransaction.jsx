import React, { useState, useEffect, useRef } from "react";

export const AddTransaction = ({ addTransaction, addSubscription }) => {

  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  const [subName, setSubName] = useState("");
  const [subAmount, setSubAmount] = useState("");
  const [subCycle, setSubCycle] = useState("monthly");
  const [subNextRenewal, setSubNextRenewal] = useState("");

  const [mode, setMode] = useState("transaction");

  useEffect(() => {
    if (mode === "subscription" && (subName === "" || subName === text)) {
      setSubName(text);
    }
  }, [mode, text]);

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

    try {
      await addTransaction?.({
      text: subName,
      amount: -Math.abs(numericAmount),
      category: "Subscriptions",
    });
    } catch (err) {
      console.error("Error adding subscription transaction:", err);
    }

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
  };

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

      <h3 style={{ marginBottom: 12 }}>{mode === "transaction" ? "Add new transaction" : "Add new subscription"}</h3>

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

      <div
        style={{
          display: "flex",
          width: "200%",
          transition: "transform 320ms ease",
          transform: mode === "transaction" ? "translateX(0%)" : "translateX(-50%)",
        }}
      >
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
