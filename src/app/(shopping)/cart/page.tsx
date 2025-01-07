'use client';

import { Input } from '@/components/commonComponent/InputForm';
import Image from 'next/image';
import { FaMinus, FaPlus } from 'react-icons/fa';

function ProductSamplePage() {
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
