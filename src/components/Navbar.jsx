import React from 'react';
import { Link } from 'react-router-dom';

export const Navbar = ({ logout }) => {
  return (
    <nav className="navbar">
      <h2>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>
          Expense Tracker
        </Link>
      </h2>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/add-expense">Add Expense</Link></li>
        <li><Link to="/history">History</Link></li>
        <li><button className="logout-btn" onClick={logout}>Logout</button></li>
      </ul>
    </nav>
  );
};
