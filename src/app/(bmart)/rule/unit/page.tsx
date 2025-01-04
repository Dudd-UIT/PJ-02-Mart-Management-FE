'use client';

import { Input } from '@/components/commonComponent/InputForm';
import ProtectedComponent from '@/components/commonComponent/ProtectedComponent';
import CreateUnitModal from '@/components/unitComponent/unit.create';
import UnitTable from '@/components/unitComponent/unit.table';
import withRoleAuthorization from '@/hoc/withRoleAuthorization';
import { fetchUnits } from '@/services/unitServices';
import { ProductType } from '@/types/productType';
import { useState } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import useSWR, { mutate } from 'swr';

const columns: Column<ProductType>[] = [
  { title: '#', key: 'id' },
  { title: 'Tên đơn vị tính', key: 'name' },
];

function UnitPage() {
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [searchName, setSearchName] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useState({ name: '' });

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/units`;
  const { data, error } = useSWR(
    [url, current, pageSize, searchParams.name],
    () => fetchUnits(current, pageSize, searchParams.name),
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
      <h3>Quản lý đơn vị tính</h3>
      {/* button search */}
      <div className="row">
        <Input
          title="Tên đơn vị tính"
          size={4}
          value={searchName}
          placeholder="Nhập tên đơn vị tính"
          onChange={(value) => setSearchName(value)}
          onClickIcon={handleSearchClick}
          icon={<FaSearch />}
        />
      </div>

      {/* button Thêm Unit */}
      <ProtectedComponent requiredRoles={['c_unit']}>
        <div className="d-flex justify-content-end mx-3">
          <button
            className="btn d-flex align-items-center btn-primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <FaPlus />
            <text>Thêm</text>
          </button>
        </div>
      </ProtectedComponent>

      {/* Quản lý Unit */}
      <UnitTable
        units={data.results}
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
      {/* Modal Create Unit */}
      <CreateUnitModal
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
        onMutate={onMutate}
      />
    </>
  );
}

export default withRoleAuthorization(UnitPage, ['v_units']);