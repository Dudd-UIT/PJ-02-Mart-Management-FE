'use client';

import { Modal, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { ProductLineTransform } from '@/types/productLine';
import { handleUpdateProductLineAction } from '@/services/productLineServices';
import useSWR from 'swr';
import { fetchProductTypes } from '@/services/productTypeServices';
import { Input } from '../commonComponent/InputForm';

type FormData = {
  id: number;
  name: string;
  productTypeId: number;
};

function UpdateProductLineModal(props: UpdateModalProps<ProductLineTransform>) {
  const {
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    data: productLineData,
    setData,
    onMutate,
  } = props;

  const initalFormData = {
    id: 0,
    name: '',
    productTypeId: 0,
  };

  const [formData, setFormData] = useState<FormData>(initalFormData);

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/product-types`;

  const { data: productTypes, error } = useSWR([url], () =>
    fetchProductTypes(),
  );

  useEffect(() => {
    if (productLineData) {
      setFormData({
        id: productLineData.id,
        name: productLineData.name,
        productTypeId: productLineData?.productTypeId,
      });
    }
  }, [productLineData]);

  const handleCloseModal = () => {
    setIsUpdateModalOpen(false);
    setFormData(initalFormData);
    setData?.(undefined);
  };

  const handleUpdateProductType = async () => {
    const res = await handleUpdateProductLineAction(formData);
    if (res?.data) {
      handleCloseModal();
      toast.success(res.message);
      onMutate();
    } else {
      toast.error(res.message);
    }
  };

  const handleFormDataChange = (
    field: keyof typeof formData,
    value: number | string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <Modal
        backdrop={'static'}
        show={isUpdateModalOpen}
        onHide={handleCloseModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Thông tin dòng sản phẩm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container mb-4">
            <div className="row mb-3">
              <Input
                size={12}
                title="Tên dòng sản phẩm"
                value={formData?.name || ''}
                onChange={(value) => handleFormDataChange('name', value)}
              />
              <Input
                title="Tên loại sản phẩm"
                size={12}
                value={formData.productTypeId}
                placeholder="Chọn tên loại sản phẩm"
                options={productTypes?.results}
                keyObj="id"
                showObj="name"
                onSelectedChange={(value) =>
                  handleFormDataChange('productTypeId', value)
                }
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Thoát
          </Button>
          <Button variant="danger" onClick={handleUpdateProductType}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UpdateProductLineModal;
