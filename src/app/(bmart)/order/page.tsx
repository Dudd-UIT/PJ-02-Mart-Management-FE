'use client';

import { Input, SelectInput } from '@/components/commonComponent/InputForm';
import ProtectedComponent from '@/components/commonComponent/ProtectedComponent';
import OrderTable from '@/components/orderComponent/order.table';
import withRoleAuthorization from '@/hoc/withRoleAuthorization';
import { fetchOrders } from '@/services/orderServices';
import { Order, OrderTransform } from '@/types/order';
import Link from 'next/link';
import { useState } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import useSWR, { mutate } from 'swr';

const columns: Column<OrderTransform>[] = [
  { title: '#', key: 'id' },
  { title: 'Tên nhân viên', key: 'staffName' },
  { title: 'Tên khách hàng', key: 'customerName' },
  { title: 'Tổng tiền', key: 'totalPrice' },
  { title: 'PTTT', key: 'paymentMethod' },
  { title: 'TDTT', key: 'paymentTime' },
  { title: 'Loại hóa đơn', key: 'orderType' },
  { title: 'Ngày tạo', key: 'createdAt' },
  { title: 'TT thanh toán', key: 'isPaid' },
  { title: 'TT nhận hàng', key: 'isReceived' },
];

const OrdersPage = () => {
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [searchType, setSearchType] = useState<'staffName' | 'customerName'>(
    'staffName',
  );
  const [searchValue, setSearchValue] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchParams, setSearchParams] = useState({
    staffName: '',
    customerName: '',
    startDate: '',
    endDate: '',
  });

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/orders`;
  const { data, error } = useSWR(
    [
      url,
      current,
      pageSize,
      searchParams.staffName,
      searchParams.customerName,
      startDate,
      endDate,
    ],
    () =>
      fetchOrders(
        current,
        pageSize,
        searchParams.staffName,
        searchParams.customerName,
        startDate,
        endDate,
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

  const orders = data.results.map((item: Order) => ({
    id: item.id,
    staffId: item.staff?.id,
    staffName: item.staff?.name || 'Hệ thống',
    customerId: item.customer?.id,
    customerName: item.customer?.name || 'Khách vãng lai',
    totalPrice: item.totalPrice,
    paymentTime: item.paymentTime,
    paymentMethod: item.paymentMethod,
    isReceived: item.isReceived,
    isPaid: item.isPaid,
    createdAt: item.createdAt,
    orderType: item.orderType,
    orderDetails: item.orderDetails,
  }));

  const meta: MetaData = {
    current,
    pageSize,
    pages: data.meta.pages,
    total: data.meta.total,
  };

  const handleSearchClick = () => {
    setSearchParams({
      staffName: searchType === 'staffName' ? searchValue : '',
      customerName: searchType === 'customerName' ? searchValue : '',
      startDate,
      endDate,
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
      searchParams.customerName,
      startDate,
      endDate,
    ]);

  return (
    <>
      <h2>Quản lý đơn hàng</h2>
      {/* Thanh tìm kiếm gộp */}
      <div className="row">
        <SelectInput
          size={2}
          label="Chọn loại tìm kiếm"
          value={searchType}
          options={[
            { label: 'Tên nhân viên', value: 'staffName' },
            { label: 'Tên khách hàng', value: 'customerName' },
          ]}
          onChange={(value) => setSearchType(value as typeof searchType)}
        />
        <Input
          title="Tìm kiếm"
          size={4}
          value={searchValue}
          placeholder={`Nhập ${
            searchType === 'staffName' ? 'tên nhân viên' : 'tên khách hàng'
          }`}
          type="text"
          onChange={(value) => setSearchValue(value)}
          onClickIcon={handleSearchClick}
          icon={<FaSearch />}
        />
        <Input
          title="Từ ngày"
          size={3}
          value={startDate}
          placeholder="Chọn ngày bắt đầu"
          type="date"
          onChange={(value) => setStartDate(value)}
        />
        <Input
          title="Đến ngày"
          size={3}
          value={endDate}
          placeholder="Chọn ngày kết thúc"
          type="date"
          onChange={(value) => setEndDate(value)}
        />
      </div>

      {/* button Thêm hóa đơn */}
      <ProtectedComponent requiredRoles={['c_order']}>
        <div className="d-flex justify-content-end mx-3">
          <Link
            href="/order/sale"
            className="btn d-flex align-items-center btn-primary"
          >
            <FaPlus />
            <text>Thêm</text>
          </Link>
        </div>
      </ProtectedComponent>

      {/* Quản lý Supplier */}
      <OrderTable orders={orders} columns={columns} onMutate={onMutate} />

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
    </>
  );
};

export default withRoleAuthorization(OrdersPage, ['v_orders']);
