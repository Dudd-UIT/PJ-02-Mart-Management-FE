'use client';

import { RevenueChartData } from '@/types/commonType';
import { formatCurrency } from '@/utils/format';
import React, { useState } from 'react';

// Định nghĩa kiểu cho props
interface RevenueTableProps {
  data: RevenueChartData[];
}

const RevenueTable: React.FC<RevenueTableProps> = ({ data }) => {
  const [highlight, setHighlight] = useState(false);

  const toggleHighlight = () => {
    setHighlight(!highlight);
  };

  return (
    <div>
      <div
        className="form-check form-check-reverse"
        style={{ marginBottom: '-0.5rem' }}
      >
        <input
          className="form-check-input"
          type="checkbox"
          value=""
          id="flexCheckDefault"
          onChange={toggleHighlight}
        />
        <label className="form-check-label" htmlFor="flexCheckDefault">
          Đánh dấu lợi nhuận âm
        </label>
      </div>
      <div
        style={{
          maxHeight: '300px',
          overflowY: 'auto',
          paddingLeft: 2,
          paddingRight: 2,
        }}
      >
        <table className="table">
          <thead>
            <tr className="text-center align-middle">
              <th>Thời gian</th>
              <th>Chi nhập hàng</th>
              <th>Thu bán hàng</th>
              <th>Lợi nhuận</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => {
              const profit = row.income - row.expense;
              return (
                <tr
                  key={index}
                  className={`text-center align-middle ${
                    highlight && profit < 0 ? 'highlight' : ''
                  }`}
                  style={{
                    backgroundColor: highlight && profit < 0 ? 'red' : 'white',
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
    </div>
  );
};

export default RevenueTable;
