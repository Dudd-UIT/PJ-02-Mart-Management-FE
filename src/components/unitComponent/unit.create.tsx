'use client';

import { Modal, Button } from 'react-bootstrap';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { Input } from '../commonComponent/InputForm';
import { handleCreateUnitAction } from '@/services/unitServices';

function CreateUnitModal(props: CreateModalProps) {
  const { isCreateModalOpen, setIsCreateModalOpen, onMutate } = props;
  const [name, setName] = useState('');

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setName('');
  };

  const handleCreateUnit = async () => {
    const newUnit = {
      name,
    };

    const res = await handleCreateUnitAction(newUnit);
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
          <Modal.Title>Thêm mới đơn vị tính</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Thông tin đơn vị tính */}
          <Input
            size={12}
            title="Tên đơn vị tính"
            value={name}
            onChange={(value) => setName(value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCreateModal}>
            Thoát
          </Button>
          <Button variant="danger" onClick={handleCreateUnit}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CreateUnitModal;
