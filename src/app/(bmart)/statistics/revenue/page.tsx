'use client';

import { Input } from '@/components/commonComponent/InputForm';
import { useState } from 'react';
import { FaArrowRight, FaFilter } from 'react-icons/fa';
import useSWR from 'swr';
import RevenueChart from '@/components/StatComponent/Chart.tsx/RevenueChart';
import RevenueTable from '@/components/StatComponent/RevenueTable';

// Định nghĩa kiểu cho dữ liệu được trả về từ API
type RevenueDataItem = {
  time: string;
  income: number;
  expense: number;
};

// Định nghĩa fetcher với kiểu chính xác
const fetcher = async (
  url: string,
  level: string,
  date: string,
): Promise<RevenueDataItem[]> => {
  const response = await fetch(`${url}?level=${level}&date=${date}`);
  if (!response.ok) {
    throw new Error('Failed to fetch revenue data');
  }
  const data = await response.json();
  return data?.data.map((item: any) => ({
    time: item.time,
    income: item.income || 0, // Giá trị mặc định là 0 nếu không có dữ liệu
    expense: item.expense || 0,
  }));
};

function RevenuePage() {
  const [level, setLevel] = useState<string>('1');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0],
  );

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/statistics/revenue-detail`;

  // Sử dụng fetcher và truyền key dưới dạng chuỗi
  const { data, error } = useSWR<RevenueDataItem[], Error>(
    [url, level, selectedDate].join('|'),
    () => fetcher(url, level, selectedDate), // Truyền tham số rõ ràng vào fetcher
  );

  if (error) {
    console.error('Error fetching data:', error);
    return <div>Error loading data</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

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
            title="Chọn ngày"
            size={4}
            type="date"
            placeholder="Chọn ngày"
            value={selectedDate}
            onChange={(value: string) => setSelectedDate(value)}
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

export default RevenuePage;
