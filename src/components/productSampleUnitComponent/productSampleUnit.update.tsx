'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import useSWR from 'swr';
import { Input } from '../commonComponent/InputForm';
import {
  ProductSampleUnitModalProps,
  Unit,
  UpdateProductSampleUnitModalProps,
} from '@/types/unit';
import { fetchUnits } from '@/services/unitServices';
import Image from 'next/image';

type FormData = {
  id: number;
  unitId: number;
  unitName: string;
  sellPrice: number;
  conversionRate: number;
  compareUnitId: number;
  volumne: string;
  image: string | File;
};

function UpdateProductSampleUnitModal(
  props: UpdateProductSampleUnitModalProps,
) {
  const {
    isProductSampleUnitsModalOpen,
    setIsProductSampleUnitsModalOpen,
    productSampleData,
    productUnitData,
    onUpdateUnit,
    setData,
  } = props;
  const initalFormData = {
    id: 0,
    unitId: 0,
    sellPrice: 0,
    conversionRate: 1,
    compareUnitId: 0,
    volumne: '',
    unitName: '',
    image: '/images/warehousePH.png',
  };

  const [formData, setFormData] = useState<FormData>(initalFormData);
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/units`;
  const { data: unitsData, error } = useSWR([url], () => fetchUnits(1, 100));

  const handleCloseProductUnitListModal = () => {
    setIsProductSampleUnitsModalOpen(false);
    setFormData(initalFormData);
    setData?.(undefined);
  };

  const handleUnitChange = (value: number) => {
    handleFormDataChange('unitId', value);
    const unit = unitsData?.results?.find((unit: Unit) => unit.id === value);
    handleFormDataChange('unitName', unit?.name || '');
  };

  const handleFormDataChange = useCallback(
    (field: keyof typeof formData, value: number | string | File) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  useEffect(() => {
    if (productUnitData) {
      setFormData({
        id: productUnitData.id || 0,
        unitId: productUnitData.unitId || 0,
        unitName: productUnitData.unitName || '',
        volumne: productUnitData.volumne || '',
        conversionRate: productUnitData.conversionRate || 1,
        sellPrice: productUnitData.sellPrice || 0,
        compareUnitId: productSampleData?.minUnitId || 0,
        image: productUnitData.image || '/images/warehousePH.png',
      });
    }
  }, [productUnitData, productSampleData]);

  const handleSave = async () => {
    onUpdateUnit(formData);
    handleCloseProductUnitListModal();
    setIsProductSampleUnitsModalOpen(false);
  };

  const getImageSrc = () => {
    if (formData.image instanceof File) {
      return URL.createObjectURL(formData.image); // Tạo URL tạm thời cho File
    }
    return typeof formData.image === 'string'
      ? formData.image
      : '/images/warehousePH.png'; // Sử dụng URL hoặc ảnh mặc định
  };

  console.log('------productUnitData', productUnitData);

  return (
    <Modal
      backdrop="static"
      show={isProductSampleUnitsModalOpen}
      onHide={handleCloseProductUnitListModal}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Thông tin đơn vị tính</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container p-3">
          <div className="row g-3">
            <div className="col-md-4 d-flex align-items-center justify-content-center">
              <div
                className="border rounded bg-light d-flex align-items-center justify-content-center"
                style={{ width: '100%', height: '200px' }}
              >
                <Image
                  src={getImageSrc()}
                  alt="Preview"
                  width={200}
                  height={200}
                  className="img-fluid img-thumbnail"
                />
              </div>
            </div>
            <div className="mt-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFormDataChange('image', e.target.files[0]);
                  }
                }}
              />
            </div>

            <div className="col-md-8">
              <div className="mb-3">
                <Input
                  title="Đơn vị tính"
                  size={12}
                  value={formData.unitId}
                  placeholder="Chọn đơn vị tính"
                  options={unitsData?.results}
                  keyObj="id"
                  showObj="name"
                  readOnly={true}
                  onSelectedChange={(value) => handleUnitChange(value)}
                />
              </div>
              <div className="mb-3">
                <Input
                  title="Khối lượng"
                  value={formData?.volumne || ''}
                  size={12}
                  onChange={(value) => handleFormDataChange('volumne', value)}
                />
              </div>
              {productSampleData && (
                <div className="row mb-3">
                  <Input
                    title="Tỷ lệ quy đổi"
                    value={formData?.conversionRate || ''}
                    size={6}
                    onChange={(value) =>
                      handleFormDataChange('conversionRate', +value)
                    }
                  />
                  <Input
                    title="So với"
                    size={6}
                    value={productSampleData?.minUnitName}
                    disabled
                    readOnly={true}
                  />
                </div>
              )}

              {productUnitData?.batches?.[0] && (
                <div className="mb-3">
                  <Input
                    title="Giá nhập trên 1 đơn vị trong lô hàng gần nhất"
                    size={12}
                    value={productUnitData?.batches?.[0].inboundPrice}
                    readOnly={true}
                  />
                </div>
              )}

              <div className="mb-3">
                <Input
                  title="Giá bán"
                  value={formData?.sellPrice || ''}
                  size={12}
                  onChange={(value) => handleFormDataChange('sellPrice', value)}
                />
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleCloseProductUnitListModal}>
          Thoát
        </Button>
        <Button className="btn-primary" onClick={handleSave}>
          Lưu
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UpdateProductSampleUnitModal;
