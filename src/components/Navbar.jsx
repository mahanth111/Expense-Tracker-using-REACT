import React from 'react';
import { Link } from 'react-router-dom';

export const Navbar = ({ logout, openModal }) => {
return (
<nav className="navbar">
  <h2>
<Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>
Expense Tracker 
</Link> 
</h2>
  <ul>
    <li><Link to="/" className="nav-link">Home</Link></li>
    <li>
      <span onClick={openModal} className="nav-link">
        Add Expense
      </span>
    </li>
    <li><Link to="/history" className="nav-link">History</Link></li>
    <li>
      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
    </li>
  </ul>
</nav>
);
};
