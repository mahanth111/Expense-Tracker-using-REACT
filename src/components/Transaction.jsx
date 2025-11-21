// src/components/Transaction.jsx
import React from 'react';
import { getCategoryColor } from '../categoryColors';

export const Transaction = ({ transaction, deleteTransaction, isDelete }) => {
  const sign = transaction.amount < 0 ? '-' : '+';
  const category = transaction.category || 'Other';
  const color = getCategoryColor(category);

  // inline style for left border and tag
  const liStyle = {
    borderLeftColor: color,
  };

  const tagStyle = {
    backgroundColor: `${color}22`, // subtle translucent bg
    color: color,
    border: `1px solid ${color}`,
    padding: '2px 8px',
    borderRadius: '6px',
    marginLeft: '10px',
    fontWeight: 600,
    fontSize: '12px'
  };

  return (
    <li className={transaction.amount < 0 ? 'minus' : 'plus'} style={liStyle}>
      <div>
        {transaction.text}
        {transaction.category && (
          <span className="category-tag" style={tagStyle}>
            {transaction.category}
          </span>
        )}
      </div>

      <span>
        {sign}${Math.abs(transaction.amount)}
      </span>

      {isDelete && (
        <button className="delete-btn" onClick={() => deleteTransaction(transaction.id)}>x</button>
      )}
    </li>
  );
};
