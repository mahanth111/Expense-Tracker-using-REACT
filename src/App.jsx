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


// 🔥 Firebase imports
import { db } from './firebase';
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
  const [user, setUser] = useState(() => localStorage.getItem('user'));
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ Keep user in localStorage (same behavior as before)
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', user);
    } else {
      localStorage.removeItem('user');
      setTransactions([]); // clear transactions on logout
    }
  }, [user]);

  // ✅ Real-time listener to Firestore for this user's transactions
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'users', user, 'transactions'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({
        id: d.id,       // Firestore document ID (used for delete)
        ...d.data(),    // text, amount, category, createdAt...
      }));
      setTransactions(data);
    });

    return () => unsubscribe();
  }, [user]);

  // ✅ Add transaction -> Firestore
  const addTransaction = async (transaction) => {
    if (!user) return;

    try {
      await addDoc(collection(db, 'users', user, 'transactions'), {
        ...transaction,
        createdAt: serverTimestamp(), // for ordering
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  // ✅ Delete transaction -> Firestore
  const deleteTransaction = async (id) => {
    if (!user) return;

    try {
      await deleteDoc(doc(db, 'users', user, 'transactions', id));
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      {user && <Navbar logout={logout} openModal={() => setIsModalOpen(true)} />}
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
              <Route
                path="/add-expense"
                element={<AddExpense addTransaction={addTransaction} />}
              />
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
