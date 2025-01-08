'use client';

import { Input } from '@/components/commonComponent/InputForm';
import { fetchCartDetails } from '@/services/cartServices';
import Image from 'next/image';
import { useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';
import useSWR from 'swr';

function ProductSamplePage() {
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
      <div className="row">
        <div className="col col-md-2">
          <Image
            src={'/images/warehousePH.png'}
            alt={'Product'}
            width={250}
            height={250}
            className="h-100 w-100 img-thumbnail"
          />
        </div>
        <div className="col col-md-10">
          <div className="d-flex">
            <div>
              <h2>Tên sản phẩm</h2>
              <h2><strong>1.000.000 đ</strong></h2>
            </div>
            <Input title={'Mẫu mã'} value={'chai 330ml 20/12/2025'} size={3} />
            <div className="btn-group" role="group" aria-label="Basic example">
              <div className="d-flex align-items-center">
                <FaMinus
                  onClick={() => {}}
                  className="text-danger me-2"
                  style={{ cursor: 'pointer' }}
                />
                <input
                  className="form-control"
                  value={4}
                  style={{ width: '5rem' }}
                />

                <FaPlus
                  onClick={() => {}}
                  className="text-success ms-2"
                  style={{ cursor: 'pointer' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// export default withRoleAuthorization(ProductSamplePage, ['v_pdsams']);
export default ProductSamplePage;
