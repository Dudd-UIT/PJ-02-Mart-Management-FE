'use client';

import { Input } from '@/components/commonComponent/InputForm';
import OrderBarChart from '@/components/StatComponent/Chart.tsx/OrderBarChart';
import OrderLineChart from '@/components/StatComponent/Chart.tsx/OrderLineChart';
import {
  fetchOrderStatistic,
  fetchOrderValueDistribution,
} from '@/services/statisticServices';
import React, { useState } from 'react';
import { FaArrowRight, FaFilter } from 'react-icons/fa';
import useSWR from 'swr';

function OrderStat() {
  const [level, setLevel] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/statistics/order-statistics`;
  const urlDistribution = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/statistics/order-value-distribution`;

  const { data: orderStats, error: orderStatsError } = useSWR(
    [url, level, startDate, endDate],
    () => fetchOrderStatistic(level.toString(), startDate, endDate),
  );

  const { data: orderDistributions, error: orderDistributionsError } = useSWR(
    [urlDistribution, level, startDate, endDate],
    () => fetchOrderValueDistribution(level.toString(), startDate, endDate),
  );

  console.log('orderDistributions', orderDistributions);

  if (orderStatsError)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div>{orderStatsError.message}</div>
      </div>
    );

  if (!orderStats)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-grow text-success" role="status"></div>
        <span className="sr-only text-success">Loading...</span>
      </div>
    );

  return (
    <div>
      <h2>Thống kê đơn hàng</h2>
      {/* search */}
      <div className="row">
        <div className="col col-md-4">
          <Input
            title="Thống kê theo"
            value={level}
            size={8}
            onSelectedChange={(value) => {
              setLevel(value);
            }}
            icon={<FaFilter />}
            options={[
              { label: 'Năm', value: 1 },
              { label: 'Tháng', value: 2 },
              { label: 'Ngày', value: 3 },
            ]}
            keyObj="value"
            showObj="label"
          />
        </div>

        <div className="col col-md-8 d-flex align-items-center">
          <Input
            title="Từ ngày"
            size={4}
            type="date"
            value={startDate}
            placeholder="Chọn"
            onChange={(value: string) => setStartDate(value)}
          />
          <div style={{ padding: '1rem 1rem 0 0.5rem' }}>
            <FaArrowRight />
          </div>
          <Input
            title="Đến ngày"
            size={4}
            type="date"
            placeholder="Chọn"
            value={endDate}
            onChange={(value: string) => setEndDate(value)}
          />
        </div>
      </div>

      <div className="row">
        <div className="col col-md-6">
          <h3 className="mt-3">
            <span className="badge bg-secondary px-3">
              <text>Tổng đơn hàng</text>
            </span>
          </h3>
          {level === 1 && <OrderLineChart data={orderStats} />}
          {level === 2 && <OrderLineChart data={orderStats} />}
          {level === 3 && <OrderLineChart data={orderStats} />}

          {/* <OrderLineChart data={orderStats} /> */}
        </div>
        <div className="col col-md-6">
          <h3 className="mt-3">
            <span className="badge bg-secondary px-3">
              <text>Phân phối giá trị đơn hàng</text>
            </span>
          </h3>
          {level === 1 && (
            <OrderBarChart target={'năm'} data={orderDistributions} />
          )}
          {level === 2 && (
            <OrderBarChart target={'tháng'} data={orderDistributions} />
          )}
          {level === 3 && (
            <OrderBarChart target={'ngày'} data={orderDistributions} />
          )}

          {/* <OrderBarChart target={'năm'} data={orderDistributions} /> */}
        </div>
      </div>
    </div>
  );
}

export default OrderStat;
