'use client';

import { Modal, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { handleUpdateProductTypeAction } from '@/services/productTypeServices';
import { ProductType } from '@/types/productType';
import { Input } from '../commonComponent/InputForm';

function UpdateProductTypeModal(props: UpdateModalProps<ProductType>) {
  const {
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    data: productTypeData,
    setData,
    onMutate,
  } = props;

  const [id, setId] = useState<number>();
  const [name, setName] = useState('');

  useEffect(() => {
    if (productTypeData) {
      setId(productTypeData.id);
      setName(productTypeData.name || '');
    }
  }, [productTypeData]);

  const resetForm = () => {
    setId(productTypeData?.id);
    setName(productTypeData?.name || '');
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    resetForm();
    setData?.(undefined);
  };

  const handleUpdateProductType = async () => {
    const newProductType = {
      id,
      name,
    };

    const res = await handleUpdateProductTypeAction(newProductType);
    if (res?.data) {
      handleCloseUpdateModal();
      toast.success(res.message);
      onMutate();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <>
      <Modal
        backdrop={'static'}
        show={isUpdateModalOpen}
        onHide={handleCloseUpdateModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Thông tin loại sản phẩm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Thông tin loại sản phẩm */}
          <Input
            size={12}
            title="Tên loại sản phẩm"
            value={name}
            onChange={(value) => setName(value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseUpdateModal}>
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

export default UpdateProductTypeModal;
