'use client';

import { Input } from '@/components/commonComponent/InputForm';
import CreateProductSampleModal from '@/components/productSampleComponent/productSample.create';
import ProductSampleUnitTable from '@/components/productSampleComponent/productSample.table';
import { fetchProductLines } from '@/services/productLineServices';
import { fetchProductSamples } from '@/services/productSampleServices';
import { fetchProductTypes } from '@/services/productTypeServices';
import { ProductSample } from '@/types/productSample';
import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { FaFilter, FaPlus } from 'react-icons/fa';
import useSWR, { mutate } from 'swr';

const columns: Column<ProductSample>[] = [
  { title: '#', key: 'id' },
  { title: 'Tên sản phẩm', key: 'name' },
  { title: 'Đơn vị nhỏ nhất', key: 'minUnitName' },
];

function ProductSamplePage() {
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [searchName, setSearchName] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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

  const urlProductSample = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/product-samples`;
  const { data: productSamplesData, error: productSamplesError } = useSWR(
    [urlProductSample, current, pageSize, '', searchProductLineId],
    () => fetchProductSamples(current, pageSize, '', searchProductLineId),
  );
  console.log('Original productSampleData:', productSamplesData);

  const transformedProductSamplesData = {
    ...productSamplesData,
    results: productSamplesData?.results?.map((sample: ProductSample) => {
      const minUnit = sample.productUnits?.find(
        (unit) => unit.conversionRate === null,
      )?.unit;
      const minUnitName = minUnit?.name;
      const minUnitId = minUnit?.id;

      return {
        ...sample,
        minUnitName: minUnitName || null,
        minUnitId: minUnitId || null,
      };
    }),
  };

  console.log('Transformed productSampleData:', transformedProductSamplesData);
  const onMutate = () => {
    mutate([urlProductSample, current, pageSize, '', searchProductLineId]);
  };

  const meta: MetaData = {
    current,
    pageSize,
    pages: transformedProductSamplesData?.meta?.pages,
    total: transformedProductSamplesData?.meta?.total,
  };

  const handlePreviousPage = () => {
    if (current > 1) setCurrent(current - 1);
  };

  const handleNextPage = () => {
    if (current < meta.pages) setCurrent(current + 1);
  };

  const handleProductTypeChange = (value: number) => {
    setSearchProductTypeId(+value);
    setSearchProductLineId(0);
  };

  return (
    <>
      <h3>Danh sách sản phẩm</h3>
      {/* button search */}
      <div className="row">
        <Input
          title="Tìm kiếm"
          size={4}
          value={searchName}
          placeholder="Nhập tên sản phẩm"
          onChange={(value) => setSearchName(value)}
          icon={<FaSearch />}
        />
        <Input
          title="Loại sản phẩm"
          size={4}
          value={searchProductTypeId}
          onSelectedChange={handleProductTypeChange}
          icon={<FaFilter />}
          options={productTypesData?.results}
          placeholder="Chọn tên loại sản phẩm"
        />
        <Input
          title="Dòng sản phẩm"
          size={4}
          value={searchProductLineId}
          onSelectedChange={(value) => setSearchProductLineId(+value)}
          icon={<FaFilter />}
          options={productLinesData?.results}
          placeholder="Chọn tên dòng sản phẩm"
        />
      </div>

      <div className="d-flex justify-content-end mx-3">
        <button
          className="btn d-flex align-items-center btn-primary"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <FaPlus />
          <text>Thêm</text>
        </button>
      </div>

      {transformedProductSamplesData?.results?.length > 0 ? (
        <>
          <ProductSampleUnitTable
            productUnits={
              transformedProductSamplesData?.results?.length > 0
                ? transformedProductSamplesData.results
                : []
            }
            columns={columns}
            onMutate={onMutate}
          />
        </>
      ) : (
        <>
          <div className="d-flex justify-content-center align-items-center">
            <div className="spinner-grow text-success" role="status"></div>
            <span className="sr-only text-success">Loading...</span>
          </div>
        </>
      )}

      {/* Navigate control */}
      <nav aria-label="Page navigation example">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${current === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={handlePreviousPage}>
              Previous
            </button>
          </li>
          {Array.from({ length: meta.pages }, (_, index) => (
            <li
              key={index}
              className={`page-item ${current === index + 1 ? 'active' : ''}`}
            >
              <button
                className="page-link"
                onClick={() => setCurrent(index + 1)}
              >
                {index + 1}
              </button>
            </li>
          ))}
          <li
            className={`page-item ${current === meta.pages ? 'disabled' : ''}`}
          >
            <button className="page-link" onClick={handleNextPage}>
              Next
            </button>
          </li>
        </ul>
      </nav>

      <CreateProductSampleModal
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
        onMutate={onMutate}
      />
    </>
  );
}

export default ProductSamplePage;
