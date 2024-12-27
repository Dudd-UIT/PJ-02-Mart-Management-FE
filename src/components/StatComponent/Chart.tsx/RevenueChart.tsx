'use client';

import {Card} from '@/components/commonComponent/Card';
import { RevenueChartData } from '@/types/commonType';
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";


// Hàm formatCurrency để rút gọn biểu diễn tiền
const formatCurrency = (value: number): string => {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  } else if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  } else {
    return value.toLocaleString('vi-VN');
  }
};



interface RevenueChartProps {
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

const RevenueChart: React.FC<RevenueChartProps> = ( {data} ) => {
  const dataMetric = calculateProfitMetrics(data);
  return (
    <div>
            <div className='row justify-content-md-center'>
        <Card title="Tổng lợi nhuận" data={dataMetric.totalProfit} unit='VNĐ'/>
        <Card title="Lợi nhuận bình quân" data={dataMetric.averageProfit} unit='VNĐ'/>
      </div>
      <ResponsiveContainer width={"100%"} height={300}>
        <LineChart data={data} margin={{ top: 20, left: 30, right: 30 }} >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" padding={{ left: 50, right: 30 }} />
          <YAxis tickFormatter={formatCurrency} />
          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
          <Legend />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#5b744b"
            name="Thu"
            strokeWidth={2}
          >
            {/* <LabelList position="top" offset={10} formatter={(value) => formatCurrency(Number(value))} /> */}
          </Line>
          <Line
            type="monotone"
            dataKey="expense"
            stroke="#e57373"
            name="Chi"
            strokeWidth={2}
          >
            {/* <LabelList position="top" offset={10} formatter={(value) => formatCurrency(Number(value))} /> */}
          </Line>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// const Dashboard: React.FC = () => {
//   return (
//     <div>
//       <Chart title="Doanh thu theo năm" data={dataByYear} />
//       <Chart title="Doanh thu theo tháng" data={dataByMonth} />
//       <Chart title="Doanh thu theo ngày" data={dataByDay} />
//     </div>
//   );
// };

export default RevenueChart;
