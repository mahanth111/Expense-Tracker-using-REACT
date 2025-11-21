import React from 'react';
import { TransactionList } from '../components/TransactionList';

const History = ({ transactions, deleteTransaction,heading }) => {
  return <TransactionList transactions={transactions} deleteTransaction={deleteTransaction} heading={heading} />;
};

export default History;
