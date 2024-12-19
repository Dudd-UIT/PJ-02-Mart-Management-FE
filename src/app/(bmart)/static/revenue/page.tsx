'use client';

import { Input } from '@/components/commonComponent/InputForm';
import { useState } from 'react';
import { FaArrowRight, FaFilter } from 'react-icons/fa';

function RevenuePage() {
  const [level, setLevel] = useState(1);

  return (
    <div>
      <h2>Doanh thu</h2>
      <div className="row">
        <div className='col col-md-4'>
          <Input
            title="Thống kê theo"
            value={level}
            size={8}
            onSelectedChange={(value) => {
              setLevel(value);
            }}
            // onClickIcon={handleSearchClick}
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
    </div>
  );
}

export default RevenuePage;
