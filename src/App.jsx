import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { Navbar } from "./components/Navbar";
import Home from "./pages/Home";
import AddExpense from "./pages/AddExpense";
import History from "./pages/History";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Modal from "./components/Modal";
import { AddTransaction } from "./components/AddTransaction";
import SubscriptionsModal from "./components/SubscriptionsModal";
import BudgetModal from "./components/BudgetModal";
import RazorpayClone from "./components/RazorpayClone";

import "./acc.css";

import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  updateDoc,
  setDoc,
} from "firebase/firestore";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [user, setUser] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubscriptionsModalOpen, setIsSubscriptionsModalOpen] = useState(false);
  const [isBudgetsModalOpen, setIsBudgetsModalOpen] = useState(false);

  const [subAlerts, setSubAlerts] = useState([]);
  const [budgetAlert, setBudgetAlert] = useState(null);

  const [fakePayItem, setFakePayItem] = useState(null);

  const REMINDER_DAYS = 3;

  // AUTH LISTENER
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser.uid);
      } else {
        setUser(null);
        setTransactions([]);
        setSubscriptions([]);
        setBudgets({});
      }
    });

    return () => unsubscribe();
  }, []);

  // LOAD TRANSACTIONS
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "users", user, "transactions"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTransactions(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsubscribe();
  }, [user]);

  // LOAD SUBSCRIPTIONS
  useEffect(() => {
    if (!user) return;

    const colRef = collection(db, "users", user, "subscriptions");

    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      setSubscriptions(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsubscribe();
  }, [user]);

  // LOAD BUDGETS
  useEffect(() => {
    if (!user) return;

    const ref = collection(db, "users", user, "budgets");

    const unsub = onSnapshot(ref, (snapshot) => {
      const b = {};
      snapshot.docs.forEach((d) => {
        b[d.id] = d.data().amount;
      });
      setBudgets(b);
    });

    return () => unsub();
  }, [user]);

  // PARSE DATE
  const parseDate = (v) => {
    const d = new Date(v);
    return isNaN(d) ? null : d;
  };

  // SUBSCRIPTION ALERTS
  useEffect(() => {
    if (!subscriptions || subscriptions.length === 0) {
      setSubAlerts([]);
      return;
    }

    const now = new Date();

    const upcomingList = subscriptions
      .map((s) => {
        const next = parseDate(s.nextRenewal);
        if (!next) return null;

        const muted = parseDate(s.mutedUntil);
        if (muted && now <= muted) return null;

        const daysLeft = Math.ceil((next - now) / 86400000);
        return { s, next, daysLeft };
      })
      .filter(Boolean)
      .filter((item) => item.daysLeft >= 0 && item.daysLeft <= REMINDER_DAYS)
      .map((item) => ({
        id: item.s.id,
        name: item.s.name,
        amount: item.s.amount,
        nextRenewal: item.s.nextRenewal,
        daysLeft: item.daysLeft,
      }));
 
    setSubAlerts(upcomingList);
  }, [subscriptions]);

  // Handle one completed
  const handleSubCompleted = async (id) => {
    if (!user || !id) return;
    try {
      const item = subscriptions.find((s) => s.id === id);
      if (!item || !item.nextRenewal) {
        setSubAlerts((prev) => prev.filter((a) => a.id !== id));
        return;
      }

      const next = new Date(item.nextRenewal);
      next.setHours(23, 59, 59, 999);
      const mutedUntilISO = next.toISOString();

      await updateDoc(doc(db, "users", user, "subscriptions", id), {
        mutedUntil: mutedUntilISO,
      });

      setSubAlerts((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Error muting subscription alert:", err);
    }
  };

  // Handle ALL completed
  const handleSubCompletedAll = async () => {
    if (!user || !subAlerts.length) return;
    try {
      const updates = subAlerts.map(async (a) => {
        const item = subscriptions.find((s) => s.id === a.id);
        if (!item || !item.nextRenewal) return null;

        const next = new Date(item.nextRenewal);
        next.setHours(23, 59, 59, 999);
        const mutedUntilISO = next.toISOString();

        return updateDoc(doc(db, "users", user, "subscriptions", a.id), {
          mutedUntil: mutedUntilISO,
        });
      });

      await Promise.all(updates);
      setSubAlerts([]);
    } catch (err) {
      console.error("Error muting all alerts:", err);
    }
  };

  // BUDGET FUNCTIONS
  const setBudget = async (category, amount) => {
    await setDoc(doc(db, "users", user, "budgets", category), { amount });
  };

  const deleteBudget = async (category) => {
    await deleteDoc(doc(db, "users", user, "budgets", category));
  };

  // BUDGET CHECK
  const checkBudgetAfterAdd = (newTx) => {
    if (!newTx?.category) return;

    const category = newTx.category;
    const limit = budgets[category];
    if (!limit) return;

    const currentMonth = new Date().getMonth();

    const spent = transactions
      .filter((t) => {
        const d = t.createdAt?.toDate?.() || new Date(t.createdAt);
        return t.category === category && t.amount < 0 && d.getMonth() === currentMonth;
      })
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const newAmount = Math.abs(newTx.amount);
    const total = spent + newAmount;

    if (total >= limit) {
      return setBudgetAlert({
        type: "exceeded",
        category,
        limit,
        total,
      });
    }

    if (total >= limit * 0.8) {
      return setBudgetAlert({
        type: "warning",
        category,
        limit,
        total,
      });
    }
  };

  // ADD TRANSACTION
  const addTransaction = async (transaction) => {
    if (!user) return;

    await addDoc(collection(db, "users", user, "transactions"), {
      ...transaction,
      createdAt: serverTimestamp(),
    });

    checkBudgetAfterAdd(transaction);
    setIsModalOpen(false);
  };

  // DELETE TRANSACTION
  const deleteTransaction = async (id) => {
    await deleteDoc(doc(db, "users", user, "transactions", id));
  };

  // SUBSCRIPTIONS CRUD
  const addSubscription = async (data) => {
    await addDoc(collection(db, "users", user, "subscriptions"), data);
  };

  const updateSubscription = async (id, data) => {
    await updateDoc(doc(db, "users", user, "subscriptions", id), data);
  };

  const deleteSubscription = async (id) => {
    await deleteDoc(doc(db, "users", user, "subscriptions", id));
  };

  return (
    <Router>
      {user && (
        <Navbar
          logout={() => setUser(null)}
          openModal={() => setIsModalOpen(true)}
          openSubscriptionsModal={() => setIsSubscriptionsModalOpen(true)}
          openBudgetsModal={() => setIsBudgetsModalOpen(true)}
        />
      )}

      <div className="container">
        {/* ADD TRANSACTION MODAL */}
        {isModalOpen && (
          <Modal closeModal={() => setIsModalOpen(false)}>
            <AddTransaction
              addTransaction={addTransaction}
              addSubscription={addSubscription}
            />
          </Modal>
        )}

        {/* SUBSCRIPTIONS LIST MODAL */}
        {isSubscriptionsModalOpen && (
          <Modal closeModal={() => setIsSubscriptionsModalOpen(false)}>
            <SubscriptionsModal
              subscriptions={subscriptions}
              updateSubscription={updateSubscription}
              deleteSubscription={deleteSubscription}
            />
          </Modal>
        )}

        {/* BUDGET MODAL */}
        {isBudgetsModalOpen && (
          <Modal closeModal={() => setIsBudgetsModalOpen(false)}>
            <BudgetModal
              budgets={budgets}
              setBudget={setBudget}
              deleteBudget={deleteBudget}
            />
          </Modal>
        )}

        {/* SUBSCRIPTION ALERT MODAL */}
        {subAlerts.length > 0 && (
          <Modal closeModal={() => setSubAlerts([])}>
            <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto" }}>
              <h3>Subscription reminders</h3>
              <p>
                You have {subAlerts.length} upcoming subscription
                {subAlerts.length > 1 ? "s" : ""}:
              </p>

              <ul style={{ listStyle: "none", padding: 0, textAlign: "left" }}>
                {subAlerts.map((a) => (
                  <li
                    key={a.id}
                    style={{
                      padding: 12,
                      borderBottom: "1px solid #eee",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <strong>{a.name}</strong>
                      <div style={{ fontSize: 13, color: "#555" }}>
                        ₹{Number(a.amount).toFixed(2)} — in {a.daysLeft}{" "}
                        {a.daysLeft === 1 ? "day" : "days"} (
                        {new Date(a.nextRenewal).toLocaleDateString()} )
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="btn" onClick={() => handleSubCompleted(a.id)}>
                        Completed
                      </button>

                      <button
                        className="btn"
                        style={{ background: "#2ecc71" }}
                        onClick={() => setFakePayItem(a)}
                      >
                        Pay
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div style={{ marginTop: 12, display: "flex", gap: 8, justifyContent: "center" }}>
                <button className="btn" onClick={() => setSubAlerts([])}>
                  Okay
                </button>
                <button className="btn" onClick={handleSubCompletedAll}>
                  Completed all
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* FAKE RAZORPAY PAYMENT MODAL */}
        {fakePayItem && (
          <Modal closeModal={() => setFakePayItem(null)}>
          <RazorpayClone />
          </Modal>
        )}

        {/* BUDGET ALERT */}
        {budgetAlert && (
          <Modal closeModal={() => setBudgetAlert(null)}>
            <div style={{ textAlign: "center" }}>
              <h3>{budgetAlert.type === "exceeded" ? "Budget Exceeded!" : "Budget Warning"}</h3>
              <p>
                Category: <strong>{budgetAlert.category}</strong>
              </p>
              <p>
                Spent: <strong>₹{budgetAlert.total}</strong> / Limit:{" "}
                <strong>₹{budgetAlert.limit}</strong>
              </p>
              <button className="btn" onClick={() => setBudgetAlert(null)}>
                OK
              </button>
            </div>
          </Modal>
        )}

        {/* ROUTES */}
        <Routes>
          {!user ? (
            <>
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Home transactions={transactions} />} />
              <Route
                path="/history"
                element={<History transactions={transactions} deleteTransaction={deleteTransaction} />}
              />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
