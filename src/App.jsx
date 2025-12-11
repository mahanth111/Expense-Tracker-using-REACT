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

import './acc.css';

// Firebase
import { auth, db } from './firebase';
import {
  onAuthStateChanged
} from "firebase/auth";

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Listen to Firebase Auth Login/Logout state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser.uid);
      } else {
        setUser(null);
        setTransactions([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Load Firestore transactions when user logs in
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'users', user, 'transactions'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data()
      }));

      setTransactions(data);
    });

    return () => unsubscribe();
  }, [user]);

  // Add transaction
  const addTransaction = async (transaction) => {
    if (!user) return;

    try {
      await addDoc(collection(db, 'users', user, 'transactions'), {
        ...transaction,
        createdAt: serverTimestamp(),
      });

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  // Delete transaction
  const deleteTransaction = async (id) => {
    if (!user) return;

    try {
      await deleteDoc(doc(db, 'users', user, 'transactions', String(id)));
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  return (
    <Router>
      {user && <Navbar logout={() => setUser(null)} openModal={() => setIsModalOpen(true)} />}

      <div className="container">
        {isModalOpen && (
          <Modal closeModal={() => setIsModalOpen(false)}>
            <AddTransaction addTransaction={addTransaction} />
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
