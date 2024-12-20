'use client';

import { Input } from '@/components/commonComponent/InputForm';
import { useState } from 'react';
import { FaArrowRight, FaFilter } from 'react-icons/fa';

const data = [
    {productSample: 'Sữa Vinamilk 500ml', unit: 'hộp', sale: 5000, inventQuantity: 4000},
    {productSample: 'Mì hảo hảo 250g', unit: 'hộp', sale: 4000, inventQuantity: 100},
    {productSample: 'Sữa ông thọ hộp nhỏ', unit: 'hộp', sale: 15000, inventQuantity: 2000},
    {productSample: 'Bánh mì', unit: 'cái', sale: 2000, inventQuantity: 12000},
    {productSample: 'Salonpas', unit: 'gói', sale: 10000, inventQuantity: 100},
]

interface TopSale {
    productSample: string;
    unit: string;
    sale: number;
    inventQuantity: number;
}

function sortBySaleDescending(data: TopSale[]): TopSale[] {
    return data.sort((a, b) => b.sale - a.sale);
}

const sortedData = sortBySaleDescending(data);
// console.log(sortedData);

function BestSalePage() {
  const [level, setLevel] = useState(1);

  return (
    <div>
      <h2>Sản phẩm thịnh hành</h2>
      {/* search */}
      <div className="row">
        <Input
          title="Thống kê theo"
          value={level}
          size={2}
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

        <div className="col col-md-4 d-flex align-items-center">
          <Input title="Từ ngày" size={5} type="date" placeholder="Chọn" />
          <div style={{ padding: '1rem 1rem 0 0.5rem' }}>
            <FaArrowRight />
          </div>
          <Input title="Đến ngày" size={5} type="date" placeholder="Chọn" />
        </div>

        <Input title="Loại sản phẩm" size={3} />
        <Input title="Dòng sản phẩm" size={3} />
      </div>
      <h3 className="mt-3">
        <span className="badge bg-secondary px-3">
          <text>Các mẫu sản phẩm bán nhiều nhất</text>
        </span>
      </h3>

            <table className="table">
              <thead>
                <tr className="text-center align-middle">
                  <th>#</th>
                  <th>Tên mẫu sản phẩm</th>
                  <th>ĐVT min</th>
                  <th>Số lượng bán được</th>
                  <th>Tồn kho</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((row, index) => {
                  return (
                    <tr
                      key={index}
                      className={`text-center align-middle`}
                    >
                      <td>{index+1}</td>
                      <td>{row.productSample}</td>
                      <td>{row.unit}</td>
                      <td>{row.sale}</td>
                      <td>{row.inventQuantity}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
    </div>
  );
}

export default BestSalePage;
