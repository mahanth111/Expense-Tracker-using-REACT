import React from 'react';
import { AddTransaction } from '../components/AddTransaction';

const AddExpense = ({ addTransaction }) => {
  return <AddTransaction addTransaction={addTransaction} />;
};

export default AddExpense;
