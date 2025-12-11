import React from 'react';
import { Link } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export const Navbar = ({ logout, openModal, openSubscriptionsModal, openBudgetsModal }) => {

  const handleLogout = () => {
    signOut(auth)
      .then(() => logout())
      .catch((error) => console.error("Logout Error:", error));
  };

  return (
    <nav className="navbar">
      <h2>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>
          Expense Tracker
        </Link>
      </h2>

      <ul>
        <li><Link to="/" className="nav-link">Home</Link></li>
        <li><span onClick={openModal} className="nav-link">Add Expense</span></li>

        <li>
          <span className="nav-link" onClick={openSubscriptionsModal}>
            Subscriptions
          </span>
        </li>

        <li>
          <span className="nav-link" onClick={openBudgetsModal}>
            Budgets
          </span>
        </li>
        <li><Link to="/history" className="nav-link">History</Link></li>

        <li>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </nav>
  );
};
