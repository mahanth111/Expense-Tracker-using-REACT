import React, { useState } from 'react';

export const AddTransaction = ({ addTransaction }) => {
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');

  const onSubmit = e => {
    e.preventDefault();
    if (!text || !amount || !category) return;

    addTransaction({ id: Date.now(), text, amount: +amount, category });
    setText('');
    setAmount('');
    setCategory('');
  };

  return (
<form className="add-form-container" onSubmit={onSubmit}>
      <h3>Add new transaction</h3>
      <input type="text" value={text} onChange={e => setText(e.target.value)} placeholder="Text" />
      <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount (negative for expense)" />
      <select value={category} onChange={e => setCategory(e.target.value)}>
        <option value="">Select Category</option>
        <option value="Food">Food</option>
        <option value="Travel">Travel</option>
        <option value="Shopping">Shopping</option>
        <option value="Bills">Bills</option>
        <option value="Other">Other</option>
      </select>
      <button className="btn">Add Transaction</button>
    </form>
  );
};
