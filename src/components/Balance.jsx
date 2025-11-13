import React from 'react';
import CountUp from 'react-countup';

export const Balance = ({ transactions }) => {
  const total = transactions.reduce((acc, t) => acc + t.amount, 0).toFixed(2);

  return (
    <>
      <h4>Your Balance</h4>
      <h1>
        $<CountUp end={parseFloat(total)} duration={1.5} decimals={2} />
      </h1>
    </>
  );
};
