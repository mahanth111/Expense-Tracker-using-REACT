import React from 'react';
import { Link } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export const Navbar = ({ logout, openModal, openSubscriptionsModal }) => {

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
        {/* Home */}
        <li>
          <Link to="/" className="nav-link">Home</Link>
        </li>

        {/* Add Expense MODAL */}
        <li>
          <span onClick={openModal} className="nav-link">Add Expense</span>
        </li>

        {/* History PAGE */}
        <li>
          <Link to="/history" className="nav-link">History</Link>
        </li>

        {/* Subscriptions MODAL */}
        <li>
          <span onClick={openSubscriptionsModal} className="nav-link">
            Subscriptions
          </span>
        </li>

        {/* Logout */}
        <li>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </nav>
  );
};
