'use client';

import { Input } from '@/components/commonComponent/InputForm';
import CreateUserGroupModal from '@/components/groupComponent/group.create';
import UserGroupTable from '@/components/groupComponent/group.table';
import { fetchGroups } from '@/services/groupServices';
import { Group } from '@/types/group';
import { useState } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import useSWR, { mutate } from 'swr';

const columns: Column<Group>[] = [
  { title: '#', key: 'id' },
  { title: 'Tên nhóm người dùng', key: 'name' },
  { title: 'Mô tả', key: 'description' },
];

const UserGroupsPage = () => {
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchName, setSearchName] = useState('');
  const [searchParams, setSearchParams] = useState({ name: '' });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/groups`;
  const { data, error } = useSWR(
    [url, current, pageSize, searchParams.name],
    () => fetchGroups(current, pageSize, searchParams.name),
  );

  if (error)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div>Failed to load groups: {error.message}</div>
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
    setSearchParams({ name: searchName });
    setCurrent(1);
  };

  const handlePreviousPage = () => {
    if (current > 1) setCurrent(current - 1);
  };

  const handleNextPage = () => {
    if (current < meta.pages) setCurrent(current + 1);
  };

  const onMutate = () => mutate([current, pageSize, searchParams.name]);

  return (
    <>
      <h2>Quản lý nhóm người dùng</h2>
      {/* 2 button search */}
      <div className="row">
        <Input
          title="Tên nhóm người dùng"
          size={4}
          value={searchName}
          placeholder="Nhập tên nhóm người dùng"
          onChange={(value) => setSearchName(value)}
          onClickIcon={handleSearchClick}
          icon={<FaSearch />}
        />
      </div>
      {/* button Thêm Supplier */}
      <div className="d-flex justify-content-end mx-3">
        <button
          className="btn d-flex align-items-center btn-primary"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <FaPlus />
          <text>Thêm</text>
        </button>
      </div>
      {/* Quản lý Supplier */}
      <UserGroupTable
        groups={data.results}
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
      <CreateUserGroupModal
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
        onMutate={onMutate}
      />
    </>
  );
};

export default UserGroupsPage;
