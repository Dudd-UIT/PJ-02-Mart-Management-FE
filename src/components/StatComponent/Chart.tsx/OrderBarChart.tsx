'use client';

import { CardSmall } from '@/components/commonComponent/Card';
import { Input } from '@/components/commonComponent/InputForm';
import { OrderChartData } from '@/types/commonType';
import { formatCurrency } from '@/utils/format';
import React, { useState } from 'react';
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
  if (data.length === 0) {
      // return { timeOrders: 0, averageOrderValue: 0 };
    return { timeOrders: 0};
  }

  const timeOrders = data.reduce((sum, row) => sum + row.orders, 0);

  // const averageOrderValue = timeOrders / data.length ;

  return {
    timeOrders,
    // averageOrderValue,
  };
};

const OrderBarChart: React.FC<OrderBarChartProps> = ({ data, target }) => {
  const times = Array.from(new Set(data.map((entry) => entry.time)));
  console.log(times);
  const [selectedTime, setSelectedTime] = useState<string>(
    times.length > 0 ? times[0] : '',
  );

  // Hàm nhóm dữ liệu theo tháng
  const groupDataForBarChart = (
    data: OrderChartData[],
    time: string,
  ): BarChartDataPoint[] => {
    return data
      .filter((entry) => entry.time === time) // Lọc theo tháng được chọn
      .map(({ range, orders }) => ({ range, orders })); // Tạo mảng mới chỉ với range và orders
  };

  // Dữ liệu cho BarChart dựa trên tháng được chọn
  const barChartData = groupDataForBarChart(data, selectedTime);
  const dataMetric = calculateProfitMetrics(barChartData);


  return (
    <div>
      <div className='row justify-content-md-between'>
      <CardSmall title={`Tổng số đơn trong ${selectedTime}`}  data={dataMetric.timeOrders} unit='đơn'/>

        <Input
          title={`Chọn ${target}`}
          value={selectedTime} // Thời gian đang chọn
          size={3}
          onSelectedChange={(value) => {
            setSelectedTime(value); // Cập nhật thời gian được chọn
          }}
          options={times.map((time) => ({ label: time, value: time }))} // Chuyển đổi danh sách thời gian thành options
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
            {/* Tùy chọn hiển thị nhãn giá trị */}
            <LabelList dataKey="orders" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

                  <table className="table px-5 mt-3">
                    <thead>
                      <tr className="text-center align-middle">
                        <th>Giá trị đơn hàng</th>
                        <th>Số đơn hàng</th>
                        <th>Tỉ lệ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {barChartData.map((row, index) => {
                        const rate = ((row.orders/dataMetric.timeOrders)*100).toFixed(2);
                        return (
                          <tr
                            key={index}
                            className={`text-center align-middle`}
                          >
                            <td>{row.range}</td>
                            <td>{formatCurrency(row.orders)}</td>
                            <td>{`${rate}%`}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
    </div>
  );
};

export default OrderBarChart;
