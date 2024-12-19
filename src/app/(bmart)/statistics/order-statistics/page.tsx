'use client';

import { RevenueChartData } from '@/types/commonType';
import { formatCurrency } from '@/utils/format';
import React, { useState } from 'react';


function RevenueTable (tableData: RevenueChartData[]) {
  const [highlight, setHighlight] = useState(false);

  const toggleHighlight = () => {
    setHighlight(!highlight);
  };

  return (
    <div>
      <button onClick={toggleHighlight}>
        {highlight ? 'Tắt đánh dấu' : 'Bật đánh dấu'}
      </button>

      <table border={1} style={{ width: '100%', textAlign: 'left', marginTop: '1rem' }}>
        <thead>
          <tr>
            <th>Thời gian</th>
            <th>Chi nhập hàng</th>
            <th>Thu bán hàng</th>
            <th>Lợi nhuận</th>
          </tr>
        </thead>
        <tbody>
          {
          tableData.map((row, index) => {
            const profit = row.income - row.expense;
            return (
              <tr
                key={index}
                style={{
                  backgroundColor: highlight && profit < 0 ? 'red' : 'white',
                  color: highlight && profit < 0 ? 'white' : 'black',
                }}
              >
                <td>{row.time}</td>
                <td>{formatCurrency(row.expense)}</td>
                <td>{formatCurrency(row.income)}</td>
                <td>{formatCurrency(profit)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RevenueTable;
