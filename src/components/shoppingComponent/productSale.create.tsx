'use client';
import { Modal, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { ProductSample, ProductSampleShoping } from '@/types/productSample';
import { ProductUnit, ProductUnitTransform } from '@/types/productUnit';
import {
  handleUpdateProductSampleAction,
  uploadImageToS3,
} from '@/services/productSampleServices';
import ProtectedComponent from '../commonComponent/ProtectedComponent';
import Image from 'next/image';
import { BatchGrouped } from '@/types/batch';
import { formatCurrency } from '@/utils/format';
import { handleAddCartDetailAction } from '@/services/cartServices';

function ProductSaleModal(
  props: UpdateModalProps<ProductSampleShoping>,
) {
  const {
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    data: productSampleData,
    setData,
    onMutate,
  } = props;

  const initialBatch = {
    unitId: 0,
    batchId: 0,
    image: '',
    inventQuantity: 1,
    discount: 0,                                                       
    inboundPrice: 0,
  };

  const [productUnits, setProductUnits] = useState<ProductUnitTransform[]>([]);
  const [currentBatch, setCurrentBatch] = useState<any>(initialBatch);

  useEffect(() => {
    if (productSampleData) {
      const productUnits = productSampleData.productUnits.map(
        (productUnit: ProductUnit) => ({
          id: productUnit.id,
          unitName: productUnit?.unit?.name || '',
          unitId: productUnit?.unit?.id || 0,
          conversionRate: productUnit.conversionRate,
          compareUnitId: productUnit?.compareUnit?.id,
          compareUnitName: productUnit?.compareUnit?.name,
          volumne: productUnit.volumne,
          sellPrice: productUnit.sellPrice,
          image: productUnit.image,
        }),
      );
      setProductUnits(productUnits);

      // Thiết lập currentBatch với giá trị đầu tiên
      const firstUnit = productSampleData.productUnits[0];
      if (firstUnit) {
        const firstBatch = firstUnit.batches && firstUnit.batches[0];
        setCurrentBatch({
          unitId: firstUnit?.id,
          batchId: firstBatch?.id,
          image: firstUnit.image,
          inventQuantity: 1,
          discount: firstBatch?.discount || 0,
          inboundPrice: firstBatch?.inboundPrice || 0,
        });
      }
    }
  }, [productSampleData]);

  const handleCloseCreateModal = () => {
    setIsUpdateModalOpen(false);
    setData?.(undefined);
  };

  const handleUpdateCart = async () => {
    console.log(currentBatch)

    const cartDto = {customerId: 1}

    const cartDetailsDto = [{productUnitId: currentBatch.unitId, quantity: currentBatch.inventQuantity, batch: [{id: currentBatch.batchId}], }]

    const payload = {cartDto, cartDetailsDto };
    console.log(payload);
    const res = await handleAddCartDetailAction(payload);

    if (res?.data) {
      handleCloseCreateModal();
      toast.success(res.message);
      onMutate();
    } else {
      console.log(res);
      toast.error(res.message);
    }
  };

  console.log(productSampleData);

  const ProductSampleButtons = ({
    productSampleData,
  }: {
    productSampleData: ProductSampleShoping | undefined;
  }) => {
    const handleButtonClick = (unit: any, batch: any) => {
      setCurrentBatch({
        unitId: unit.id,
        batchId: batch.id,
        image: unit.image,
        inventQuantity: 1,
        discount: batch?.discount || 0,
        inboundPrice: batch?.inboundPrice || 0,
      });
    };

    return (
      <div>
        {productSampleData &&
          productSampleData.productUnits.map((unit: ProductUnit) => {
            if (unit.batches && unit.batches.length > 0) {
              // Nếu có batches, tạo nút cho từng batch
              return unit.batches.map((batch: BatchGrouped, index: number) => {
                const buttonLabel = `${unit.unit?.name} ${
                  unit.volumne
                } ${new Date(batch.expiredAt).toLocaleDateString('vi-VN')}`;
                const isActive =
                  currentBatch &&
                  currentBatch.image === unit.image &&
                  // currentBatch.inventQuantity === batch.inventQuantity &&
                  currentBatch.discount === batch.discount &&
                  currentBatch.inboundPrice === batch.inboundPrice;
                return (
                  <button
                    key={`${unit.id}-${batch.id}-${index}`}
                    onClick={() => handleButtonClick(unit, batch)}
                    className={`btn m-1 p-1 col col-md-3 ${
                      isActive ? 'btn-outline active' : 'btn-outline'
                    }`}
                  >
                    {buttonLabel}
                  </button>
                );
              });
            } else {
              // Nếu không có batches, tạo nút chỉ với thông tin unit
              const buttonLabel = `${productSampleData.name} ${unit.unit?.name} ${unit.volumne}`;
              return (
                <button
                  key={unit.id}
                  onClick={() => handleButtonClick(unit, null)}
                  className="btn btn-secondary m-2"
                >
                  {buttonLabel}
                </button>
              );
            }
          })}
      </div>
    );
  };

  return (
    <>
      <Modal
        backdrop={'static'}
        show={isUpdateModalOpen}
        onHide={handleCloseCreateModal}
        size="lg"
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          {currentBatch && (
            <div className="row">
              <div className="col col-md-5">
                <Image
                  src={
                    typeof currentBatch.image === 'string'
                      ? currentBatch.image
                      : '/images/default-product-image.png'
                  }
                  alt={currentBatch.name || 'Product'}
                  width={200}
                  height={240}
                  className="card-img-top p-3"
                />
              </div>
              <div className="col col-md-7">
                <h2>{productSampleData?.name}</h2>
                <div className="d-flex align-items-baseline gap-3">
                  <h1 className="text-danger">
                    <strong>
                      {formatCurrency(currentBatch.inboundPrice)} đ
                    </strong>
                  </h1>
                  {currentBatch.discount > 0 && (
                    <h6>
                      <s>
                        {formatCurrency(
                          currentBatch.inboundPrice -
                            currentBatch.discount * currentBatch.inboundPrice,
                        )}{' '}
                        đ
                      </s>
                    </h6>
                  )}
                </div>
                <ProductSampleButtons productSampleData={productSampleData} />
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCreateModal}>
            Thoát
          </Button>
          <ProtectedComponent requiredRoles={['u_pdsam']}>
            <Button variant="danger" onClick={handleUpdateCart}>
              Thêm vào giỏ
            </Button>
          </ProtectedComponent>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ProductSaleModal;
