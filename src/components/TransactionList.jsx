import React from 'react';
import { Transaction } from './Transaction';

export const TransactionList = ({ transactions, deleteTransaction }) => (
  <>
    <h3>History</h3>
    <ul className="list">
      {transactions.map(t => (
        <Transaction key={t.id} transaction={t} deleteTransaction={deleteTransaction} />
      ))}
    </ul>
  </>
);
