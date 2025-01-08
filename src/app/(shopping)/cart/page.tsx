'use client';

import { Input } from '@/components/commonComponent/InputForm';
import { preventOverflow } from '@popperjs/core';
import Image from 'next/image';
import { useState } from 'react';
import { FaTrash } from 'react-icons/fa';

const data: any = {
  id: 2,
  status: 1,
  createdAt: '2025-01-07T07:24:42.409Z',
  deletedAt: null,
  customer: {
    id: 1,
    name: 'Đoàn Danh Dự',
    email: 'dudd@mini.mart',
    password: '$2b$10$ImF9chTfy2rgUDiW3t/V5eOYFtNo0JQzuxk/H/m2Jw3pJJTi/i3RC',
    score: 0,
    address: 'Ấp Thị 1, xã Hội An, Chợ Mới, An Giang',
    phone: '0901234567',
    isActive: 1,
    codeId: null,
    codeExpired: null,
    createdAt: '2025-01-03T23:29:54.000Z',
    deletedAt: null,
  },
  cartDetails: [
    {
      id: 14,
      cartId: 2,
      productUnitId: 13,
      batchId: 18,
      quantity: 2,
      productUnit: {
        id: 13,
        sellPrice: 10000,
        conversionRate: null,
        image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUlFvGKCHhTwr6fiK0O1ZwVyuffp8zRcXlcQ&s',
        volumne: '330ml',
        createdAt: '2025-01-03T23:29:54.000Z',
        deletedAt: null,
      },
      batch: {
        id: 18,
        inboundPrice: '52500.00',
        discount: '0.20',
        inventQuantity: 300,
        inboundQuantity: 300,
        expiredAt: '2025-02-28T17:00:00.000Z',
        createdAt: '2023-06-05T02:25:00.000Z',
        deletedAt: null,
      },
    },
    {
      id: 15,
      cartId: 2,
      productUnitId: 5,
      batchId: 32,
      quantity: 1,
      productUnit: {
        id: 5,
        sellPrice: 8000,
        conversionRate: null,
        image:
          'https://images2.thanhnien.vn/zoom/686_429/528068263637045248/2023/9/13/rau-muong-16945744756401379166751-75-0-476-642-crop-16945745476001397609558.png',
        volumne: '1 kg',
        createdAt: '2025-01-03T23:29:54.000Z',
        deletedAt: null,
      },
      batch: {
        id: 32,
        inboundPrice: '40000.00',
        discount: '0.00',
        inventQuantity: 200,
        inboundQuantity: 200,
        expiredAt: '2025-12-30T17:00:00.000Z',
        createdAt: '2024-03-15T07:00:00.000Z',
        deletedAt: null,
      },
    },
  ],
};

const cart: any = [
  {
    id: 1,
    cartId: 1,
    productUnitId: 1,
    batchId: 1,
    quantity: 10000,
    productUnit: {
      id: 1,
      sellPrice: 120000,
      conversionRate: null,
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRS_idOuuaioteV4Hzmsvwus57R7SlL1A26jg&s',
      volumne: '1 kg',
      createdAt: '2025-01-04T02:45:56.000Z',
      deletedAt: null,
      productSample: {
        id: 1,
        name: 'Thịt heo ba rọi',
        description: 'Thịt heo tươi ngon từ trang trại',
        createdAt: '2025-01-04T02:45:56.000Z',
        deletedAt: null,
        productLineId: 1,
      },
      unit: {
        id: 1,
        name: 'kg',
        createdAt: '2025-01-04T02:45:56.000Z',
        deletedAt: null,
      },
      batches: [
        {
          id: 31,
          inboundPrice: '100000.00',
          discount: '0.00',
          inventQuantity: 100,
          inboundQuantity: 100,
          expiredAt: '2025-12-30T17:00:00.000Z',
          createdAt: '2024-02-10T03:30:00.000Z',
          deletedAt: null,
        },
        {
          id: 16,
          inboundPrice: '62500.00',
          discount: '0.00',
          inventQuantity: 100,
          inboundQuantity: 100,
          expiredAt: '2024-12-31T17:00:00.000Z',
          createdAt: '2023-04-10T04:30:00.000Z',
          deletedAt: null,
        },
        {
          id: 1,
          inboundPrice: '168250.00',
          discount: '0.00',
          inventQuantity: 100,
          inboundQuantity: 100,
          expiredAt: '2024-12-30T17:00:00.000Z',
          createdAt: '2021-11-15T07:20:00.000Z',
          deletedAt: null,
        },
      ],
    },
  },
];
console.log(cart);

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
    if (isChecked) {
      setSelectedItems((prev: any) => [...prev, item]);
    } else {
      setSelectedItems((prev: any) =>
        prev.filter((i: any) => i.id !== item.id),
      );
    }
  };

  console.log('selectedItems', selectedItems);
  return (
    <div>
      <div>
        {cart.map((item: any) => (
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
                  <p>SL tồn: {item.batch.inventQuantity}</p>
                  <h4>Tên sản phẩm cực kì là dài dài ơi là dài</h4>
                  <h3 className="mt-4">1.000.000 đ</h3>
                  {/* Giá gốc */}
                  <p className="position-absolute" style={{ bottom: '1.5rem' }}>
                    <s>1.200.000 đ</s>
                  </p>
                </div>
                <Input
                  title={'Mẫu mã'}
                  value={'chai 330ml 20/12/2025'}
                  size={3}
                />
                <Input title="Số lượng" type="number" size={1} />
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
