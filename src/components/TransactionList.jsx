import React from 'react';
import { Transaction } from './Transaction';

export const TransactionList = ({ transactions, deleteTransaction, heading }) => {
  const isDelete = heading === "Recent History" ? false : true;
  
  return (
    <>
      <h3 style={{
        position: 'sticky',
        top: 0,
        backgroundColor: '#fff',
        zIndex: 10,
        margin: 0,
        paddingTop: '20px',
        paddingBottom: '10px',
        borderBottom: '1px solid #bbb'
      }}>
        {heading}
      </h3>
      <ul className="list">
        {transactions.map(t => (
          <Transaction key={t.id} transaction={t} deleteTransaction={deleteTransaction} isDelete={isDelete} />
        ))}
      </ul>
    </>
  );
}