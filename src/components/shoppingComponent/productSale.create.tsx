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
import { FaMinus, FaPlug, FaPlus } from 'react-icons/fa6';
import { Input } from '../commonComponent/InputForm';

function ProductSaleModal(props: UpdateModalProps<ProductSampleShoping>) {
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
        console.log('firstBatch', firstBatch)
        setCurrentBatch({
          unitId: firstUnit?.id,
          batchId: firstBatch?.id,
          image: firstUnit.image,
          inventQuantity: 1,
          discount: firstBatch?.discount || 0,
          inboundPrice: firstUnit.sellPrice || 0,
        });
      }
    }
  }, [productSampleData]);

  const handleCloseCreateModal = () => {
    setIsUpdateModalOpen(false);
    setData?.(undefined);
    setQuantity(1);
  };

  const handleUpdateCart = async () => {
    // console.log('currentBatch', currentBatch);

    const cartDto = { customerId: 1 };

    const cartDetailsDto = [
      {
        productUnitId: currentBatch.unitId,
        quantity: quantity,
        batch: [{ id: currentBatch.batchId }],
      },
    ];

    const payload = { cartDto, cartDetailsDto };
    // console.log(payload);
    const res = await handleAddCartDetailAction(payload);

    if (res?.data) {
      handleCloseCreateModal();
      toast.success(res.message);
      onMutate();
      setQuantity(1);
    } else {
      console.log(res);
      toast.error(res.message);
      setQuantity(1);
    }
  };

  console.log('productSampleData', productSampleData);
  const [quantity, setQuantity] = useState(1);
  const ProductSampleButtons = ({
    productSampleData,
  }: {
    productSampleData: ProductSampleShoping | undefined;
  }) => {
    const handleButtonClick = (unit: any, batch: any) => {
      console.log('currentBatch', currentBatch)

      setCurrentBatch({
        unitId: unit.id,
        batchId: batch.id,
        image: unit.image,
        inventQuantity: 1,
        discount: batch?.discount || 0,
        inboundPrice: unit.sellPrice || 0,
      });
    };

    const handleQuantityChange = (newQuantity: number) => {
      if (newQuantity < 1) return;
      setQuantity(newQuantity);
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
                console.log('unit', unit);
                const isActive =
                  currentBatch &&
                  currentBatch.batchId == batch.id
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
                      {formatCurrency(
                        currentBatch.inboundPrice -
                          currentBatch.discount * currentBatch.inboundPrice,
                      )}{' '}
                      đ
                    </strong>
                  </h1>
                  {currentBatch.discount > 0 && (
                    <h6>
                      <s>{formatCurrency(currentBatch.inboundPrice)} đ</s>
                    </h6>
                  )}
                </div>
                <ProductSampleButtons productSampleData={productSampleData} />
                <div className="d-flex flex-column">
                  <div className="d-flex align-items-center gap-2 mt-3">
                    <button
                      onClick={() => setQuantity(quantity - 1)}
                      className="btn btn-secondary mt-3"
                    >
                      <FaMinus />
                    </button>
                    <Input
                      title="Số lượng"
                      value={quantity}
                      onChange={(value) => setQuantity(Number(value))}
                      size={6}
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="btn btn-secondary mt-3"
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <p>
            Tạm tính:{' '}
            {formatCurrency(
              quantity *
                (currentBatch.inboundPrice -
                  currentBatch.discount * currentBatch.inboundPrice),
            )}
          </p>
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
