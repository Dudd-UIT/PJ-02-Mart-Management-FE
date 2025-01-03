'use client';

import { Input, SelectInput } from '@/components/commonComponent/InputForm';
import ProtectedComponent from '@/components/commonComponent/ProtectedComponent';
import CreateStaffModal from '@/components/staffComponent/staff.create';
import StaffTable from '@/components/staffComponent/staff.table';
import withRoleAuthorization from '@/hoc/withRoleAuthorization';
import { fetchStaffs } from '@/services/staffServices';
import { Staff } from '@/types/staff';
import { useState } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import useSWR, { mutate } from 'swr';

const columns: Column<Staff>[] = [
  { title: '#', key: 'id' },
  { title: 'Tên nhân viên', key: 'name' },
  { title: 'Số điện thoại', key: 'phone' },
  { title: 'Địa chỉ', key: 'address' },
  { title: 'Email', key: 'email' },
  { title: 'Tình trạng', key: 'isActive' },
];

const StaffsPage = () => {
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [groupId, setGroupId] = useState(2);
  const [searchValue, setSearchValue] = useState('');
  const [searchType, setSearchType] = useState<'name' | 'phone'>('name'); // Loại tìm kiếm (name hoặc phone)
  const [searchParams, setSearchParams] = useState({ name: '', phone: '' });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/users`;
  const { data, error } = useSWR(
    [url, current, pageSize, groupId, searchParams.name, searchParams.phone],
    () =>
      fetchStaffs(
        current,
        pageSize,
        groupId,
        searchParams.name,
        searchParams.phone,
      ),
  );

  console.log('data', data);

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

  const handleSearchClick = () => {
    setSearchParams({
      name: searchType === 'name' ? searchValue : '',
      phone: searchType === 'phone' ? searchValue : '',
    });
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
        await fetchStaffs(
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
      <h2>Quản lý nhân viên</h2>
      {/* Thanh tìm kiếm gộp */}
      <div className="row">
        <SelectInput
          size={2}
          label="Chọn loại tìm kiếm"
          value={searchType}
          options={[
            { label: 'Tên nhân viên', value: 'name' },
            { label: 'Số điện thoại', value: 'phone' },
          ]}
          onChange={(value) => setSearchType(value as 'name' | 'phone')}
        />
        <Input
          title="Tìm kiếm"
          size={4}
          value={searchValue}
          placeholder={`Nhập ${
            searchType === 'name' ? 'tên nhân viên' : 'số điện thoại'
          }`}
          onChange={(value) => setSearchValue(value)}
          onClickIcon={handleSearchClick}
          icon={<FaSearch />}
        />
      </div>

      {/* button Thêm Nhân viên */}
      <ProtectedComponent requiredRoles={['c_staff']}>
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

      {/* Quản lý Nhân viên */}
      <StaffTable staffs={data.results} columns={columns} onMutate={onMutate} />

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

      {/* Modal Create Nhân viên */}
      <CreateStaffModal
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
        onMutate={onMutate}
      />
    </>
  );
};

export default withRoleAuthorization(StaffsPage, ['v_staffs']);
