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

const getTransactionDate = (t) => {
  if (!t) return null;

  const created = t.createdAt;

  if (!created) return null;

  if (typeof created?.toDate === 'function') {
    return created.toDate();
  }

  if (typeof created?.seconds === 'number') {
    return new Date(created.seconds * 1000);
  }

  if (typeof created === 'string' || typeof created === 'number') {
    const d = new Date(created);
    if (!isNaN(d)) return d;
  }

  return null;
};

export const Charts = ({ transactions }) => {

  // Build monthly buckets using transaction createdAt
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    return {
      month: new Date(0, i).toLocaleString('default', { month: 'short' }),
      income: 0,
      expense: 0,
    };
  });

  transactions.forEach(t => {
    const date = getTransactionDate(t);

    if (!date) return;

    const monthIndex = date.getMonth(); // 0..11
    if (monthIndex < 0 || monthIndex > 11) return;

    if (t.amount > 0) {
      monthlyData[monthIndex].income += Number(t.amount) || 0;
    } else {
      monthlyData[monthIndex].expense += Math.abs(Number(t.amount) || 0);
    }
  });

  const categoryTotals = {};
  transactions.forEach(t => {
    if (t.amount < 0) {
      const cat = t.category || 'Other';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + Math.abs(Number(t.amount) || 0);
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
