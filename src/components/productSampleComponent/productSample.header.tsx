import { ProductSampleHeaderType } from '@/types/productSample';
import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import CreateProductSampleModal from './productSample.create';

const ProductSampleHeader = (props: ProductSampleHeaderType) => {
  const { productTypeName } = props;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const onMutate = () => {};

  return (
    <>
      <div
        className="justify-between mt-4"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h2>{productTypeName}</h2>
        </div>

        <div>
          <button
            className="btn btn-primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <FaPlus className="align-middle" />
            <span className="ms-1" style={{ position: 'relative', top: '2px' }}>
              Thêm
            </span>
          </button>
        </div>
      </div>

      {/* Modal Create Product Type */}
      <CreateProductSampleModal
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
        onMutate={onMutate}
      />
    </>
  );
};

export default ProductSampleHeader;
