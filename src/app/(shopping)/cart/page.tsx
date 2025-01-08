'use client';

import { Input } from '@/components/commonComponent/InputForm';
import { preventOverflow } from '@popperjs/core';
import { fetchCartDetails } from '@/services/cartServices';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import useSWR, { mutate } from 'swr';
import { formatCurrency } from '@/utils/format';
import { CartDetailItem } from '@/types/cart';
import CheckOutModal from '@/components/shoppingComponent/checkOutModal.create';
import { FaMinus, FaPlus } from 'react-icons/fa6';

interface Item {
  id: number;
  name: string;
}

function Cart() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useState({ name: '', id: 1 });
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const urlcartDetail = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/carts`;
  const {
    data: cartDetailData,
    error: cartDetailError,
    isLoading,
  } = useSWR(
    [urlcartDetail, current, pageSize, searchParams.name, searchParams.id],
    () =>
      fetchCartDetails(current, pageSize, searchParams.name, searchParams.id),
  );

  const [cartItems, setCartItems] = useState<CartDetailItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<CartDetailItem[]>([]);

  useEffect(() => {
    if (cartDetailData?.cartDetails) {
      setCartItems(cartDetailData.cartDetails);
    }
  }, [cartDetailData]);

  const handleCheckbox = (item: CartDetailItem, isChecked: boolean) => {
    setSelectedItems((prev) => {
      if (isChecked) {
        // Nếu tích checkbox => thêm item vào selectedItems
        return [...prev, item];
      } else {
        // Nếu bỏ tích => filter bỏ item ra
        return prev.filter((i) => i.id !== item.id);
      }
    });
  };

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, quantity: newQuantity };

          // Nếu item này đang có trong selectedItems => cũng cập nhật
          setSelectedItems((prevSelected) =>
            prevSelected.map((si) => (si.id === id ? updatedItem : si)),
          );

          return updatedItem;
        }
        return item;
      }),
    );
  };

  const calculateSelectedTotal = () => {
    return selectedItems.reduce((acc, item) => {
      const discountPrice =
        item.productUnit.sellPrice -
        item.productUnit.sellPrice * item.productUnit.batches[0].discount;
      return acc + discountPrice * item.quantity;
    }, 0);
  };

  if (isLoading) {
    return <p>Đang tải...</p>;
  }

  if (cartDetailError) {
    return <p>Có lỗi xảy ra: {cartDetailError.message}</p>;
  }

  const onMutate = () => {
    mutate(['']);
  };

  const handleRemoveItem = (itemId: number) => {
    //api xóa chô này

    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    setSelectedItems((prevSelected) =>
      prevSelected.filter((item) => item.id !== itemId),
    );
  };

  const handleCreateModal = () => {
    setIsModalOpen(true);
  };

  const setDataBridge = (val: CartDetailItem[] | undefined) => {
    // ví dụ, khi val là undefined, mình reset về mảng rỗng
    if (!val) {
      setSelectedItems([]);
    } else {
      setSelectedItems(val);
    }
  };

  console.log('cartItems', cartItems);
  console.log('cartDetailData', cartDetailData);
  console.log('selected Items: ', selectedItems);

  return (
    <div>
      <div>
        {cartItems?.map((item: CartDetailItem) => {
          const discountPrice =
            item.productUnit.sellPrice -
            item.productUnit.sellPrice * item.productUnit.batches[0].discount;
          return (
            <div className="row border rounded p-3 mx-5 my-3">
              <div className="col col-md-2 p-0">
                <Image
                  src={
                    typeof item.productUnit.image === 'string'
                      ? item.productUnit.image
                      : '/images/default-product-image.png'
                  }
                  alt={'Product'}
                  width={250}
                  height={250}
                  className="h-100 img-thumbnail"
                />
              </div>
              <div className="col col-md-10">
                <div className="d-flex align-items-center justify-content-around h-100">
                  <div className="col col-md-3 position-relative pe-2">
                    <p>SL tồn: {item.productUnit.batches[0].inventQuantity}</p>
                    <h4>{item.productUnit.productSample.name}</h4>
                    <h3 className="mt-4">{formatCurrency(discountPrice)} đ</h3>
                    {item.productUnit.batches[0].discount > 0 && (
                      <p
                        className="position-absolute"
                        style={{ bottom: '1.5rem' }}
                      >
                        <s>{formatCurrency(item.productUnit.sellPrice)}</s>
                      </p>
                    )}
                  </div>
                  <Input
                    title={'Mẫu mã'}
                    value={`${item.productUnit.unit.name} ${
                      item.productUnit.volumne
                    } ${new Date(
                      item.productUnit.batches[0].expiredAt,
                    ).toLocaleDateString('vi-VN')}`}
                    size={3}
                  />
                  <div className="d-flex flex-column align-items-center">
                    <div className="d-flex align-items-center gap-2">
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity - 1)
                        }
                        className="btn btn-secondary mt-3"
                      >
                        <FaMinus />
                      </button>
                      <Input
                        title="SL"
                        value={item.quantity}
                        onChange={(value) =>
                          handleQuantityChange(item.id, Number(value))
                        }
                        size={6}
                      />
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                        className="btn btn-secondary mt-3"
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                  <div className="col col-md-3 d-flex justify-content-around">
                    <h4 className="text-danger m-0 mt-4">
                      <strong>
                        <u>{formatCurrency(discountPrice * item.quantity)} đ</u>
                      </strong>
                    </h4>
                  </div>
                  <div className="col col-md-1 d-flex justify-content-end align-items-end gap-4">
                    <input
                      className="form-check-input p-2 mt-3 "
                      type="checkbox"
                      value=""
                      id={`checkbox-${item.id}`}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleCheckbox(item, e.target.checked)
                      }
                      style={{ cursor: 'pointer' }}
                    />
                    <FaTrash
                      className="fs-5 text-danger mt-3"
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-3">
        <h3>
          Tổng tiền (đã chọn):{' '}
          <span className="text-danger">
            {formatCurrency(calculateSelectedTotal())} đ
          </span>
        </h3>
      </div>
      <button
        className="btn btn-primary"
        disabled={selectedItems.length === 0}
        onClick={handleCreateModal}
      >
        Mua hàng
      </button>

      <CheckOutModal
        isUpdateModalOpen={isModalOpen}
        setIsUpdateModalOpen={setIsModalOpen}
        onMutate={onMutate}
        data={selectedItems}
        setData={setDataBridge}
      />
    </div>
  );
}

// export default withRoleAuthorization(Cart, ['v_pdsams']);
export default Cart;
