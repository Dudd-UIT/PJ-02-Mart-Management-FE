'use client';

import { Input } from '@/components/commonComponent/InputForm';
import CreateCustomerModal from '@/components/customerComponent/customer.create';
import CustomerTable from '@/components/customerComponent/customer.table';
import { fetchCustomers } from '@/services/customerServices';
import { Customer } from '@/types/customer';
import { useState } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import useSWR, { mutate } from 'swr';

const columns: Column<Customer>[] = [
  { title: '#', key: 'id' },
  { title: 'Tên khách hàng', key: 'name' },
  { title: 'Số điện thoại', key: 'phone' },
  { title: 'Địa chỉ', key: 'address' },
  { title: 'Email', key: 'email' },
  { title: 'Điểm tích lũy', key: 'score' },
];

const CustomersPage = () => {
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [groupId, setGroupId] = useState(3);
  const [searchName, setSearchName] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [searchParams, setSearchParams] = useState({ name: '', phone: '' });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/users`;

  const { data, error } = useSWR(
    [url, current, pageSize, groupId, searchParams.name, searchParams.phone],
    () =>
      fetchCustomers(
        url,
        current,
        pageSize,
        groupId,
        searchParams.name,
        searchParams.phone,
      ),
  );

  if (error)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div>Failed to load customers: {error.message}</div>
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

  const handleSearchClick = () => {
    setSearchParams({ name: searchName, phone: searchPhone });
    setCurrent(1);
  };

  const handlePreviousPage = () => {
    if (current > 1) setCurrent(current - 1);
  };

  const handleNextPage = () => {
    if (current < meta.pages) setCurrent(current + 1);
  };

  const onMutate = () =>
    mutate(
      [url, current, pageSize, groupId, searchParams.name, searchParams.phone],
      async () =>
        await fetchCustomers(
          url,
          current,
          pageSize,
          groupId,
          searchParams.name,
          searchParams.phone,
        ),
      { revalidate: true },
    );

  return (
    <>
      <h2>Danh sách khách hàng</h2>
      {/* 2 button search */}
      <div className="row">
        <div className="col-md-4">
          <Input
            title="Tên khách hàng"
            size={12}
            value={searchName}
            placeholder="Nhập tên khách hàng"
            onChange={(value) => setSearchName(value)}
            onClickIcon={handleSearchClick}
            icon={<FaSearch />}
          />
        </div>
        <div className="col-md-4">
          <Input
            title="Số điện thoại"
            value={searchPhone}
            size={12}
            placeholder="Nhập số điện thoại"
            onChange={(value) => setSearchPhone(value)}
            onClickIcon={handleSearchClick}
            icon={<FaSearch />}
          />
        </div>
      </div>
      {/* button Thêm Supplier */}
      <div className="d-flex justify-content-end mx-3">
        <button
          className="btn d-flex align-items-center btn-primary"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <FaPlus className="align-middle" />
          <span className="ms-1">
            <text>Thêm</text>
          </span>
        </button>
      </div>
      {/* Danh sách Supplier */}
      <CustomerTable
        customers={data.results}
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
      {/* Modal Create Supplier */}
      <CreateCustomerModal
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
        onMutate={onMutate}
      />
    </>
  );
};

export default CustomersPage;
