'use client';

import { Input, SelectInput } from '@/components/commonComponent/InputForm';
import { fetchProductUnits } from '@/services/productUnitServices';
import { ProductUnit, ProductUnitTransform } from '@/types/productUnit';
import { useState } from 'react';
import { FaPlus, FaMinus, FaTrash, FaSearch } from 'react-icons/fa';
import useSWR from 'swr';
import Image from 'next/image';
import { OrderDetailTransform } from '@/types/order';
import {
  fetchCustomers,
  handleUpdateCustomerAction,
} from '@/services/customerServices';
import { fetchParameters } from '@/services/parameterServices';
import { toast } from 'react-toastify';
import { Customer } from '@/types/customer';
import { handleCreatedOrderAction } from '@/services/orderServices';
import Link from 'next/link';
import withRoleAuthorization from '@/hoc/withRoleAuthorization';
import ProtectedComponent from '@/components/commonComponent/ProtectedComponent';

const columns: Column<OrderDetailTransform>[] = [
  { title: '#', key: 'id' },
  { title: 'Tên sản phẩm', key: 'productSampleName' },
  { title: 'Đơn vị', key: 'unitName' },
  { title: 'Số lượng', key: 'quantity' },
  { title: 'Giá', key: 'currentPrice' },
];

type FormDataOrder = {
  staffId: number;
  customerId: number;
  totalPrice: number;
  paymentMethod: string;
  paymentTime: Date;
  isReceived: number;
  isPaid: number;
  orderType: string;
};

function SalePage() {
  const [cart, setCart] = useState<OrderDetailTransform[]>([]);

  const [searchValue, setSearchValue] = useState('');
  const [searchType, setSearchType] = useState<'name' | 'id'>('name');
  const [searchParams, setSearchParams] = useState({ name: '', id: '' });

  const [customerPhone, setCustomerPhone] = useState('');
  const [customer, setCustomer] = useState<Customer>();

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const pageSizeCart = 4;
  const [currentCartPage, setCurrentCartPage] = useState(1);

  const initialOrder = {
    staffId: 0,
    customerId: 0,
    totalPrice: 0,
    paymentMethod: 'Tiền mặt',
    paymentTime: new Date(),
    isReceived: 1,
    isPaid: 0,
    orderType: 'Trực tiếp',
  };

  const [formDataOrder, setFormDataOrder] =
    useState<FormDataOrder>(initialOrder);

  const urlProductUnit = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/product-units`;
  const { data: productUnitsData, error: productUnitsError } = useSWR(
    [urlProductUnit, current, pageSize, searchParams.name, searchParams.id],
    () =>
      fetchProductUnits(current, pageSize, searchParams.name, searchParams.id),
  );

  const meta: MetaData = {
    current,
    pageSize,
    pages: productUnitsData?.meta.pages,
    total: productUnitsData?.meta.total,
  };

  const urlParameter = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/parameters`;
  const { data: parameterData, error: parameterError } = useSWR(
    [urlParameter, current, pageSize, searchParams.name, searchParams.id],
    () => fetchParameters(),
  );

  if (productUnitsError)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div>Failed to load products: {productUnitsError.message}</div>
      </div>
    );

  if (!productUnitsData)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-grow text-success" role="status"></div>
        <span className="sr-only text-success">Loading...</span>
      </div>
    );

  const productUnits: ProductUnitTransform[] = productUnitsData.results.map(
    (item: ProductUnit) => ({
      id: item.id,
      sellPrice: item.sellPrice,
      conversionRate: item.conversionRate,
      createdAt: item.createdAt,
      volumne: item.volumne,
      image: item.image,
      productSampleName: item.productSample?.name,
      unitName: item.unit?.name,
    }),
  );

  const handleSearchClick = () => {
    setSearchParams({
      name: searchType === 'name' ? searchValue : '',
      id: searchType === 'id' ? searchValue : '',
    });
    setCurrent(1);
  };

  const handleOrderInfoChange = (
    field: keyof typeof formDataOrder,
    value: string | number,
  ) => {
    setFormDataOrder((prev) => ({ ...prev, [field]: value }));
  };

  const addToCart = (productUnit: ProductUnitTransform) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === productUnit.id);

      let updatedCart;
      if (existingItem) {
        updatedCart = prevCart.map((item) =>
          item.id === productUnit.id
            ? { ...item, quantity: item.quantity! + 1 }
            : item,
        );
      } else {
        updatedCart = [
          ...prevCart,
          {
            id: productUnit.id,
            quantity: 1,
            currentPrice: productUnit.sellPrice,
            productSampleName: productUnit.productSampleName,
            unitName: productUnit.unitName,
          },
        ];
      }

      // Tính toán tổng ngay khi cập nhật giỏ hàng
      const newTotal = updatedCart.reduce(
        (acc, item) => acc + item.currentPrice * (item.quantity || 0),
        0,
      );
      handleOrderInfoChange('totalPrice', newTotal);

      return updatedCart;
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.id !== productId);

      // Tính toán tổng ngay khi cập nhật giỏ hàng
      const newTotal = updatedCart.reduce(
        (acc, item) => acc + item.currentPrice * (item.quantity || 0),
        0,
      );
      handleOrderInfoChange('totalPrice', newTotal);

      return updatedCart;
    });
  };

  const updateQuantity = (productId: number, increment: number) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity: Math.max(1, (item.quantity || 0) + increment),
            }
          : item,
      );

      // Tính toán tổng ngay khi cập nhật giỏ hàng
      const newTotal = updatedCart.reduce(
        (acc, item) => acc + item.currentPrice * (item.quantity || 0),
        0,
      );
      handleOrderInfoChange('totalPrice', newTotal);

      return updatedCart;
    });
  };

  const handleSearchCustomer = async () => {
    try {
      if (customerPhone) {
        const data = await fetchCustomers(1, 1, 3, '', customerPhone);
        if (data.results.length > 0) {
          setCustomer(data.results[0]);
          handleOrderInfoChange('customerId', data.results[0].id);
        } else {
          setCustomer(undefined);
          toast.warning('Không tìm thấy khách hàng');
        }
      }
    } catch (error) {
      setCustomer(undefined);
      toast.error('Lỗi khi tìm kiếm khách hàng');
    }
  };

  const handleCreateOrder = async () => {
    const orderDto = {
      staffId: formDataOrder.staffId,
      customerId: formDataOrder.customerId,
      totalPrice: formDataOrder.totalPrice,
      paymentMethod: formDataOrder.paymentMethod,
      paymentTime: formDataOrder.paymentTime,
      isReceived: formDataOrder.isReceived,
      isPaid: formDataOrder.paymentMethod === 'Tiền mặt' ? 1 : 0,
      orderType: formDataOrder.orderType,
    };

    const orderDetailsDto = cart?.map((formDataOrderDetail) => ({
      productUnitId: formDataOrderDetail.id,
      quantity: formDataOrderDetail.quantity,
      currentPrice: formDataOrderDetail.currentPrice,
    }));

    const payload = {
      orderDto,
      orderDetailsDto,
    };

    const res = await handleCreatedOrderAction(payload);
    if (res?.data) {
      toast.success(res.message);
      setFormDataOrder(initialOrder);
      setCustomerPhone('');
      setCustomer(undefined);
      setCart([]);
    } else {
      toast.error(res.message);
    }
  };

  const handleUsePoint = () => {
    if (!customer?.score || !parameterData?.results[0]?.value) {
      toast.error('Không đủ thông tin để sử dụng điểm');
      return;
    }

    const pointConversionRate = parameterData.results[0].value; // Tỷ lệ đổi điểm sang VND
    const availableDiscount = customer.score / pointConversionRate; // Số tiền có thể giảm
    const totalPrice = formDataOrder.totalPrice;

    if (availableDiscount >= totalPrice) {
      const newScore = customer.score - totalPrice * pointConversionRate;
      handleOrderInfoChange('totalPrice', 0); // Tổng tiền = 0
      toast.success(`Qúy khách đã được giảm toàn bộ hóa đơn!`);

      // Gọi API cập nhật điểm (nếu cần)
      handleUpdateCustomerAction({ id: customer.id, score: newScore });
    } else if (availableDiscount > 0) {
      // Trường hợp điểm không đủ để giảm toàn bộ hóa đơn
      const discount = availableDiscount; // Giảm số tiền tương ứng với số điểm
      const newTotal = totalPrice - discount; // Tổng tiền còn lại
      const newScore = 0; // Điểm sau khi sử dụng = 0
      handleOrderInfoChange('totalPrice', newTotal);
      toast.success(`Qúy khách đã được giảm ${discount.toLocaleString()} VND`);

      // Gọi API cập nhật điểm (nếu cần)
      handleUpdateCustomerAction({ id: customer.id, score: newScore });
    } else {
      // Trường hợp điểm không đủ hoặc bằng 0
      toast.info('Quý khách không đủ điểm để giảm giá');
    }
  };

  const paginatedCart = cart.slice(
    (currentCartPage - 1) * pageSizeCart,
    currentCartPage * pageSizeCart,
  );

  const totalCartPages = Math.ceil(cart.length / pageSizeCart);

  const handlePreviousCartPage = () => {
    if (currentCartPage > 1) {
      setCurrentCartPage(currentCartPage - 1);
    }
  };

  const handleNextCartPage = () => {
    if (currentCartPage < totalCartPages) {
      setCurrentCartPage(currentCartPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (current > 1) setCurrent(current - 1);
  };

  const handleNextPage = () => {
    if (current < meta.pages) setCurrent(current + 1);
  };

  return (
    <div className="row">
      {/* Danh sách sản phẩm */}
      <div className="col-md-6">
        <div className="row">
          <SelectInput
            size={4}
            label="Chọn loại tìm kiếm"
            value={searchType}
            options={[
              { label: 'Tên sản phẩm', value: 'name' },
              { label: 'Mã sản phẩm', value: 'id' },
            ]}
            onChange={(value) => setSearchType(value as 'name' | 'id')}
          />
          <Input
            title="Tìm kiếm"
            size={6}
            value={searchValue}
            placeholder={`Nhập ${
              searchType === 'name' ? 'tên sản phẩm' : 'số sản phẩm'
            }`}
            onChange={(value) => setSearchValue(value)}
            onClickIcon={handleSearchClick}
            icon={<FaSearch />}
          />
        </div>

        <div className="row">
          {productUnits.map((productUnit: ProductUnitTransform) => (
            <div
              key={productUnit.id}
              className="col-md-3 p-1"
              onClick={() => addToCart(productUnit)}
              style={{ cursor: 'pointer' }}
            >
              <div className="card">
                <Image
                  src={productUnit.image}
                  alt={productUnit.productSampleName || 'Product'}
                  width={100}
                  height={100}
                  className="card-img-top p-2"
                />
                <div className="d-flex flex-column justify-content-center align-items-center">
                  <text className="p-0">{productUnit.productSampleName}</text>
                  <text className="text-danger p-1">
                    {productUnit.sellPrice?.toLocaleString()} đ
                  </text>
                </div>
              </div>
            </div>
          ))}
        </div>

        <nav aria-label="Page navigation example">
          <ul className="pagination justify-content-center m-0">
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
              className={`page-item ${
                current === meta.pages ? 'disabled' : ''
              }`}
            >
              <button className="page-link" onClick={handleNextPage}>
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Giỏ hàng */}
      <div className="col-md-6">
        <div className="row align-items-end">
          <Input
            size={5}
            title="Tìm khách hàng"
            placeholder="Nhập SĐT"
            value={customerPhone}
            onChange={(value) => setCustomerPhone(value)}
            onClickIcon={handleSearchCustomer}
            icon={<FaSearch />}
          />
          <Input size={4} title="Khách hàng" value={customer?.name} readOnly />
          <ProtectedComponent requiredRoles={['create_customer']}>
            <div className="col-md-3 mb-1">
              <Link
                href="/customers"
                className="btn d-flex align-items-center justify-content-center btn-primary w-100"
              >
                <FaPlus />
                <text>Thêm KH</text>
              </Link>
            </div>
          </ProtectedComponent>
        </div>

        <table className="table table-bordered ">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  className="text-center align-middle"
                >
                  {column.title}
                </th>
              ))}
              <th scope="col" className="text-center align-middle">
                Tổng
              </th>
              <th scope="col" className="text-center align-middle">
                Xóa
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedCart?.map((row, rowIndex) => (
              <tr key={rowIndex} className="text-center align-middle">
                {columns.map((column, colIndex) => {
                  const cellData =
                    row[column.key as keyof OrderDetailTransform];

                  if (column.key === 'quantity') {
                    return (
                      <td key={colIndex}>
                        <FaMinus
                          onClick={() => updateQuantity(row.id, -1)}
                          className="text-danger me-2"
                          style={{ cursor: 'pointer' }}
                        />
                        {row.quantity}
                        <FaPlus
                          onClick={() => updateQuantity(row.id, 1)}
                          className="text-success ms-2"
                          style={{ cursor: 'pointer' }}
                        />
                      </td>
                    );
                  }

                  return <td key={colIndex}>{cellData}</td>;
                })}
                <td>{(row.currentPrice || 0) * (row.quantity || 0)}đ</td>
                <td>
                  <FaTrash
                    onClick={() => removeFromCart(row.id)}
                    className="text-danger"
                    style={{ cursor: 'pointer' }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {cart.length > 4 ? (
          <nav aria-label="Page navigation">
            <ul className="pagination justify-content-center">
              <li
                className={`page-item ${
                  currentCartPage === 1 ? 'disabled' : ''
                }`}
              >
                <button className="page-link" onClick={handlePreviousCartPage}>
                  Previous
                </button>
              </li>
              {Array.from({ length: totalCartPages }, (_, index) => (
                <li
                  key={index}
                  className={`page-item ${
                    currentCartPage === index + 1 ? 'active' : ''
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentCartPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${
                  currentCartPage === totalCartPages ? 'disabled' : ''
                }`}
              >
                <button className="page-link" onClick={handleNextCartPage}>
                  Next
                </button>
              </li>
            </ul>
          </nav>
        ) : (
          <></>
        )}

        <div className="row align-items-end">
          <Input
            size={3}
            title="Tổng đơn"
            value={`${formDataOrder.totalPrice} đ`}
            onChange={(value) => handleOrderInfoChange('totalPrice', value)}
            readOnly
          />
          <Input
            size={3}
            title="Tích điểm"
            value={formDataOrder.totalPrice / parameterData?.results[1].value}
            readOnly
          />
          <Input
            size={3}
            title="Điểm đã tích"
            value={customer?.score}
            readOnly
          />
          <div className="col-md-3 mb-2">
            <button
              className="btn btn-primary w-100"
              onClick={handleUsePoint}
              disabled={
                customer?.score && formDataOrder.totalPrice > 0 ? false : true
              }
            >
              Dùng điểm
            </button>
          </div>
        </div>
        <div className="row ">
          <Input
            size={5}
            title="Phương thức thanh toán"
            keyObj="id"
            showObj="method"
            placeholder="Chọn phương thức thanh toán"
            value={formDataOrder.paymentMethod}
            onSelectedChange={(value) =>
              handleOrderInfoChange('paymentMethod', value)
            }
            options={[
              { id: 'Tiền mặt', method: 'Tiền mặt' },
              { id: 'Chuyển khoản', method: 'Chuyển khoản' },
            ]}
          />
        </div>

        <div className="row align-items-end">
          <Input
            size={8}
            title="Thành tiền"
            value={`${formDataOrder.totalPrice} đ`}
            readOnly
          />
          <div className="col-md-4 mb-2">
            <button
              className="btn btn-primary w-100"
              onClick={handleCreateOrder}
            >
              Tạo đơn hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRoleAuthorization(SalePage, ['create_order']);
