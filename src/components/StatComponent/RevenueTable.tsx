'use client';

import { RevenueChartData } from '@/types/commonType';
import { formatCurrency } from '@/utils/format';
import React, { useState } from 'react';
import Card from '../commonComponent/Card';

// Định nghĩa kiểu cho props
interface RevenueTableProps {
  data: RevenueChartData[];
}

interface ProfitMetrics {
  totalProfit: number;
  averageProfit: number;
}

const calculateProfitMetrics = (data: RevenueChartData[]): ProfitMetrics => {
  if (data.length === 0) {
    return { totalProfit: 0, averageProfit: 0 };
  }

  const totalProfit = data.reduce(
    (sum, row) => sum + (row.income - row.expense),
    0,
  );

  const averageProfit = totalProfit / data.length;

  return {
    totalProfit,
    averageProfit,
  };
};

const RevenueTable: React.FC<RevenueTableProps> = ({ data }) => {
  const [highlight, setHighlight] = useState(false);

  const toggleHighlight = () => {
    setHighlight(!highlight);
  };

  const dataMetric = calculateProfitMetrics(data);

  return (
    <div>
      {/* <div className='d-flex'>
        <Card title="Tổng lợi nhuận" data={dataMetric.totalProfit} />
        <Card title="Lợi nhuận bình quân" data={dataMetric.averageProfit} />
      </div> */}

      <div className="form-check form-check-reverse" style={{marginBottom: '-0.5rem'}}>
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
  );
};

export default RevenueTable;
