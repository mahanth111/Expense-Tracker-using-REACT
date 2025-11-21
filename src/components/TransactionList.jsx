import React from 'react';
import { Transaction } from './Transaction';

export const TransactionList = ({ transactions, deleteTransaction,heading }) => {
  const isDelete=heading==="Recent History"? false: true
  return(
  <>
    <h3>{heading}</h3>
    <ul className="list">
      {transactions.map(t => (
        <Transaction key={t.id} transaction={t} deleteTransaction={deleteTransaction} isDelete = {isDelete} />
      ))}
    </ul>
  </>
)
}