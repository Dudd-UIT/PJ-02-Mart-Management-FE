'use client';

import { Input, SelectInput } from '@/components/commonComponent/InputForm';
import ProtectedComponent from '@/components/commonComponent/ProtectedComponent';
import CreateInboundReceiptModal from '@/components/inboundReceiptComponent/inboundReceipt.create';
import InboundReceiptTable from '@/components/inboundReceiptComponent/inboundReceipt.table';
import withRoleAuthorization from '@/hoc/withRoleAuthorization';
import { fetchInboundReceipts } from '@/services/inboundReceiptServices';
import {
  InboundReceipt,
  InboundReceiptTransform,
} from '@/types/inboundReceipt';
import { useState } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import useSWR, { mutate } from 'swr';

const columns: Column<InboundReceiptTransform>[] = [
  { title: '#', key: 'id' },
  { title: 'Tên nhân viên', key: 'staffName' },
  { title: 'Tên nhà cung cấp', key: 'supplierName' },
  { title: 'Tổng tiền', key: 'totalPrice' },
  { title: 'TT thanh toán', key: 'isPaid' },
  { title: 'TT nhận hàng', key: 'isReceived' },
  { title: 'Ngày tạo', key: 'createdAt' },
];

const InboundReceiptPage = () => {
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [searchType, setSearchType] = useState<
    'staffName' | 'supplierName' | 'startDate' | 'endDate'
  >('staffName');
  const [searchValue, setSearchValue] = useState('');
  const [searchParams, setSearchParams] = useState({
    staffName: '',
    supplierName: '',
    startDate: '',
    endDate: '',
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/inbound-receipt`;
  const { data, error } = useSWR(
    [
      url,
      current,
      pageSize,
      searchParams.staffName,
      searchParams.supplierName,
      searchParams.startDate,
      searchParams.endDate,
    ],
    () =>
      fetchInboundReceipts(
        current,
        pageSize,
        searchParams.staffName,
        searchParams.supplierName,
        searchParams.startDate,
        searchParams.endDate,
      ),
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

  const inboundReceipts = data.results.map((item: InboundReceipt) => ({
    id: item.id,
    staffId: item.staff?.id,
    staffName: item.staff?.name,
    supplierId: item.supplier?.id,
    supplierName: item.supplier?.name,
    totalPrice: item.totalPrice,
    isReceived: item.isReceived,
    isPaid: item.isPaid,
    createdAt: item.createdAt,
    discount: item.discount,
    vat: item.vat,
    batchs: item.batchs,
  }));

  const meta: MetaData = {
    current,
    pageSize,
    pages: data.meta.pages,
    total: data.meta.total,
  };

  const handleSearchClick = () => {
    setSearchParams({
      ...searchParams,
      staffName: searchType === 'staffName' ? searchValue : '',
      supplierName: searchType === 'supplierName' ? searchValue : '',
      startDate: searchType === 'startDate' ? searchValue : '',
      endDate: searchType === 'endDate' ? searchValue : '',
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
    mutate([
      url,
      current,
      pageSize,
      searchParams.staffName,
      searchParams.supplierName,
      searchParams.startDate,
      searchParams.endDate,
    ]);

  return (
    <>
      <h2>Quản lý đơn nhập hàng</h2>
      {/* Thanh tìm kiếm gộp */}
      <div className="row">
        <SelectInput
          size={2}
          label="Chọn loại tìm kiếm"
          value={searchType}
          options={[
            { label: 'Tên nhân viên', value: 'staffName' },
            { label: 'Tên nhà cung cấp', value: 'supplierName' },
            { label: 'Từ ngày', value: 'startDate' },
            { label: 'Đến ngày', value: 'endDate' },
          ]}
          onChange={(value) => setSearchType(value as typeof searchType)}
        />
        <Input
          title="Tìm kiếm"
          size={4}
          value={searchValue}
          placeholder={`Nhập ${
            searchType === 'staffName'
              ? 'tên nhân viên'
              : searchType === 'supplierName'
              ? 'tên nhà cung cấp'
              : 'ngày'
          }`}
          type={
            searchType === 'startDate' || searchType === 'endDate'
              ? 'date'
              : 'text'
          }
          onChange={(value) => setSearchValue(value)}
          onClickIcon={handleSearchClick}
          icon={<FaSearch />}
        />
      </div>

      {/* button Thêm Supplier */}
      <ProtectedComponent requiredRoles={['c_inbound']}>
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

      {/* Quản lý Supplier */}
      <InboundReceiptTable
        inboundReceipts={inboundReceipts}
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
      <CreateInboundReceiptModal
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
        onMutate={onMutate}
      />
    </>
  );
};

export default withRoleAuthorization(InboundReceiptPage, ['v_inbounds']);
