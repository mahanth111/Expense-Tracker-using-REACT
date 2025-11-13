import React from 'react';
import { Balance } from '../components/Balance';
import { IncomeExpenses } from '../components/IncomeExpenses';
import { Charts } from '../components/Charts';

const Home = ({ transactions }) => {
  return (
    <>
      <div className="balance-card">
        <Balance transactions={transactions} />
      </div>
      <IncomeExpenses transactions={transactions} />
      <Charts transactions={transactions} />
    </>
  );
};

export default Home;
