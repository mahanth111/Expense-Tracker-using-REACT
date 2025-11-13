import React from 'react';
import { TransactionList } from '../components/TransactionList';

const History = ({ transactions, deleteTransaction }) => {
  return <TransactionList transactions={transactions} deleteTransaction={deleteTransaction} />;
};

export default History;
