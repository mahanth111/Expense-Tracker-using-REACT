import React from 'react';
import { Balance } from '../components/Balance';
import { IncomeExpenses } from '../components/IncomeExpenses';
import { Charts } from '../components/Charts';
import { TransactionList } from '../components/TransactionList';

const Home = ({ transactions }) => {

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "flex-start",
        height: "90vh",
        gap: "20px",
        padding: "20px",
      }}
    >
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>

        <div className="balance-card">
          <Balance transactions={transactions} />
          <IncomeExpenses transactions={transactions} />
        </div>

        <div className="history-card">
          <TransactionList 
            transactions={recentTransactions} 
            deleteTransaction={() => {}} 
            heading="Recent History" 
          />
        </div>
      </div>

      <div style={{ flex: 2 }}>
        <Charts transactions={transactions} />
      </div>
    </div>
  );
};

export default Home;