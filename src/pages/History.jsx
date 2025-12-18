import React, { useState } from 'react';
import { TransactionList } from '../components/TransactionList';

const History = ({ transactions, deleteTransaction }) => {
  const [filter, setFilter] = useState('all');

  // Filter transactions based on selected period
  const getFilteredTransactions = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return transactions.filter(transaction => {
      if (!transaction.createdAt) return false;

      const txDate = 
        typeof transaction.createdAt.toDate === 'function'
          ? transaction.createdAt.toDate()
          : new Date(transaction.createdAt);

      switch(filter) {
        case 'daily':
          const txDay = new Date(txDate.getFullYear(), txDate.getMonth(), txDate.getDate());
          return txDay.getTime() === today.getTime();
        
        case 'monthly':
          return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
        
        case 'yearly':
          return txDate.getFullYear() === currentYear;
        
        case 'all':
        default:
          return true;
      }
    });
  };

  const filteredTransactions = getFilteredTransactions();

  const buttonStyle = (isActive) => ({
    padding: '6px 12px',
    fontSize: '12px',
    borderRadius: '4px',
    border: isActive ? 'none' : '1px solid #dcdde1',
    backgroundColor: isActive ? '#6C5CE7' : '#fff',
    color: isActive ? '#fff' : '#666',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontWeight: isActive ? '600' : '500'
  });

  return (
    <div>
      {/* Filter Buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: '15px',
        gap: '8px',
        paddingTop: '10px'
      }}>
        <span style={{
          fontSize: '13px',
          fontWeight: '500',
          color: '#666',
          marginRight: '4px'
        }}>
          Filter:
        </span>
        <button
          onClick={() => setFilter('all')}
          style={buttonStyle(filter === 'all')}
          onMouseEnter={(e) => {
            if (filter !== 'all') {
              e.target.style.backgroundColor = '#f5f5f5';
            }
          }}
          onMouseLeave={(e) => {
            if (filter !== 'all') {
              e.target.style.backgroundColor = '#fff';
            }
          }}
        >
          All
        </button>
        <button
          onClick={() => setFilter('daily')}
          style={buttonStyle(filter === 'daily')}
          onMouseEnter={(e) => {
            if (filter !== 'daily') {
              e.target.style.backgroundColor = '#f5f5f5';
            }
          }}
          onMouseLeave={(e) => {
            if (filter !== 'daily') {
              e.target.style.backgroundColor = '#fff';
            }
          }}
        >
          Today
        </button>
        <button
          onClick={() => setFilter('monthly')}
          style={buttonStyle(filter === 'monthly')}
          onMouseEnter={(e) => {
            if (filter !== 'monthly') {
              e.target.style.backgroundColor = '#f5f5f5';
            }
          }}
          onMouseLeave={(e) => {
            if (filter !== 'monthly') {
              e.target.style.backgroundColor = '#fff';
            }
          }}
        >
          Monthly
        </button>
        <button
          onClick={() => setFilter('yearly')}
          style={buttonStyle(filter === 'yearly')}
          onMouseEnter={(e) => {
            if (filter !== 'yearly') {
              e.target.style.backgroundColor = '#f5f5f5';
            }
          }}
          onMouseLeave={(e) => {
            if (filter !== 'yearly') {
              e.target.style.backgroundColor = '#fff';
            }
          }}
        >
          Yearly
        </button>
      </div>

      {/* Transaction List */}
      <TransactionList 
        transactions={filteredTransactions} 
        deleteTransaction={deleteTransaction} 
        heading="History" 
      />

      {/* No transactions message */}
      {filteredTransactions.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: '#666',
          fontSize: '14px'
        }}>
          No transactions found for the selected period.
        </div>
      )}
    </div>
  );
};

export default History;