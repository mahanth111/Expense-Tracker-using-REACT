import React, { useState } from "react";

const SubscriptionsModal = ({
  subscriptions = [],
  addSubscription,
  updateSubscription,
  deleteSubscription,
}) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [cycle, setCycle] = useState("monthly");
  const [nextRenewal, setNextRenewal] = useState("");

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name || !amount || !nextRenewal) {
      alert("Please fill all fields");
      return;
    }

    await addSubscription({
      name,
      amount: Number(amount),
      cycle,
      nextRenewal,
      mutedUntil: null,
    });

    setName("");
    setAmount("");
    setCycle("monthly");
    setNextRenewal("");
  };

  return (
    <div style={{ maxHeight: "70vh", overflowY: "auto", padding: "5px" }}>
      <h2>Subscriptions</h2>

      {/* Add Subscription Form */}
      <form onSubmit={handleAdd} className="add-form-container" style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Subscription (Netflix)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <select value={cycle} onChange={(e) => setCycle(e.target.value)}>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>

        <input
          type="date"
          value={nextRenewal}
          onChange={(e) => setNextRenewal(e.target.value)}
        />

        <button className="btn" type="submit">Add Subscription</button>
      </form>

      {/* Subscription List */}
      <h3>Your Subscriptions</h3>

      {subscriptions.length === 0 && <p>No subscriptions added.</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {subscriptions.map((s) => (
          <li key={s.id} style={{ padding: "10px 0", borderBottom: "1px solid #ddd" }}>
            <strong>{s.name}</strong> — ₹{s.amount} ({s.cycle})
            <br />
            Next renewal: {new Date(s.nextRenewal).toDateString()}

            <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
              <button
                className="btn"
                onClick={() => {
                  const newDate = prompt("Enter new renewal date", s.nextRenewal);
                  if (newDate) {
                    updateSubscription(s.id, {
                      nextRenewal: newDate,
                      mutedUntil: null,
                    });
                  }
                }}
              >
                Update
              </button>

              <button
                className="btn"
                onClick={() => {
                  if (confirm("Delete this subscription?")) {
                    deleteSubscription(s.id);
                  }
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubscriptionsModal;
