'use client';

import { Input } from '@/components/commonComponent/InputForm';
import { useState } from 'react';
import { FaArrowRight, FaFilter } from 'react-icons/fa';
import Example from '../order-statistics/page';
import { RevenueChartData } from '@/types/commonType';
import RevenueChart from '@/components/StatComponent/Chart.tsx/RevenueChart';
import RevenueTable from '@/components/StatComponent/RevenueTable';

// Dữ liệu mẫu
const dataByYear: RevenueChartData[] = [
  { time: '2021', income: 380000000, expense: 180000000 },
  { time: '2022', income: 420000000, expense: 190000000 },
  { time: '2023', income: 350000000, expense: 400000000 },
  { time: '2024', income: 510000000, expense: 300000000 },
];

const dataByMonth: RevenueChartData[] = [
  { time: '1/2024', income: 15000000, expense: 12000000 },
  { time: '2/2024', income: 14000000, expense: 11000000 },
  { time: '3/2024', income: 17000000, expense: 13000000 },
  { time: '4/2024', income: 16000000, expense: 15000000 },
  { time: '5/2024', income: 18000000, expense: 14000000 },
  { time: '6/2024', income: 20000000, expense: 15000000 },
];

const dataByDay: RevenueChartData[] = [
  { time: '1/12', income: 500000, expense: 1000000 },
  { time: '2/12', income: 1600000, expense: 400000 },
  { time: '3/12', income: 700000, expense: 500000 },
  { time: '4/12', income: 800000, expense: 600000 },
  { time: '5/12', income: 900000, expense: 200000 },
  { time: '6/12', income: 500000, expense: 800000 },
  { time: '7/12', income: 1100000, expense: 900000 },
  { time: '8/12', income: 1700000, expense: 800000 },
  { time: '9/12', income: 2100000, expense: 1100000 },
  { time: '10/12', income: 1100000, expense: 400000 },
];

function RevenuePage() {
  const [level, setLevel] = useState(1);

  return (
    <div>
      <h2>Doanh thu</h2>
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
          <Input title="Từ ngày" size={4} type="date" placeholder="Chọn" />
          <div style={{ padding: '1rem 1rem 0 0.5rem' }}>
            <FaArrowRight />
          </div>
          <Input title="Đến ngày" size={4} type="date" placeholder="Chọn" />
        </div>
      </div>

      <h3 className='mt-3'>
        <span className="badge bg-secondary px-3">
          <text>Biểu đồ</text>
        </span>
      </h3>
      {/* Chart */}
      {level === 1 && <RevenueChart data={dataByYear} />}
      {level === 2 && <RevenueChart data={dataByMonth} />}
      {level === 3 && <RevenueChart data={dataByDay} />}

      <h3 className='mt-5'>
        <span className="badge bg-secondary px-3">
          <text>Bảng số liệu</text>
        </span>
      </h3>
      {level === 1 && <RevenueTable data={dataByYear} />}
      {level === 2 && <RevenueTable data={dataByMonth} />}
      {level === 3 && <RevenueTable data={dataByDay} />}
    </div>
  );
}

export default RevenuePage;
