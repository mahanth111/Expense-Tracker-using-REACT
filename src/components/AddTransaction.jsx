// src/components/AddTransaction.jsx
import React, { useState, useEffect } from 'react';

export const AddTransaction = ({ addTransaction, addSubscription }) => {
  // original transaction fields
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');

  // mode: 'transaction' or 'subscription'
  const [mode, setMode] = useState('transaction');

  // subscription-specific fields
  const [subName, setSubName] = useState('');
  const [subCycle, setSubCycle] = useState('monthly');
  const [subNextRenewal, setSubNextRenewal] = useState('');

  // keep subName synced with text if user hasn't typed separate name
  useEffect(() => {
    if (mode !== 'subscription') return;
    setSubName(prev => (prev === '' || prev === text ? text : prev));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, text]);

  const resetForm = () => {
    setText('');
    setAmount('');
    setCategory('');
    setMode('transaction');
    setSubName('');
    setSubCycle('monthly');
    setSubNextRenewal('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Validation: For transaction mode require text, amount, category (same as original)
    if (mode === 'transaction') {
      if (!text || !amount || !category) return;
    } else {
      // subscription mode: require amount, subName, subNextRenewal
      if (!amount || !subName || !subNextRenewal) {
        return alert('Please fill all subscription fields (name, amount, renewal date).');
      }
    }

    const numericAmount = Number(amount);
    if (Number.isNaN(numericAmount)) return alert('Enter a valid amount');

    // create the transaction object
    if (mode === 'transaction') {
      try {
        await addTransaction?.({ text, amount: +numericAmount, category });
      } catch (err) {
        console.error('Error adding transaction:', err);
      }
    } else {
      // subscription mode: create a transaction whose text is subscription name and category "Subscriptions"
      try {
        await addTransaction?.({ text: subName, amount: +numericAmount, category: 'Subscriptions' });
      } catch (err) {
        console.error('Error adding subscription-transaction:', err);
      }

      // also create subscription record in firestore via addSubscription prop
      if (typeof addSubscription === 'function') {
        try {
          await addSubscription({
            name: subName,
            amount: Number(numericAmount),
            cycle: subCycle,
            nextRenewal: subNextRenewal,
            mutedUntil: null,
          });
        } catch (err) {
          console.error('Error adding subscription record:', err);
        }
      } else {
        console.warn('addSubscription prop missing — subscription record not saved.');
      }
    }

    // reset
    resetForm();
  };

  // simple pill/tab styles inline to match existing look (keeps consistent)
  const tabStyle = (active) => ({
    flex: 1,
    padding: '8px 12px',
    borderRadius: 6,
    textAlign: 'center',
    cursor: 'pointer',
    border: active ? '2px solid #7b61ff' : '1px solid rgba(0,0,0,0.08)',
    background: active ? 'linear-gradient(135deg,#7b61ff,#a67bff)' : '#fff',
    color: active ? '#fff' : '#333',
    fontWeight: active ? 600 : 500,
  });

  return (
    <form className="add-form-container" onSubmit={onSubmit}>
      <h3 style={{ marginBottom: 12 }}>Add New</h3>

      {/* Mode selector: Transaction (left) / Subscription (right) */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <div
          role="button"
          tabIndex={0}
          onClick={() => setMode('transaction')}
          onKeyDown={(e) => { if (e.key === 'Enter') setMode('transaction'); }}
          style={tabStyle(mode === 'transaction')}
        >
          Transaction
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={() => setMode('subscription')}
          onKeyDown={(e) => { if (e.key === 'Enter') setMode('subscription'); }}
          style={tabStyle(mode === 'subscription')}
        >
          Subscription
        </div>
      </div>

      {/* Transaction fields (original UI) */}
      {mode === 'transaction' && (
        <>
          <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Text"
          />

          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="Amount (negative for expense)"
          />

          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">Select Category</option>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Shopping">Shopping</option>
            <option value="Bills">Bills</option>
            <option value="Other">Other</option>
          </select>
        </>
      )}

      {/* Subscription fields */}
      {mode === 'subscription' && (
        <>
          {/* subscription name (auto-syncs with text if left empty) */}
          <input
            type="text"
            value={subName}
            onChange={e => setSubName(e.target.value)}
            placeholder="Subscription name (e.g., Netflix)"
          />

          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="Amount"
          />

          <select value={subCycle} onChange={e => setSubCycle(e.target.value)}>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>

          <input
            type="date"
            value={subNextRenewal}
            onChange={e => setSubNextRenewal(e.target.value)}
            placeholder="Next renewal date"
          />
        </>
      )}

      <button className="btn" type="submit">
        {mode === 'transaction' ? 'Add Transaction' : 'Add Subscription'}
      </button>
    </form>
  );
};
export default AddTransaction;