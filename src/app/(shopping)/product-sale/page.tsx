'use client';

import { Input, SelectInput } from '@/components/commonComponent/InputForm';
import { fetchProductSamples } from '@/services/productSampleServices';
import { useState } from 'react';
import { FaPlus, FaMinus, FaTrash, FaSearch, FaFilter } from 'react-icons/fa';
import useSWR, { mutate } from 'swr';
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
import InfoProductSampleModal from '@/components/productSampleComponent/productSample.info';
import CreateProductOrder from '@/components/shoppingComponent/productSale.create';
import { ProductUnit } from '@/types/productUnit';
import { ProductSample, ProductSampleShoping } from '@/types/productSample';
import { FaArrowDown } from 'react-icons/fa6';
import { formatCurrency } from '@/utils/format';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedproductSample, setSelectedproductSample] = useState<
    ProductSampleShoping | undefined
  >();
  const [searchValue, setSearchValue] = useState('');
  const [searchParams, setSearchParams] = useState({ name: '', id: 0 });

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(50);

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

  const urlproductSample = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/product-samples`;
  const { data: productSamplesData, error: productSamplesError } = useSWR(
    [urlproductSample, current, pageSize, searchParams.name, searchParams.id],
    () =>
      fetchProductSamples(
        current,
        pageSize,
        searchParams.name,
        searchParams.id,
      ),
  );

  const onMutate = () => {
    mutate(['']);
  };

  const meta: MetaData = {
    current,
    pageSize,
    pages: productSamplesData?.meta.pages,
    total: productSamplesData?.meta.total,
  };

  const urlParameter = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/parameters`;
  const { data: parameterData, error: parameterError } = useSWR(
    [urlParameter, current, pageSize, searchParams.name, searchParams.id],
    () => fetchParameters(),
  );

  if (productSamplesError)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div>{productSamplesError.message}</div>
      </div>
    );

  if (!productSamplesData)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-grow text-success" role="status"></div>
        <span className="sr-only text-success">Loading...</span>
      </div>
    );

  function findMaxDiscountIndex(data: ProductSample): {
    maxProductIndex: number | null;
    maxBatchIndex: number | null;
  } {
    let maxProductIndex: number | null = null;
    let maxBatchIndex: number | null = null;
    let maxDiscount = -Infinity;
    data.productUnits.forEach((productUnit, productIndex) => {
      productUnit.batches?.forEach((batch, batchIndex) => {
        const discount = batch.discount; // Chuyển đổi discount sang số thực
        if (discount > maxDiscount) {
          maxDiscount = discount;
          maxProductIndex = productIndex;
          maxBatchIndex = batchIndex;
        }
      });
    });
    return { maxProductIndex, maxBatchIndex };
  }

  const productSamples: ProductSampleShoping[] = productSamplesData.results.map(
    (item: ProductSample) => {
      const { maxProductIndex, maxBatchIndex } = findMaxDiscountIndex(item);
      const productUnit =
        maxProductIndex !== null
          ? item.productUnits[maxProductIndex]
          : undefined;
      const batch =
        productUnit?.batches && maxBatchIndex !== null
          ? productUnit.batches[maxBatchIndex]
          : undefined;
      return {
        id: item.id,
        name: item.name || null,
        description: item.description,
        sellPrice: productUnit?.sellPrice || item.productUnits[0].sellPrice,
        image: productUnit?.image || item.productUnits[0].image,
        discount: batch?.discount || 0,
        productLine: item.productLine,
        productLineId: item.productLineId,
        productUnits: item.productUnits,
        available: item.productUnits[0].batches?.length,
      };
    },
  );

  // const handleSearchClick = () => {
  //   setSearchParams({
  //     name: searchType === 'name' ? searchValue : '',
  //     id: searchType === 'id' ? searchValue : '',
  //   });
  //   setCurrent(1);
  // };

  const handleOrderInfoChange = (
    field: keyof typeof formDataOrder,
    value: string | number,
  ) => {
    setFormDataOrder((prev) => ({ ...prev, [field]: value }));
  };

  // const addToCart = (productSample: ProductSample) => {
  //   setCart((prevCart) => {
  //     const existingItem = prevCart.find((item) => item.id === productSample.id);

  //     let updatedCart;
  //     if (existingItem) {
  //       updatedCart = prevCart.map((item) =>
  //         item.id === productSample.id
  //           ? { ...item, quantity: item.quantity! + 1 }
  //           : item,
  //       );
  //     } else {
  //       updatedCart = [
  //         ...prevCart,
  //         {
  //           id: productSample.id,
  //           quantity: 1,
  //           currentPrice: productSample.sellPrice,
  //           productSampleName: productSample.productSampleName,
  //           unitName: productSample.unitName,
  //         },
  //       ];
  //     }

  //     // Tính toán tổng ngay khi cập nhật giỏ hàng
  //     const newTotal = updatedCart.reduce(
  //       (acc, item) => acc + item.currentPrice * (item.quantity || 0),
  //       0,
  //     );
  //     handleOrderInfoChange('totalPrice', newTotal);

  //     return updatedCart;
  //   });
  // };

  // const updateQuantity = (productId: number, increment: number) => {
  //   setCart((prevCart) => {
  //     const updatedCart = prevCart.map((item) =>
  //       item.id === productId
  //         ? {
  //             ...item,
  //             quantity: Math.max(1, (item.quantity || 0) + increment),
  //           }
  //         : item,
  //     );

  //     // Tính toán tổng ngay khi cập nhật giỏ hàng
  //     const newTotal = updatedCart.reduce(
  //       (acc, item) => acc + item.currentPrice * (item.quantity || 0),
  //       0,
  //     );
  //     handleOrderInfoChange('totalPrice', newTotal);

  //     return updatedCart;
  //   });
  // };

  const handlePreviousPage = () => {
    if (current > 1) setCurrent(current - 1);
  };

  const handleNextPage = () => {
    if (current < meta.pages) setCurrent(current + 1);
  };

  const handleCreateModal = (data: ProductSampleShoping) => {
    setSelectedproductSample(data);
    setIsModalOpen(true);
  };

  console.log(productSamples);
  return (
    <div>
      <div className="col-md-12">
        {/* Search zone */}
        <div className="row justify-content-md-center">
          <Input
            size={5}
            title="Tra cứu mặt hàng"
            value={''}
            placeholder="Nhập tên mặt hàng"
            onChange={(value) => {}}
            icon={<FaSearch />}
            // onClickIcon={handleSearchClick}
          />
          <Input
            title="Loại sản phẩm"
            size={5}
            value={searchValue}
            placeholder="Chọn loại sản phẩm"
            onChange={(value) => {}}
            // onClickIcon={handleSearchClick}
            icon={<FaFilter />}
          />
        </div>

        {/* list */}
        <div className="row m-5">
          {productSamples
            .sort((a, b) => {
              const aInStock = a.available > 0 ? 1 : 0; // Sản phẩm còn hàng (available > 0)
              const bInStock = b.available > 0 ? 1 : 0; // Sản phẩm còn hàng (available > 0)
              return bInStock - aInStock; // Sản phẩm còn hàng trước
            })
            .map((productSample: ProductSampleShoping) => (
              <div
                key={productSample.id}
                className="col-md-3 col-sm-6 p-3 my-2"
                onClick={
                  productSample.available > 0
                    ? () => handleCreateModal(productSample)
                    : undefined
                }
                style={{
                  cursor:
                    productSample.available > 0 ? 'pointer' : 'not-allowed',
                }}
              >
                <div
                  className={`card h-100 position-relative ${
                    productSample.available === 0 ? 'disabled' : ''
                  }`}
                >
                  {/* badge */}
                  {productSample.discount > 0 && (
                    <h3>
                      <span
                        className="position-absolute top-0 translate-middle badge rounded bg-danger"
                        style={{ right: '-4rem' }}
                      >
                        <FaArrowDown /> {productSample.discount * 100}%
                        <span className="visually-hidden">unread messages</span>
                      </span>
                    </h3>
                  )}
                  {/* Image */}
                  {productSample.available === 0 && (
                    <Image
                      src={'/images/soldout.png'}
                      alt={productSample.name || 'Product'}
                      width={200}
                      height={200}
                      className="card-img-top p-3 position-absolute h-100 py-5"
                      style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
                    />
                  )}
                  <Image
                    src={
                      typeof productSample.image === 'string'
                        ? productSample.image
                        : '/images/default-product-image.png'
                    }
                    alt={productSample.name || 'Product'}
                    width={200}
                    height={240}
                    className="card-img-top p-3"
                  />

                  <div className="d-flex flex-column justify-content-center align-items-center">
                    <h5 className="p-0">{productSample.name}</h5>
                    {productSample.discount > 0 && (
                      <small
                        className="position-absolute"
                        style={{ bottom: '2.8rem' }}
                      >
                        <s>{formatCurrency(productSample.sellPrice)} đ</s>
                      </small>
                    )}
                    <h3 className="text-danger p-1 pt-2">
                      <strong>
                        {(
                          productSample.sellPrice -
                          productSample.sellPrice * productSample.discount
                        )?.toLocaleString('vi-VN')}{' '}
                        đ
                      </strong>
                    </h3>
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

      <CreateProductOrder
        isUpdateModalOpen={isModalOpen}
        setIsUpdateModalOpen={setIsModalOpen}
        onMutate={onMutate}
        data={selectedproductSample}
        setData={setSelectedproductSample}
      />
    </div>
  );
}

export default withRoleAuthorization(SalePage, ['c_order']);
