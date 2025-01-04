'use client';

import { Modal, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Input } from '../commonComponent/InputForm';
import ProtectedComponent from '../commonComponent/ProtectedComponent';
import { Unit } from '@/types/unit';
import { handleUpdateUnitAction } from '@/services/unitServices';

function UpdateUnitModal(props: UpdateModalProps<Unit>) {
  const {
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    data: unitData,
    setData,
    onMutate,
  } = props;

  const [id, setId] = useState<number>();
  const [name, setName] = useState('');

  useEffect(() => {
    if (unitData) {
      setId(unitData.id);
      setName(unitData.name || '');
    }
  }, [unitData]);

  const resetForm = () => {
    setId(unitData?.id);
    setName(unitData?.name || '');
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    resetForm();
    setData?.(undefined);
  };

  const handleUpdateUnit = async () => {
    const newUnit = {
      id,
      name,
    };

    const res = await handleUpdateUnitAction(newUnit);
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
          <Modal.Title>Thông tin đơn vị tính</Modal.Title>
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
          <Button variant="secondary" onClick={handleCloseUpdateModal}>
            Thoát
          </Button>
          <ProtectedComponent requiredRoles={['u_unit']}>
            <Button variant="danger" onClick={handleUpdateUnit}>
              Lưu
            </Button>
          </ProtectedComponent>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UpdateUnitModal;
