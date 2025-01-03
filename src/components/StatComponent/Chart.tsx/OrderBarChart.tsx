'use client';

import { CardSmall } from '@/components/commonComponent/Card';
import { Input } from '@/components/commonComponent/InputForm';
import { OrderChartData } from '@/types/commonType';
import { downloadExcel } from '@/utils/downloadExcel';
import { formatCurrency } from '@/utils/format';
import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from 'recharts';

interface OrderBarChartProps {
  data: OrderChartData[]; // Input data
  target: string;
}

type BarChartDataPoint = {
  range: string;
  orders: number;
};

interface ProfitMetrics {
  timeOrders: number;
  // averageOrderValue: number;
}

const calculateProfitMetrics = (data: BarChartDataPoint[]): ProfitMetrics => {
  if (data?.length === 0) {
    // return { timeOrders: 0, averageOrderValue: 0 };
    return { timeOrders: 0 };
  }

  const timeOrders = data?.reduce((sum, row) => sum + row.orders, 0);

  // const averageOrderValue = timeOrders / data.length ;

  return {
    timeOrders,
    // averageOrderValue,
  };
};

const OrderBarChart: React.FC<OrderBarChartProps> = ({ data, target }) => {
  const times = Array.from(new Set(data?.map((entry) => entry.time) || []));
  const [selectedTime, setSelectedTime] = useState<string>('');

  // Cập nhật selectedTime khi dữ liệu times thay đổi
  useEffect(() => {
    if (times.length > 0 && !selectedTime) {
      setSelectedTime(times[0]); // Chọn thời gian đầu tiên khi times có dữ liệu
    }
  }, [times, selectedTime]);

  console.log('data', data);
  console.log('times', times);

  // Hàm nhóm dữ liệu theo thời gian được chọn
  const groupDataForBarChart = (
    data: OrderChartData[],
    time: string,
  ): BarChartDataPoint[] => {
    return data
      ?.filter((entry) => entry.time === time)
      ?.map(({ range, orders }) => ({ range, orders }));
  };

  const handleExport = (): void => {
      const formattedData = barChartData.map(row => {
        const rate = ((row.orders / dataMetric.timeOrders) * 100).toFixed(2);
        
        return ({
        'Giá trị đơn hàng': row.range,
        'Số đơn hàng': formatCurrency(row.orders),
        'Tỉ lệ': `${rate}%`,
      })});
      downloadExcel(formattedData);
    };

  // Dữ liệu cho BarChart dựa trên thời gian được chọn
  const barChartData = selectedTime
    ? groupDataForBarChart(data, selectedTime)
    : [];
  const dataMetric = calculateProfitMetrics(barChartData);

  if (!data || times.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center">
        <span>Đang tải dữ liệu...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="row justify-content-md-between">
        <CardSmall
          title={`Tổng số đơn trong ${selectedTime}`}
          data={dataMetric.timeOrders}
          unit="đơn"
        />

        <Input
          title={`Chọn ${target}`}
          value={selectedTime}
          size={3}
          onSelectedChange={(value) => setSelectedTime(value)}
          options={times?.map((time) => ({ label: time, value: time }))}
          keyObj="value"
          showObj="label"
        />
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={barChartData} margin={{ top: 20, left: 10, right: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="range" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="orders" fill="#5b744b" name="Số đơn hàng">
            <LabelList dataKey="orders" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
      <button onClick={handleExport} className="btn btn-primary">
          Xuất số liệu
        </button>
        <table className="table px-5 mt-3">
          <thead>
            <tr className="text-center align-middle">
              <th>Giá trị đơn hàng</th>
              <th>Số đơn hàng</th>
              <th>Tỉ lệ</th>
            </tr>
          </thead>
          <tbody>
            {barChartData?.map((row, index) => {
              const rate = ((row.orders / dataMetric.timeOrders) * 100).toFixed(
                2,
              );
              return (
                <tr key={index} className={`text-center align-middle`}>
                  <td>{row.range}</td>
                  <td>{formatCurrency(row.orders)}</td>
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

export default OrderBarChart;
