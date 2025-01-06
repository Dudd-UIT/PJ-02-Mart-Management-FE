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

const columns: Column<ProductUnitTransform>[] = [
  { title: 'Đơn vị tính', key: 'unitName' },
  // { title: 'Tỷ lệ chuyển đổi', key: 'conversionRate' },
  // { title: 'So với', key: 'compareUnitName' },
  { title: 'Giá bán', key: 'sellPrice' },
  { title: 'Khối lượng', key: 'volumne' },
];

type FormData = {
  id: number;
  name: string;
  description: string;
  sellPrice: number;
  image: string;
  discount: number;
  productUnits: ProductUnit[];
  available: number;
};

function UpdateProductSampleModal(
  props: UpdateModalProps<ProductSampleShoping>,
) {
  const {
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    data: productSampleData,
    setData,
    onMutate,
  } = props;

  const initalFormData = {
    id: 0,
    name: '',
    description: '',
    sellPrice: 0,
    image: '',
    discount: 0,
    productUnits: [],
    available: 0,
  };

  const initialBatch = {
    image: '',
    inventQuantity: 0,
    discount: 0,
    inboundPrice: 0,
  };

  const [formData, setFormData] = useState<FormData>(initalFormData);
  const [productUnits, setProductUnits] = useState<ProductUnitTransform[]>([]);
  const [currentBatch, setCurrentBatch] = useState<any>(initialBatch);

  useEffect(() => {
    if (productSampleData) {
      setFormData({
        id: productSampleData.id,
        name: productSampleData.name,
        description: productSampleData.description,
        sellPrice: productSampleData.sellPrice,
        image: productSampleData.image,
        discount: productSampleData.discount,
        productUnits: productSampleData.productUnits,
        available: productSampleData.available,
      });

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
          image: firstUnit.image,
          inventQuantity: firstBatch?.inventQuantity || 0,
          discount: firstBatch?.discount || 0,
          inboundPrice: firstBatch?.inboundPrice || 0,
        });
      }
    }
  }, [productSampleData]);

  // const handleDeleteUnit = (productUnitId: number) => {
  //   const newProductunits = productUnits?.filter(
  //     (productUnit) => productUnit.id !== productUnitId,
  //   );
  //   setProductUnits(newProductunits);
  //   toast.info(`Đơn vị tính ${productUnitId} đã được xóa`);
  // };

  // const handleFormDataChange = (
  //   field: keyof typeof formData,
  //   value: number[] | string,
  // ) => {
  //   setFormData((prev) => ({ ...prev, [field]: value }));
  // };

  const handleAddUnit = (newUnit: ProductUnitTransform) => {
    if (productUnits) {
      const newProdudctUnits = [...productUnits, newUnit];
      setProductUnits(newProdudctUnits);
    }
  };

  const handleCloseCreateModal = () => {
    setIsUpdateModalOpen(false);
    setFormData(initalFormData);
    setData?.(undefined);
  };

  // const handleUpdateProductSample = async () => {
  //   const { id, ...rest } = formData;

  //   const productUnitsWithImageUrls = await Promise.all(
  //     productUnits.map(async (productUnit) => {
  //       if (productUnit.image instanceof File) {
  //         const formDataImage = new FormData();
  //         formDataImage.append('file', productUnit.image);
  //         const uploadedImageUrl = await uploadImageToS3(formDataImage);

  //         return {
  //           ...productUnit,
  //           image: uploadedImageUrl,
  //         };
  //       }

  //       return productUnit;
  //     }),
  //   );

  //   const productUnitsDto = productUnitsWithImageUrls.map?.((productUnit) => ({
  //     volumne: productUnit.volumne,
  //     sellPrice: productUnit.sellPrice,
  //     conversionRate: productUnit.conversionRate,
  //     compareUnitId: productUnit.compareUnitId,
  //     image: productUnit.image,
  //     productSampleId: formData.id,
  //     unitId: productUnit.unitId,
  //   }));
  //   const payload = { productSampleDto: rest, productUnitsDto };
  //   const res = await handleUpdateProductSampleAction({
  //     id: formData.id,
  //     ...payload,
  //   });

  //   if (res?.data) {
  //     handleCloseCreateModal();
  //     toast.success(res.message);
  //     onMutate();
  //   } else {
  //     toast.error(res.message);
  //   }
  // };

  console.log(productSampleData);

  const ProductSampleButtons = ({
    productSampleData,
  }: {
    productSampleData: ProductSampleShoping | undefined;
  }) => {
    const handleButtonClick = (unit: any, batch: any) => {
      setCurrentBatch({
        image: unit.image,
        inventQuantity: batch?.inventQuantity || 0,
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
                  currentBatch.inventQuantity === batch.inventQuantity &&
                  currentBatch.discount === batch.discount &&
                  currentBatch.inboundPrice === batch.inboundPrice;
                return (
                  <button
                    key={`${unit.id}-${batch.id}-${index}`}
                    onClick={() => handleButtonClick(unit, batch)}
                    className={`btn m-2 col col-md-4 ${
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
          {/* <ProtectedComponent requiredRoles={['u_pdsam']}>
            <Button variant="danger" onClick={handleUpdateProductSample}>
              Lưu
            </Button>
          </ProtectedComponent> */}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UpdateProductSampleModal;
