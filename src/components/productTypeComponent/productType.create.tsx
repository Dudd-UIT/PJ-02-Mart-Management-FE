'use client';

import { Modal, Button } from 'react-bootstrap';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { handleCreateProductTypeAction } from '@/services/productTypeServices';
import { Input } from '../commonComponent/InputForm';

function CreateProductTypeModal(props: CreateModalProps) {
  const { isCreateModalOpen, setIsCreateModalOpen, onMutate } = props;
  const [name, setName] = useState('');

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setName('');
  };

  const handleCreateProductType = async () => {
    const newProductType = {
      name,
    };

    const res = await handleCreateProductTypeAction(newProductType);
    if (res?.data) {
      handleCloseCreateModal();
      toast.success(res.message);
      onMutate();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <>
      <Modal
        show={isCreateModalOpen}
        onHide={handleCloseCreateModal}
        backdrop={'static'}
      >
        <Modal.Header closeButton>
          <Modal.Title>Thêm mới loại sản phẩm</Modal.Title>
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
          <Button variant="secondary" onClick={handleCloseCreateModal}>
            Thoát
          </Button>
          <Button variant="danger" onClick={handleCreateProductType}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CreateProductTypeModal;
