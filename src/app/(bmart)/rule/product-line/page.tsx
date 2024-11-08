'use client';

import { Input } from '@/components/commonComponent/InputForm';
import CreateProductLineModal from '@/components/productLineComponent/productLine.create';
import ProductLineTable from '@/components/productLineComponent/productLine.table';
import { fetchProductLines } from '@/services/productLineServices';
import { ProductLine } from '@/types/productLine';
import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa6';
import useSWR, { mutate } from 'swr';

const columns: RenderableColumn<ProductLine>[] = [
  { title: '#', key: 'id' },
  { title: 'Tên dòng sản phẩm', key: 'name' },
  {
    title: 'Tên loại sản phẩm',
    key: 'productType',
    render: (productLine: ProductLine) => productLine.productType.name,
  },
];

function ProductLinePage() {
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [searchName, setSearchName] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useState({ name: '' });

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/product-lines`;

  const { data, error } = useSWR(
    [url, current, pageSize, searchParams.name],
    () => fetchProductLines(url, current, pageSize, searchParams.name),
  );

  if (error)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div>Failed to load product lines: {error.message}</div>
      </div>
    );

  if (!data)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-grow text-success" role="status"></div>
        <span className="sr-only text-success">Loading...</span>
      </div>
    );

  const meta: MetaData = {
    current,
    pageSize,
    pages: data.meta.pages,
    total: data.meta.total,
  };

  const handlePreviousPage = () => {
    if (current > 1) setCurrent(current - 1);
  };

  const handleNextPage = () => {
    if (current < meta.pages) setCurrent(current + 1);
  };

  const handleSearchClick = () => {
    setSearchParams({ name: searchName });
    setCurrent(1);
  };

  const onMutate = () => mutate([url, current, pageSize, searchParams.name]);

  return (
    <>
      <h3>Danh sách dòng sản phẩm</h3>
      {/* button search */}
      <div className="row">
        <Input
          title="Tìm kiếm"
          size={4}
          value={searchName}
          placeholder="Nhập tên dòng sản phẩm"
          onChange={(value) => setSearchName(value)}
          onClickIcon={handleSearchClick}
          icon={<FaSearch />}
        />
      </div>

      {/* button Thêm Product Line */}
      <div className="d-flex justify-content-end mx-3">
        <button
          className="btn btn-primary"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <FaPlus className="align-middle" />
          <text>Thêm</text>
        </button>
      </div>

      {/* Danh sách Product Line */}
      <ProductLineTable
        productLines={data.results}
        columns={columns}
        onMutate={onMutate}
      />

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
      {/* Modal Create Product Type */}
      <CreateProductLineModal
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
        onMutate={onMutate}
      />
    </>
  );
}

export default ProductLinePage;
