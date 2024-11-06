'use client';
import { Modal, Button } from 'react-bootstrap';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { handleCreateCustomerAction } from '@/services/customerServices';

function CreateCustomerModal(props: CreateModalProps) {
  const { isCreateModalOpen, setIsCreateModalOpen, onMutate } = props;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  // const [address, setAddress] = useState('');
  // const [email, setEmail] = useState('');
  // const [score, setScore] = useState(0);

  const clearForm = () => {
    setName('');
    setPhone('');
    // setAddress('');
    // setEmail('');
    // setScore(0);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    clearForm();
  };

  const handleCreateSupplier = async () => {
    const newCustomer = {
      name,
      phone,
      // address,
      // email,
      // score,
    };

    const res = await handleCreateCustomerAction(newCustomer);
    if (res?.data) {
      handleCloseCreateModal();
      clearForm();
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
          <Modal.Title>Thêm mới khách hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Thông tin khách hàng */}
          <div className="container mb-4">
            <div className="row mb-3">
              <div className="col-md-12">
                <label>Tên khách hàng</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="col-md-12">
                <label>Số điện thoại</label>
                <input
                  type="text"
                  className="form-control"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
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
