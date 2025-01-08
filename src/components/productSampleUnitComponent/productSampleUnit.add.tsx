'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import useSWR from 'swr';
import { Input } from '../commonComponent/InputForm';
import { ProductSampleUnitModalProps, Unit } from '@/types/unit';
import { fetchUnits } from '@/services/unitServices';
import Image from 'next/image';

type FormData = {
  unitId: number;
  unitName: string;
  sellPrice: number;
  conversionRate: number;
  compareUnitId: number;
  volumne: number;
  image: string | File;
};

function ProductSampleUnitModal(props: ProductSampleUnitModalProps) {
  const {
    isProductSampleUnitsModalOpen,
    setIsProductSampleUnitsModalOpen,
    productSampleData,
    onAddUnit,
  } = props;
  const initalFormData = {
    unitId: 0,
    sellPrice: 0,
    conversionRate: 1,
    compareUnitId: 0,
    volumne: 0,
    unitName: '',
    image: 'image.url',
  };

  const [formData, setFormData] = useState<FormData>(initalFormData);
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/units`;
  const { data: unitsData, error } = useSWR([url], () => fetchUnits(1, 100));
  const handleCloseProductUnitListModal = () => {
    setIsProductSampleUnitsModalOpen(false);
    setFormData(initalFormData);
  };

  const handleUnitChange = (value: number) => {
    handleFormDataChange('unitId', value);
    const unit = unitsData.results.find((unit: Unit) => unit.id === value);
    handleFormDataChange('unitName', unit.name);
  };

  const handleFormDataChange = useCallback(
    (field: keyof typeof formData, value: number | string | File) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  useEffect(() => {
    handleFormDataChange('compareUnitId', productSampleData?.minUnitId);
  }, [productSampleData, handleFormDataChange]);

  const handleSave = async () => {
    onAddUnit(formData);
    handleCloseProductUnitListModal();
    setIsProductSampleUnitsModalOpen(false);
  };

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
                {formData.image instanceof File ? (
                  <Image
                    src={URL.createObjectURL(formData.image)}
                    alt="Preview"
                    layout="intrinsic"
                    width={200} // Kích thước tùy chỉnh
                    height={200}
                  />
                ) : (
                  <span className="text-muted">Ảnh sản phẩm</span>
                )}
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
                    // placeholder="Chọn đơn vị tính"
                    // options={unitsData?.results}
                    // keyObj="id"
                    // showObj="name"
                    // onSelectedChange={(value) =>
                    //   handleFormDataChange('compareUnitId', value)
                    // }
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

export default ProductSampleUnitModal;
