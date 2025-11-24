import React from 'react';
import { Balance } from '../components/Balance';
import { IncomeExpenses } from '../components/IncomeExpenses';
import { Charts } from '../components/Charts';
import  History from './History';

const Home = ({ transactions }) => {

  // Get only the last 5 transactions
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
      {/* LEFT SIDE */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* BALANCE + INCOME/EXPENSES CARD */}
        <div className="balance-card">
          <Balance transactions={transactions} />
          <IncomeExpenses transactions={transactions} />
        </div>

        {/* HISTORY CARD */}
        <div className="history-card">
          <History transactions={recentTransactions} heading="Recent History" />
        </div>
      </div>

      {/* RIGHT SIDE — CHARTS */}
      <div style={{ flex: 2 }}>
        <Charts transactions={transactions} />
      </div>
    </div>
  );
};

<div className="dashboard-layout">
  ...
</div>

export default Home;
