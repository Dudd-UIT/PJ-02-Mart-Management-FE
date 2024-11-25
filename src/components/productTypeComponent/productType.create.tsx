'use client';
import { Modal, Button } from 'react-bootstrap';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { handleCreaterProductTypeAction } from '@/services/productTypeServices';

function CreateProductTypeModal(props: CreateModalProps) {
  const { isCreateModalOpen, setIsCreateModalOpen, onMutate } = props;
  const [name, setName] = useState('');

  const clearForm = () => {
    setName('');
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    clearForm();
  };

  const handleCreateProductType = async () => {
    const newProductType = {
        name,
      };

    const res = await handleCreaterProductTypeAction(newProductType);
    if (res?.data) {
      handleCloseCreateModal();
      clearForm();
      toast.success('Thêm mới loại sản phẩm thành công');
      onMutate();
    } else {
      toast.error('Lỗi khi thêm mới loại sản phẩm');
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
          <div className="container mb-4 px-4">
              <label>Tên loại sản phẩm</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
          </div>
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
