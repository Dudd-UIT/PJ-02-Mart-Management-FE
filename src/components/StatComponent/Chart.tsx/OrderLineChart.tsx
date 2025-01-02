'use client';

import { Card, CardSmall } from '@/components/commonComponent/Card';
import { OrderChartData } from '@/types/commonType';
import { formatCurrency } from '@/utils/format';
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
  BarChart,
  Bar,
  LabelList,
} from 'recharts';

interface OrderLineChartProps {
  data: OrderChartData[];
}

type LineChartDataPoint = {
  time: string;
  totalOrders: number;
};

interface ProfitMetrics {
  timeOrders: number;
  averageOrder: number;
}

const calculateProfitMetrics = (data: LineChartDataPoint[]): ProfitMetrics => {
  if (data.length === 0) {
    return { timeOrders: 0, averageOrder: 0 };
  }

  const timeOrders = data.reduce((sum, row) => sum + row.totalOrders, 0);

  const averageOrder = Math.round(timeOrders / data.length);

  return {
    timeOrders,
    averageOrder,
  };
};

const OrderLineChart: React.FC<OrderLineChartProps> = ({ data }) => {
  const groupDataForLineChart = (
    data: OrderChartData[],
  ): LineChartDataPoint[] => {
    const groupedData: Record<string, number> = {};

    data?.forEach(({ time, orders }) => {
      if (!groupedData[time]) {
        groupedData[time] = 0;
      }
      groupedData[time] += orders;
    });

    // Chuyển đổi dữ liệu thành mảng phù hợp với LineChart
    return Object.entries(groupedData).map(([time, totalOrders]) => ({
      time,
      totalOrders,
    }));
  };

  const lineChartData = groupDataForLineChart(data);

  const dataMetric = calculateProfitMetrics(lineChartData);

  return (
    <div>
      <div className="row justify-content-md-center">
        <CardSmall
          title="Tổng số đơn"
          data={dataMetric.timeOrders}
          unit="đơn"
        />
        <CardSmall
          title="Số đơn hàng trung bình"
          data={dataMetric.averageOrder}
          unit="đơn"
        />
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={lineChartData} margin={{ top: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" padding={{ left: 30, right: 30 }} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="totalOrders"
            stroke="#5b744b"
            name="Số đơn hàng"
          />
        </LineChart>
      </ResponsiveContainer>

      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        <table className="table px-5 mt-3">
          <thead>
            <tr className="text-center align-middle">
              <th>Thời gian</th>
              <th>Số đơn hàng</th>
              <th>Tỉ lệ</th>
            </tr>
          </thead>
          <tbody>
            {lineChartData.map((row, index) => {
              const rate = (
                (row.totalOrders / dataMetric.timeOrders) *
                100
              ).toFixed(2);
              return (
                <tr key={index} className={`text-center align-middle`}>
                  <td>{row.time}</td>
                  <td>{formatCurrency(row.totalOrders)}</td>
                  <td>{`${rate}%`}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderLineChart;
