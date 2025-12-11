import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import Home from './pages/Home';
import AddExpense from './pages/AddExpense';
import History from './pages/History';
import Login from './pages/Login';
import Register from './pages/Register';
import Modal from './components/Modal';
import { AddTransaction } from './components/AddTransaction';
import SubscriptionsModal from "./components/SubscriptionsModal";

import './acc.css';

import { auth, db } from './firebase';
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
  updateDoc
} from 'firebase/firestore';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [user, setUser] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubscriptionsModalOpen, setIsSubscriptionsModalOpen] = useState(false);

  const [subAlert, setSubAlert] = useState(null);

  // ---------------- AUTH LISTENER ----------------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser.uid);
      } else {
        setUser(null);
        setTransactions([]);
        setSubscriptions([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // ---------------- LOAD TRANSACTIONS ----------------
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'users', user, 'transactions'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTransactions(
        snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
      );
    });

    return () => unsubscribe();
  }, [user]);

  // ---------------- LOAD SUBSCRIPTIONS ----------------
  useEffect(() => {
    if (!user) return;

    const colRef = collection(db, 'users', user, 'subscriptions');

    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      setSubscriptions(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsubscribe();
  }, [user]);

  // ---------------- SUBSCRIPTION LOGIC ----------------
  const REMINDER_DAYS = 3;
  const parseDate = (v) => {
    const d = new Date(v);
    return isNaN(d) ? null : d;
  };

  useEffect(() => {
    if (subscriptions.length === 0) return setSubAlert(null);

    const now = new Date();

    const upcoming = subscriptions.find((s) => {
      const next = parseDate(s.nextRenewal);
      if (!next) return false;

      const muted = parseDate(s.mutedUntil);
      if (muted && now <= muted) return false;

      const daysLeft = Math.ceil((next - now) / (1000 * 60 * 60 * 24));
      return daysLeft <= REMINDER_DAYS && daysLeft >= 0;
    });

    if (upcoming) {
      const next = parseDate(upcoming.nextRenewal);
      const daysLeft = Math.ceil((next - now) / (1000 * 60 * 60 * 24));

      setSubAlert({
        id: upcoming.id,
        name: upcoming.name,
        amount: upcoming.amount,
        nextRenewal: upcoming.nextRenewal,
        daysLeft,
      });
    } else {
      setSubAlert(null);
    }
  }, [subscriptions]);

  // ---------------- ADD SUBSCRIPTION ----------------
  const addSubscription = async (data) => {
    if (!user) return;

    await addDoc(collection(db, 'users', user, 'subscriptions'), data);
  };

  // ---------------- UPDATE SUBSCRIPTION ----------------
  const updateSubscription = async (id, data) => {
    await updateDoc(doc(db, 'users', user, 'subscriptions', id), data);
  };

  // ---------------- DELETE SUBSCRIPTION ----------------
  const deleteSubscription = async (id) => {
    await deleteDoc(doc(db, 'users', user, 'subscriptions', id));
  };

  // ---------------- ADD TRANSACTION ----------------
  const addTransaction = async (transaction) => {
    if (!user) return;

    await addDoc(collection(db, 'users', user, 'transactions'), {
      ...transaction,
      createdAt: serverTimestamp()
    });

    setIsModalOpen(false);
  };

  // ---------------- DELETE TRANSACTION ----------------
  const deleteTransaction = async (id) => {
    if (!user) return;
    await deleteDoc(doc(db, 'users', user, 'transactions', String(id)));
  };

  return (
    <Router>
      {user && (
        <Navbar
          logout={() => setUser(null)}
          openModal={() => setIsModalOpen(true)}
          openSubscriptionsModal={() => setIsSubscriptionsModalOpen(true)}
        />
      )}

      <div className="container">

        {/* ADD EXPENSE MODAL */}
        {isModalOpen && (
          <Modal closeModal={() => setIsModalOpen(false)}>
            <AddTransaction addTransaction={addTransaction} />
          </Modal>
        )}

        {/* SUBSCRIPTIONS MODAL */}
        {isSubscriptionsModalOpen && (
          <Modal closeModal={() => setIsSubscriptionsModalOpen(false)}>
            <SubscriptionsModal
              subscriptions={subscriptions}
              addSubscription={addSubscription}
              updateSubscription={updateSubscription}
              deleteSubscription={deleteSubscription}
            />
          </Modal>
        )}

        {/* SUBSCRIPTION ALERT */}
        {subAlert && (
          <Modal closeModal={() => setSubAlert(null)}>
            <div style={{ textAlign: "center" }}>
              <h3>Subscription Reminder</h3>
              <p><strong>{subAlert.name}</strong> renews in {subAlert.daysLeft} days.</p>
              <p>Amount: ₹{subAlert.amount}</p>

              <div style={{ display: "flex", gap: "10px", marginTop: "10px", justifyContent: "center" }}>
                <button className="btn" onClick={() => setSubAlert(null)}>Okay</button>
                <button
                  className="btn"
                  onClick={() => {
                    updateSubscription(subAlert.id, {
                      mutedUntil: subAlert.nextRenewal,
                    });
                    setSubAlert(null);
                  }}
                >
                  Completed
                </button>
              </div>
            </div>
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
              <Route path="/add-expense" element={<AddExpense addTransaction={addTransaction} />} />
              <Route path="/history" element={<History transactions={transactions} deleteTransaction={deleteTransaction} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
