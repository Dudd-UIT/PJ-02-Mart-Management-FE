'use client';

import { Input } from '@/components/commonComponent/InputForm';
import { preventOverflow } from '@popperjs/core';
import { fetchCartDetails, handleDeleteCartDetailAction } from '@/services/cartServices';
import Image from 'next/image';
import { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import useSWR, { mutate } from 'swr';
import { OrderDetailTransform } from '@/types/order';
import { ProductUnitTransform } from '@/types/productUnit';
import { toast } from 'react-toastify';
import { handleCreatedOrderAction, handleCreatedOrderOnlineAction } from '@/services/orderServices';
import DeleteCartDetailModal from '@/components/cartComponent/cart.delete';
import { CartDetail } from '@/types/cart';

interface Item {
  id: number;
  name: string;
}

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

function ProductSamplePage() {

  const [selectedItems, setSelectedItems] = useState<any[]>([]);

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

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedCartDetail, setSelectedCartDetail] = useState<CartDetail | undefined>();

  const [formDataOrder, setFormDataOrder] = useState<FormDataOrder>(initialOrder);
  const handleOrderInfoChange = (
    field: keyof typeof formDataOrder,
    value: string | number,
  ) => {
    setFormDataOrder((prev) => ({ ...prev, [field]: value }));
  };

  // const handleCheckbox = (item: Item, isChecked: boolean) => {
  //   setSelectedItems((prev) =>
  //     isChecked ? [...prev, item] : prev.filter((i) => i.id !== item.id)
  //   );
  //   console.log('selected Items: ', selectedItems)
  // };

  const handleCheckbox = (item: any, isChecked: boolean) => {
    setSelectedItems((prevSelectedItems) => {
      if (isChecked) {
        // Thêm sản phẩm vào danh sách được chọn
        return [...prevSelectedItems, item];
      } else {
        // Loại bỏ sản phẩm khỏi danh sách được chọn
        return prevSelectedItems.filter((selectedItem) => selectedItem.id !== item.id);
      }
    });
  };

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const [searchParams, setSearchParams] = useState({ name: '', id: 1 });
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const urlcartDetail = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/carts`;
  const { data: cartDetailData, error: cartDetailError } = useSWR(
    [urlcartDetail, current, pageSize, searchParams.name, searchParams.id],
    () =>
      fetchCartDetails(
        current,
        pageSize,
        searchParams.name,
        searchParams.id,
      ),
  );

  const handlePurchase = async () => {
    console.log("selected Item 2", selectedItems)
    if (selectedItems.length === 0) {
      toast.warning('Vui lòng chọn ít nhất một sản phẩm!');
      return;
    }
  
    try {
      // Dữ liệu đơn hàng
      const orderDetailsDto = selectedItems.map((item) => ({
        productUnitId: item.productUnit.id,
        quantity: item.quantity,
        currentPrice: item.productUnit.sellPrice,
        batchId: item.batchId,
        cartDetailId: item.id,
      }));

      console.log('selectedItems', selectedItems  )
  
      const orderDto = {
        // staffId: formDataOrder.staffId,
        customerId: formDataOrder.customerId,
        totalPrice: orderDetailsDto.reduce(
          (acc, detail) => acc + detail.quantity * detail.currentPrice,
          0
        ),
        paymentMethod: formDataOrder.paymentMethod,
        paymentTime: new Date(),
        isReceived: 1,
        isPaid: formDataOrder.paymentMethod === 'Tiền mặt' ? 1 : 0,
        orderType: 'Online',
      };
  
      const payload = {
        orderDto,
        orderDetailsDto,
      };
      console.log('payload', payload)
      // Gửi yêu cầu tạo đơn hàng
      const res = await handleCreatedOrderOnlineAction(payload);
      console.log('>>>res<<<', res)
      if (res?.data) {
        toast.success('Đơn hàng được tạo thành công!');
        setSelectedItems([]); // Reset danh sách đã chọn
        onMutate()
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra, vui lòng thử lại!');
    }
  }; 

  const handleDeleteCartDetail = (cartDetail: CartDetail) => {
     console.log('cartDetail::', cartDetail);
      setSelectedCartDetail(cartDetail);
      setIsDeleteModalOpen(true);
  };
  const onMutate = () => mutate([urlcartDetail, current, pageSize, searchParams.name, searchParams.id]);

  return (
    <>
    <div>
      <div>
        {cartDetailData?.cartDetails?.map((item: any) => (
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
                  <h3 className="mt-4">{item.productUnit.sellPrice} đ</h3>
                  <p className="position-absolute" style={{ bottom: '1.5rem' }}>
                    <s>1.200.000 đ</s>
                  </p>
                </div>
                <Input
                  title={'Mẫu mã'}
                  value={`${item.productUnit.unit.name} ${item.productUnit.volumne} ${new Date(item.productUnit.batches[0].expiredAt).toLocaleDateString('vi-VN')}`}
                  size={3}
                />
                <Input
                  title="Số lượng"
                  type="number"
                  value={
                    selectedItems.find((selectedItem) => selectedItem.id === item.id)?.quantity ||
                    item.quantity
                  }
                  onChange={(value) => handleQuantityChange(item.id, +value)}
                  size={1}
                />
                <div className="col col-md-3 d-flex justify-content-around">
                  <h4 className="text-danger m-0 mt-4">
                    <strong>
                      <u>
                        {(
                          item.productUnit.sellPrice *
                          (selectedItems.find((selectedItem) => selectedItem.id === item.id)
                            ?.quantity || item.quantity)
                        ).toLocaleString('vi-VN')}{' '}
                        đ
                      </u>
                    </strong>
                  </h4>
                </div>
                <div className="col col-md-1 d-flex justify-content-end align-items-end gap-4">
                  <input
                    className="form-check-input p-2 mt-3 "
                    type="checkbox"
                    value=""
                    id={item.id}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleCheckbox(item, e.target.checked)
                    }
                    style={{ cursor: 'pointer' }}
                  />
                  <FaTrash
                    className="fs-5 text-danger mt-3"
                    style={{ cursor: 'pointer' }}
                    id={item.id}
                    onClick={() => handleDeleteCartDetail(item.id)}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="btn btn-primary" disabled={selectedItems.length === 0} onClick={handlePurchase}>
        Mua hàng
      </button>
    </div>
    <DeleteCartDetailModal
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        data={selectedCartDetail}
        onMutate={onMutate}
      />
    </>
  );
}

// export default withRoleAuthorization(ProductSamplePage, ['v_pdsams']);
export default ProductSamplePage;
