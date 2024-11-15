'use client';
import { Modal, Button } from 'react-bootstrap';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { handleCreateCustomerAction } from '@/services/customerServices';
import { Input } from '../commonComponent/InputForm';

type FormData = {
  name: string;
  phone: string;
};

function CreateCustomerModal(props: CreateModalProps) {
  const { isCreateModalOpen, setIsCreateModalOpen, onMutate } = props;

  const initalFormData = {
    name: '',
    phone: '',
  };

  const [formData, setFormData] = useState<FormData>(initalFormData);

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setFormData(initalFormData);
  };

  const handleCreateSupplier = async () => {
    const res = await handleCreateCustomerAction(formData);
    if (res?.data) {
      handleCloseCreateModal();
      toast.success(res.message);
      onMutate();
    } else {
      toast.error(res.message);
    }
  };

  const handleFormDataChange = (
    field: keyof typeof formData,
    value: number[] | string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <Modal
        show={isCreateModalOpen}
        onHide={handleCloseCreateModal}
        backdrop={'static'}
      >
        <Modal.Header closeButton>
          <Modal.Title>Thêm mới khách hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Thông tin khách hàng */}
          <div className="container mb-4">
            <div className="row mb-3">
              <Input
                title="Tên khách hàng"
                value={formData?.name || ''}
                size={12}
                onChange={(value) => handleFormDataChange('name', value)}
              />
              <Input
                title="Số điện thoại"
                value={formData?.phone || ''}
                size={12}
                onChange={(value) => handleFormDataChange('phone', value)}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCreateModal}>
            Thoát
          </Button>
          <Button variant="danger" onClick={handleCreateSupplier}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CreateCustomerModal;
