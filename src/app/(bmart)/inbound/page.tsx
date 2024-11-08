'use client';

import { Input } from '@/components/commonComponent/InputForm';
import CreateInboundReceiptModal from '@/components/inboundReceiptComponent/inboundReceipt.create';
import InboundReceiptTable from '@/components/inboundReceiptComponent/inboundReceipt.table';
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
  { title: 'Trạng thái thanh toán', key: 'isPaid' },
  { title: 'Trạng thái nhận hàng', key: 'isReceived' },
  { title: 'Ngày tạo', key: 'createdAt' },
];

const InboundReceiptPage = () => {
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchStaffName, setSearchStaffName] = useState('');
  const [searchSupplierName, setSearchSupplierName] = useState('');
  const [searchStartDate, setSearchStartDate] = useState('');
  const [searchEndDate, setSearchEndDate] = useState('');
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
        url,
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
        <div>Failed to load suppliers: {error.message}</div>
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
      staffName: searchStaffName,
      supplierName: searchSupplierName,
      startDate: searchStartDate,
      endDate: searchEndDate,
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
      <h2>Danh sách đơn nhập hàng</h2>
      {/* 2 button search */}
      <div className="row">
        <Input
          title="Tên nhân viên"
          size={3}
          value={searchStaffName}
          placeholder="Nhập tên nhân viên"
          onChange={(value) => setSearchStaffName(value)}
          onClickIcon={handleSearchClick}
          icon={<FaSearch />}
        />
        <Input
          title="Tên nhà cung cấp"
          size={4}
          value={searchSupplierName}
          placeholder="Nhập tên nhà cung cấp"
          onChange={(value) => setSearchSupplierName(value)}
          onClickIcon={handleSearchClick}
          icon={<FaSearch />}
        />
        <Input
          title="Từ ngày"
          value={searchStartDate}
          size={2}
          type="date"
          onChange={(value) => {
            setSearchStartDate(value);
          }}
          onClickIcon={handleSearchClick}
          icon={<FaSearch />}
        />
        <Input
          title="Đến ngày"
          value={searchEndDate}
          size={2}
          type="date"
          onChange={(value) => setSearchEndDate(value)}
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
          <FaPlus className="align-middle" />
          <text>Thêm</text>
        </button>
      </div>
      {/* Danh sách Supplier */}
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

export default InboundReceiptPage;
