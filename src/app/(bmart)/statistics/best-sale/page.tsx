'use client';

import { useState } from 'react';
import { Input } from '@/components/commonComponent/InputForm';
import { FaArrowRight, FaFilter } from 'react-icons/fa';
import useSWR from 'swr';
import { fetchBestSeller } from '@/services/statisticServices';
import { fetchProductTypes } from '@/services/productTypeServices';
import { fetchProductLines } from '@/services/productLineServices';

function BestSalePage() {
  const [level, setLevel] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/statistics/top-selling-products`;
  const [searchProductTypeId, setSearchProductTypeId] = useState<number>(0);
  const [searchProductLineId, setSearchProductLineId] = useState<number>(0);

  const urlProductType = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/product-types`;
  const { data: productTypesData, error: productTypesError } = useSWR(
    [urlProductType],
    () => fetchProductTypes(1, 100),
  );

  const urlProductLine = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/product-lines`;
  const { data: productLinesData, error: productLinesError } = useSWR(
    [urlProductLine, searchProductTypeId],
    () => fetchProductLines(1, 100, '', searchProductTypeId),
  );

  const { data: topSales, error } = useSWR(
    [url, level, startDate, endDate, searchProductTypeId, searchProductLineId],
    () =>
      fetchBestSeller(
        level.toString(),
        searchProductTypeId,
        searchProductLineId,
        startDate,
        endDate,
      ),
  );

  const handleProductTypeChange = (value: number) => {
    setSearchProductTypeId(+value);
    setSearchProductLineId(0);
  };

  if (error)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div>{error.message}</div>
      </div>
    );

  if (!topSales)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-grow text-success" role="status"></div>
        <span className="sr-only text-success">Loading...</span>
      </div>
    );

  return (
    <div>
      <h2>Sản phẩm thịnh hành</h2>
      {/* Search */}
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
        <Input
          title="Loại sản phẩm"
          size={3}
          value={searchProductTypeId}
          onSelectedChange={handleProductTypeChange}
          icon={<FaFilter />}
          options={productTypesData?.results}
          placeholder="Chọn tên loại sản phẩm"
        />
        <Input
          title="Dòng sản phẩm"
          size={3}
          value={searchProductLineId}
          onSelectedChange={(value) => setSearchProductLineId(+value)}
          icon={<FaFilter />}
          options={productLinesData?.results}
          placeholder="Chọn tên dòng sản phẩm"
        />
        <div className="col col-md-4 d-flex align-items-center">
          <Input
            title="Từ ngày"
            size={5}
            type="date"
            value={startDate}
            onChange={(value) => setStartDate(value)}
            placeholder="Chọn"
          />
          <div style={{ padding: '1rem 1rem 0 0.5rem' }}>
            <FaArrowRight />
          </div>
          <Input
            title="Đến ngày"
            size={5}
            type="date"
            value={endDate}
            onChange={(value) => setEndDate(value)}
            placeholder="Chọn"
          />
        </div>
      </div>

      <h3 className="mt-3">
        <span className="badge bg-secondary px-3">
          Các mẫu sản phẩm bán nhiều nhất
        </span>
      </h3>

      <table className="table">
        <thead>
          <tr className="text-center align-middle">
            <th>#</th>
            <th>Tên mẫu sản phẩm</th>
            <th>ĐVT</th>
            <th>Số lượng bán được</th>
            <th>Tồn kho</th>
          </tr>
        </thead>
        <tbody>
          {topSales.map((row: TopSale, index: number) => (
            <tr key={index} className="text-center align-middle">
              <td>{index + 1}</td>
              <td>{row.productSampleName}</td>
              <td>{row.unitName}</td>
              <td>{row.totalSold}</td>
              <td>{row.inventQuantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BestSalePage;
