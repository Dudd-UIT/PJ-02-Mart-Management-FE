'use client';
import { Modal, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Customer } from '@/types/customer';
import { handleUpdateCustomerAction } from '@/services/customerServices';

function UpdateCustomerModal(props: UpdateModalProps<Customer>) {
  const {
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    data: customerData,
    onMutate,
  } = props;

  const [id, setId] = useState<number>();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (customerData) {
      setId(customerData.id);
      setName(customerData.name || '');
      setPhone(customerData.phone || '');
      setAddress(customerData.address || '');
      setEmail(customerData.email || '');
      setScore(customerData.score || 0);
    }
  }, [customerData]);

  const resetForm = () => {
    setId(customerData?.id);
    setName(customerData?.name || '');
    setPhone(customerData?.phone || '');
    setAddress(customerData?.address || '');
    setEmail(customerData?.email || '');
    setScore(customerData?.score || 0);
  };

  const handleCloseCreateModal = () => {
    setIsUpdateModalOpen(false);
    resetForm();
  };

  const handleUpdateCustomer = async () => {
    const newCustomer = {
      id,
      name,
      phone,
      address,
      email,
      score,
    };

    const res = await handleUpdateCustomerAction(newCustomer);
    if (res?.data) {
      console.log('res', res);
      handleCloseCreateModal();
      onMutate();
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <>
      <Modal
        backdrop={'static'}
        show={isUpdateModalOpen}
        onHide={handleCloseCreateModal}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Thông tin khách hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Thông tin khách hàng */}
          <div className="container mb-4">
            <div className="row mb-3">
              <div className="col-md-6">
                <label>Tên khách hàng</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="col-md-6">
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
          <Button variant="danger" onClick={handleUpdateCustomer}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UpdateCustomerModal;
