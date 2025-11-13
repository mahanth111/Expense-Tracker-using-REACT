import React from 'react';

export const Transaction = ({ transaction, deleteTransaction }) => {
  const sign = transaction.amount < 0 ? '-' : '+';
  return (
    <li className={transaction.amount < 0 ? 'minus' : 'plus'}>
      <div>
        {transaction.text}
        {transaction.category && (
          <span className={`category-tag category-${transaction.category}`}>{transaction.category}</span>
        )}
      </div>
      <span>
        {sign}${Math.abs(transaction.amount)}
      </span>
      <button className="delete-btn" onClick={() => deleteTransaction(transaction.id)}>x</button>
    </li>
  );
};
