import React from "react";

const SubscriptionsModal = ({
  subscriptions,
  updateSubscription,
  deleteSubscription,
  onPay,
}) => {
  return (
    <div style={{ maxHeight: "70vh", overflowY: "auto", padding: "5px" }}>
      <h2>Your Subscriptions</h2>

      {subscriptions.length === 0 && <p>No subscriptions added yet.</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {subscriptions.map((s) => (
          <li
            key={s.id}
            style={{
              padding: "10px 0",
              borderBottom: "1px solid #ddd",
            }}
          >
            <strong>{s.name}</strong> — ₹{s.amount} ({s.cycle})
            <br />
            Next renewal: {new Date(s.nextRenewal).toDateString()}

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              <button
                className="btn"
                onClick={() => onPay && onPay(s)}
              >
                Pay
              </button>

              <button
                className="btn"
                onClick={() => {
                  const newDate = prompt(
                    "Enter new renewal date",
                    s.nextRenewal
                  );
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
