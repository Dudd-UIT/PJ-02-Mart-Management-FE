'use client';

import { Input } from '@/components/commonComponent/InputForm';
import { preventOverflow } from '@popperjs/core';
import { fetchCartDetails } from '@/services/cartServices';
import Image from 'next/image';
import { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import useSWR from 'swr';

interface Item {
  id: number;
  name: string;
}

interface CartProps {
  cart: Item[];
}

function ProductSamplePage() {

  const [selectedItems, setSelectedItems] = useState<Item[]>([]);

  const handleCheckbox = (item: Item, isChecked: boolean) => {
    setSelectedItems((prev) =>
      isChecked ? [...prev, item] : prev.filter((i) => i.id !== item.id)
    );
    console.log('selected Items: ', selectedItems)
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
  console.log('cartDetailData', cartDetailData);

  return (
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
                <Input title="Số lượng" type="number" value={item.quantity} size={1} />
                <div className="col col-md-3 d-flex justify-content-around">
                  <h4 className="text-danger m-0 mt-4">
                    <strong>
                      <u>1.000.000 đ</u>
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
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="btn btn-primary" disabled={selectedItems.length === 0}>
        Mua hàng
      </button>
    </div>
  );
}

// export default withRoleAuthorization(ProductSamplePage, ['v_pdsams']);
export default ProductSamplePage;
