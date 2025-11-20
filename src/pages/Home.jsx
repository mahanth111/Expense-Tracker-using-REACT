import React from 'react';
import { Balance } from '../components/Balance';
import { IncomeExpenses } from '../components/IncomeExpenses';
import { Charts } from '../components/Charts';

const Home = ({ transactions }) => {
  return (
    <div style = {{display:"flex",justifyContent:"space-evenly", alignItems: "center", height: "100%", gap:"10px"}}>
      <div className="balance-card"
      style={{ flex:1 }}>
        <Balance transactions={transactions} />

      <IncomeExpenses transactions={transactions} />
      </div>
      <div style = {{flex: 2}}>
      <Charts transactions={transactions} />
      </div>
    </div>
  );
};

export default Home;
