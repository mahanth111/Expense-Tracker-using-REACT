import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#00cec9', '#fd79a8', '#ffeaa7', '#fab1a0', '#74b9ff'];

export const Charts = ({ transactions }) => {
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const monthTransactions = transactions.filter(
      t => new Date(t.id).getMonth() + 1 === month
    );

    const income = monthTransactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
    const expense = monthTransactions.filter(t => t.amount < 0).reduce((acc, t) => acc + t.amount, 0) * -1;

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

  const pieData = Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));

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
              <Line type="monotone" dataKey="expense" stroke="#c0392b" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-box">
        <h3>Expenses by Category</h3>
        <div className="chart-inner">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="80%" label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
