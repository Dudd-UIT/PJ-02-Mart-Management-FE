'use client';

import { Input } from '@/components/commonComponent/InputForm';
import OrderBarChart from '@/components/StatComponent/Chart.tsx/OrderBarChart';
import OrderLineChart from '@/components/StatComponent/Chart.tsx/OrderLineChart';
import { OrderChartData } from '@/types/commonType';
import React, { useState } from 'react';
import { FaArrowRight, FaFilter } from 'react-icons/fa';

const orderValueDistributionByYear: OrderChartData[] = [
  { time: '2024', range: '<200', orders: 2573 },
  { time: '2024', range: '200k-400k', orders: 1611 },
  { time: '2024', range: '400k-600k', orders: 421 },
  { time: '2024', range: '600k-800k', orders: 863 },
  { time: '2024', range: '800k-1M', orders: 382 },
  { time: '2024', range: '>1m', orders: 110 },

  { time: '2023', range: '<200', orders: 2243 },
  { time: '2023', range: '200k-400k', orders: 1230 },
  { time: '2023', range: '400k-600k', orders: 400 },
  { time: '2023', range: '600k-800k', orders: 325 },
  { time: '2023', range: '800k-1M', orders: 243 },
  { time: '2023', range: '>1m', orders: 90 },

  { time: '2022', range: '<200', orders: 1456 },
  { time: '2022', range: '200k-400k', orders: 965 },
  { time: '2022', range: '400k-600k', orders: 532 },
  { time: '2022', range: '600k-800k', orders: 245 },
  { time: '2022', range: '800k-1M', orders: 169 },
  { time: '2022', range: '>1m', orders: 51 },
];
const orderValueDistributionByMonth2024: OrderChartData[] = [
  { time: '1/2024', range: '<200', orders: 199 },
  { time: '1/2024', range: '200k-400k', orders: 137 },
  { time: '1/2024', range: '400k-600k', orders: 50 },
  { time: '1/2024', range: '600k-800k', orders: 135 },
  { time: '1/2024', range: '800k-1M', orders: 37 },
  { time: '1/2024', range: '>1m', orders: 11 },

  { time: '2/2024', range: '<200', orders: 231 },
  { time: '2/2024', range: '200k-400k', orders: 121 },
  { time: '2/2024', range: '400k-600k', orders: 47 },
  { time: '2/2024', range: '600k-800k', orders: 133 },
  { time: '2/2024', range: '800k-1M', orders: 35 },
  { time: '2/2024', range: '>1m', orders: 9 },

  { time: '3/2024', range: '<200', orders: 177 },
  { time: '3/2024', range: '200k-400k', orders: 115 },
  { time: '3/2024', range: '400k-600k', orders: 45 },
  { time: '3/2024', range: '600k-800k', orders: 131 },
  { time: '3/2024', range: '800k-1M', orders: 33 },
  { time: '3/2024', range: '>1m', orders: 7 },

  { time: '4/2024', range: '<200', orders: 245 },
  { time: '4/2024', range: '200k-400k', orders: 109 },
  { time: '4/2024', range: '400k-600k', orders: 43 },
  { time: '4/2024', range: '600k-800k', orders: 129 },
  { time: '4/2024', range: '800k-1M', orders: 31 },
  { time: '4/2024', range: '>1m', orders: 5 },

  { time: '5/2024', range: '<200', orders: 189 },
  { time: '5/2024', range: '200k-400k', orders: 103 },
  { time: '5/2024', range: '400k-600k', orders: 41 },
  { time: '5/2024', range: '600k-800k', orders: 127 },
  { time: '5/2024', range: '800k-1M', orders: 29 },
  { time: '5/2024', range: '>1m', orders: 3 },

  { time: '6/2024', range: '<200', orders: 213 },
  { time: '6/2024', range: '200k-400k', orders: 97 },
  { time: '6/2024', range: '400k-600k', orders: 39 },
  { time: '6/2024', range: '600k-800k', orders: 125 },
  { time: '6/2024', range: '800k-1M', orders: 27 },
  { time: '6/2024', range: '>1m', orders: 1 },

  { time: '7/2024', range: '<200', orders: 165 },
  { time: '7/2024', range: '200k-400k', orders: 91 },
  { time: '7/2024', range: '400k-600k', orders: 37 },
  { time: '7/2024', range: '600k-800k', orders: 123 },
  { time: '7/2024', range: '800k-1M', orders: 25 },
  { time: '7/2024', range: '>1m', orders: 13 },

  { time: '8/2024', range: '<200', orders: 227 },
  { time: '8/2024', range: '200k-400k', orders: 85 },
  { time: '8/2024', range: '400k-600k', orders: 35 },
  { time: '8/2024', range: '600k-800k', orders: 121 },
  { time: '8/2024', range: '800k-1M', orders: 23 },
  { time: '8/2024', range: '>1m', orders: 15 },

  { time: '9/2024', range: '<200', orders: 153 },
  { time: '9/2024', range: '200k-400k', orders: 79 },
  { time: '9/2024', range: '400k-600k', orders: 33 },
  { time: '9/2024', range: '600k-800k', orders: 100 },
  { time: '9/2024', range: '800k-1M', orders: 30 },
  { time: '9/2024', range: '>1m', orders: 8 },

  { time: '10/2024', range: '<200', orders: 201 },
  { time: '10/2024', range: '200k-400k', orders: 73 },
  { time: '10/2024', range: '400k-600k', orders: 31 },
  { time: '10/2024', range: '600k-800k', orders: 98 },
  { time: '10/2024', range: '800k-1M', orders: 28 },
  { time: '10/2024', range: '>1m', orders: 6 },

  { time: '11/2024', range: '<200', orders: 141 },
  { time: '11/2024', range: '200k-400k', orders: 67 },
  { time: '11/2024', range: '400k-600k', orders: 29 },
  { time: '11/2024', range: '600k-800k', orders: 96 },
  { time: '11/2024', range: '800k-1M', orders: 26 },
  { time: '11/2024', range: '>1m', orders: 4 },

  { time: '12/2024', range: '<200', orders: 257 },
  { time: '12/2024', range: '200k-400k', orders: 161 },
  { time: '12/2024', range: '400k-600k', orders: 26 },
  { time: '12/2024', range: '600k-800k', orders: 94 },
  { time: '12/2024', range: '800k-1M', orders: 24 },
  { time: '12/2024', range: '>1m', orders: 2 },
];
const orderValueDistributionByDay = [
  { time: '1/12', range: '<200', orders: 150 },
  { time: '1/12', range: '200k-400k', orders: 300 },
  { time: '1/12', range: '400k-600k', orders: 250 },
  { time: '1/12', range: '600k-800k', orders: 200 },
  { time: '1/12', range: '800k-1M', orders: 80 },
  { time: '1/12', range: '>1m', orders: 20 },

  { time: '2/12', range: '<200', orders: 154 },
  { time: '3/12', range: '<200', orders: 162 },
  { time: '4/12', range: '<200', orders: 162 },
  { time: '5/12', range: '<200', orders: 50 },
  { time: '6/12', range: '<200', orders: 147 },
  { time: '7/12', range: '<200', orders: 142 },
  { time: '8/12', range: '<200', orders: 164 },
  { time: '9/12', range: '<200', orders: 148 },
  { time: '10/12', range: '<200', orders: 159 },
  { time: '11/12', range: '<200', orders: 138 },
  { time: '12/12', range: '<200', orders: 144 },
  { time: '13/12', range: '<200', orders: 136 },
  { time: '14/12', range: '<200', orders: 141 },

  { time: '2/12', range: '200k-400k', orders: 88 },
  { time: '3/12', range: '200k-400k', orders: 311 },
  { time: '4/12', range: '200k-400k', orders: 300 },
  { time: '5/12', range: '200k-400k', orders: 298 },
  { time: '6/12', range: '200k-400k', orders: 209 },
  { time: '7/12', range: '200k-400k', orders: 313 },
  { time: '8/12', range: '200k-400k', orders: 293 },
  { time: '9/12', range: '200k-400k', orders: 298 },
  { time: '10/12', range: '200k-400k', orders: 310 },
  { time: '11/12', range: '200k-400k', orders: 296 },
  { time: '12/12', range: '200k-400k', orders: 293 },
  { time: '13/12', range: '200k-400k', orders: 303 },
  { time: '14/12', range: '200k-400k', orders: 305 },

  { time: '2/12', range: '400k-600k', orders: 359 },
  { time: '3/12', range: '400k-600k', orders: 252 },
  { time: '4/12', range: '400k-600k', orders: 139 },
  { time: '5/12', range: '400k-600k', orders: 240 },
  { time: '6/12', range: '400k-600k', orders: 252 },
  { time: '7/12', range: '400k-600k', orders: 245 },
  { time: '8/12', range: '400k-600k', orders: 260 },
  { time: '9/12', range: '400k-600k', orders: 263 },
  { time: '10/12', range: '400k-600k', orders: 140 },
  { time: '11/12', range: '400k-600k', orders: 238 },
  { time: '12/12', range: '400k-600k', orders: 135 },
  { time: '13/12', range: '400k-600k', orders: 249 },
  { time: '14/12', range: '400k-600k', orders: 141 },
  { time: '2/12', range: '600k-800k', orders: 196 },
  { time: '3/12', range: '600k-800k', orders: 110 },
  { time: '4/12', range: '600k-800k', orders: 187 },
  { time: '5/12', range: '600k-800k', orders: 206 },
  { time: '6/12', range: '600k-800k', orders: 392 },
  { time: '7/12', range: '600k-800k', orders: 111 },
  { time: '8/12', range: '600k-800k', orders: 206 },
  { time: '9/12', range: '600k-800k', orders: 106 },
  { time: '10/12', range: '600k-800k', orders: 213 },
  { time: '11/12', range: '600k-800k', orders: 193 },
  { time: '12/12', range: '600k-800k', orders: 98 },
  { time: '13/12', range: '600k-800k', orders: 209 },
  { time: '14/12', range: '600k-800k', orders: 191 },
  { time: '2/12', range: '800k-1M', orders: 80 },
  { time: '3/12', range: '800k-1M', orders: 92 },
  { time: '4/12', range: '800k-1M', orders: 71 },
  { time: '5/12', range: '800k-1M', orders: 76 },
  { time: '6/12', range: '800k-1M', orders: 88 },
  { time: '7/12', range: '800k-1M', orders: 82 },
  { time: '8/12', range: '800k-1M', orders: 76 },
  { time: '9/12', range: '800k-1M', orders: 74 },
  { time: '10/12', range: '800k-1M', orders: 69 },
  { time: '11/12', range: '800k-1M', orders: 85 },
  { time: '12/12', range: '800k-1M', orders: 79 },
  { time: '13/12', range: '800k-1M', orders: 85 },
  { time: '14/12', range: '800k-1M', orders: 91 },

  { time: '2/12', range: '>1m', orders: 34 },
  { time: '3/12', range: '>1m', orders: 18 },
  { time: '4/12', range: '>1m', orders: 22 },
  { time: '5/12', range: '>1m', orders: 14 },
  { time: '6/12', range: '>1m', orders: 31 },
  { time: '7/12', range: '>1m', orders: 14 },
  { time: '8/12', range: '>1m', orders: 11 },
  { time: '9/12', range: '>1m', orders: 13 },
  { time: '10/12', range: '>1m', orders: 6 },
  { time: '11/12', range: '>1m', orders: 30 },
  { time: '12/12', range: '>1m', orders: 25 },
  { time: '13/12', range: '>1m', orders: 8 },
  { time: '14/12', range: '>1m', orders: 34 },
];

function OrderStat() {
  const [level, setLevel] = useState(1);

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
          <Input title="Từ ngày" size={4} type="date" placeholder="Chọn" />
          <div style={{ padding: '1rem 1rem 0 0.5rem' }}>
            <FaArrowRight />
          </div>
          <Input title="Đến ngày" size={4} type="date" placeholder="Chọn" />
        </div>
      </div>

      <div className="row">
        <div className="col col-md-6">
          {/* LineCharts */}
          <h3 className="mt-3">
            <span className="badge bg-secondary px-3">
              <text>Tổng đơn hàng</text>
            </span>
          </h3>
          {level === 1 && (
            <OrderLineChart data={orderValueDistributionByYear} />
          )}
          {level === 2 && (
            <OrderLineChart data={orderValueDistributionByMonth2024} />
          )}
          {level === 3 && <OrderLineChart data={orderValueDistributionByDay} />}
        </div>
        <div className="col col-md-6">
          {/* BarChart */}
          <h3 className="mt-3">
            <span className="badge bg-secondary px-3">
              <text>Phân phối giá trị đơn hàng</text>
            </span>
          </h3>
          {level === 1 && <OrderBarChart target={'năm'} data={orderValueDistributionByYear} />}
          {level === 2 && (
            <OrderBarChart target={'tháng'} data={orderValueDistributionByMonth2024} />
          )}
          {level === 3 && <OrderBarChart target={'ngày'} data={orderValueDistributionByDay} />}
        </div>
      </div>
    </div>
  );
}

export default OrderStat;
