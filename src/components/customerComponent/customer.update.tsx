'use client';
import { Modal, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Customer } from '@/types/customer';
import { handleUpdateCustomerAction } from '@/services/customerServices';
import { Input } from '../commonComponent/InputForm';

type FormData = {
  id: number;
  name: string;
  phone: string;
  address: string;
  email: string;
  score: number;
};

function UpdateCustomerModal(props: UpdateModalProps<Customer>) {
  const {
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    data: customerData,
    setData,
    onMutate,
  } = props;

  const initalFormData = {
    id: 0,
    name: '',
    phone: '',
    address: '',
    email: '',
    score: 0,
  };

  const [formData, setFormData] = useState<FormData>(initalFormData);

  useEffect(() => {
    if (customerData) {
      setFormData({
        id: customerData.id,
        name: customerData.name || '',
        phone: customerData.phone || '',
        address: customerData.address || '',
        email: customerData.email || '',
        score: customerData.score || 0,
      });
    }
  }, [customerData]);

  const handleCloseModal = () => {
    setIsUpdateModalOpen(false);
    setData?.(undefined);
  };

  const handleUpdateCustomer = async () => {
    const res = await handleUpdateCustomerAction(formData);
    if (res?.data) {
      handleCloseModal();
      onMutate();
      toast.success(res.message);
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
        backdrop={'static'}
        show={isUpdateModalOpen}
        onHide={handleCloseModal}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Thông tin khách hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Thông tin khách hàng */}
          <div className="container mb-4">
            <div className="row mb-3">
              <Input
                title="Tên khách hàng"
                value={formData?.name || ''}
                size={6}
                onChange={(value) => handleFormDataChange('name', value)}
              />
              <Input
                title="Số điện thoại"
                value={formData?.phone || ''}
                size={6}
                onChange={(value) => handleFormDataChange('phone', value)}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Thoát
          </Button>
          <Button variant="danger" onClick={handleUpdateCustomer}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UpdateCustomerModal;
