import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import Home from './pages/Home';
import AddExpense from './pages/AddExpense';
import History from './pages/History';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState(() => localStorage.getItem('user'));

  useEffect(() => {
    if (user) localStorage.setItem('user', user);
  }, [user]);

  const addTransaction = (transaction) => {
    setTransactions([transaction, ...transactions]);
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      {user && <Navbar logout={logout} />}
      <div className="container">
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
