// src/components/Charts.jsx
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  ResponsiveContainer,
  Cell
} from 'recharts';

import { getCategoryColor } from '../categoryColors';

export const Charts = ({ transactions }) => {

  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const monthTransactions = transactions.filter(
      t => new Date(t.id).getMonth() + 1 === month
    );

    const income = monthTransactions
      .filter(t => t.amount > 0)
      .reduce((acc, t) => acc + t.amount, 0);

    const expense = monthTransactions
      .filter(t => t.amount < 0)
      .reduce((acc, t) => acc + t.amount, 0) * -1;

    return {
      month: new Date(0, i).toLocaleString('default', { month: 'short' }),
      income,
      expense,
    };
  });

  const categoryTotals = {};
  transactions.forEach(t => {
    if (t.amount < 0) {
      const cat = t.category || 'Other';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + Math.abs(t.amount);
    }
  });

  const barData = Object.entries(categoryTotals).map(([name, value]) => ({
    category: name,
    value,
  }));

  return (
    <div className="charts-container">
      <div className="chart-box">
        <h3>Monthly Income & Expenses</h3>
        <div className="chart-inner">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#2ecc71" />
              <Line type="monotone" dataKey="expense" stroke="#db2b17" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-box">
        <h3>Expenses by Category</h3>
        <div className="chart-inner">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getCategoryColor(entry.category)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
