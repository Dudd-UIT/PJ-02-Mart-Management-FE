'use client';

import { Input } from '@/components/commonComponent/InputForm';
import { useState } from 'react';
import { FaArrowRight, FaFilter } from 'react-icons/fa';
import useSWR from 'swr';
import RevenueChart from '@/components/StatComponent/Chart.tsx/RevenueChart';
import RevenueTable from '@/components/StatComponent/RevenueTable';
import { fetchRevenueDetail } from '@/services/statisticServices';
import withRoleAuthorization from '@/hoc/withRoleAuthorization';

function RevenuePage() {
  const [level, setLevel] = useState<string>('1');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/statistics/revenue-detail`;

  const { data, error } = useSWR<RevenueDataItem[], Error>(
    [url, level, startDate, endDate],
    () => fetchRevenueDetail(level, startDate, endDate),
  );

  if (error)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div>{error.message}</div>
      </div>
    );

  if (!data)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-grow text-success" role="status"></div>
        <span className="sr-only text-success">Loading...</span>
      </div>
    );

  return (
    <div>
      <h2>Doanh thu</h2>
      <div className="row">
        <div className="col col-md-4">
          <Input
            title="Thống kê theo"
            value={level}
            size={8}
            onSelectedChange={(value: string) => setLevel(value)}
            icon={<FaFilter />}
            options={[
              { label: 'Năm', value: '1' },
              { label: 'Tháng', value: '2' },
              { label: 'Ngày', value: '3' },
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

      <h3 className="mt-3">
        <span className="badge bg-secondary px-3">Biểu đồ</span>
      </h3>
      <RevenueChart data={data} />

      <h3 className="mt-5">
        <span className="badge bg-secondary px-3">Bảng số liệu</span>
      </h3>
      <RevenueTable data={data} />
    </div>
  );
}

export default withRoleAuthorization(RevenuePage, ['v_statis']);
