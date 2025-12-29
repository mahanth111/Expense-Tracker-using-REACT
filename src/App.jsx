import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { Navbar } from "./components/Navbar";
import Home from "./pages/Home";
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

  const [razorpayData, setRazorpayData] = useState(null);
  const REMINDER_DAYS = 3;

  // AUTH
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) setUser(u.uid);
      else {
        setUser(null);
        setTransactions([]);
        setSubscriptions([]);
        setBudgets({});
      }
    });
    return unsub;
  }, []);

  // TRANSACTIONS
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "users", user, "transactions"),
      orderBy("createdAt", "desc")
    );
    return onSnapshot(q, (snap) =>
      setTransactions(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
  }, [user]);

  // SUBSCRIPTIONS
  useEffect(() => {
    if (!user) return;
    const ref = collection(db, "users", user, "subscriptions");
    return onSnapshot(ref, (snap) =>
      setSubscriptions(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
  }, [user]);

  // BUDGETS
  useEffect(() => {
    if (!user) return;
    const ref = collection(db, "users", user, "budgets");
    return onSnapshot(ref, (snap) => {
      const b = {};
      snap.docs.forEach((d) => (b[d.id] = d.data().amount));
      setBudgets(b);
    });
  }, [user]);

  // ADD TRANSACTION
  const addTransaction = async (tx) => {
    if (!user) return;
    await addDoc(collection(db, "users", user, "transactions"), {
      ...tx,
      createdAt: serverTimestamp(),
    });
    setIsModalOpen(false);
  };

  // CRUD
  const deleteTransaction = (id) =>
    deleteDoc(doc(db, "users", user, "transactions", id));
  const addSubscription = (d) =>
    addDoc(collection(db, "users", user, "subscriptions"), d);
  const updateSubscription = (id, d) =>
    updateDoc(doc(db, "users", user, "subscriptions", id), d);
  const deleteSubscription = (id) =>
    deleteDoc(doc(db, "users", user, "subscriptions", id));
  const setBudget = (c, a) =>
    setDoc(doc(db, "users", user, "budgets", c), { amount: a });
  const deleteBudget = (c) =>
    deleteDoc(doc(db, "users", user, "budgets", c));

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
        {isModalOpen && (
          <Modal closeModal={() => setIsModalOpen(false)}>
            <AddTransaction
              addTransaction={addTransaction}
              addSubscription={addSubscription}
            />
          </Modal>
        )}

        {isSubscriptionsModalOpen && (
          <Modal closeModal={() => setIsSubscriptionsModalOpen(false)}>
            <SubscriptionsModal
              subscriptions={subscriptions}
              updateSubscription={updateSubscription}
              deleteSubscription={deleteSubscription}
              onPay={(sub) =>
                setRazorpayData({
                  amount: Number(sub.amount),
                  merchant: sub.name,
                })
              }
            />
          </Modal>
        )}

        {isBudgetsModalOpen && (
          <Modal closeModal={() => setIsBudgetsModalOpen(false)}>
            <BudgetModal
              budgets={budgets}
              setBudget={setBudget}
              deleteBudget={deleteBudget}
            />
          </Modal>
        )}

        {razorpayData && (
          <Modal closeModal={() => setRazorpayData(null)}>
            <RazorpayClone
              amount={razorpayData.amount}
              merchant={razorpayData.merchant}
              onClose={() => setRazorpayData(null)}
            />
          </Modal>
        )}

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
                element={
                  <History
                    transactions={transactions}
                    deleteTransaction={deleteTransaction}
                  />
                }
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
