'use client';
import { Modal, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { handleUpdateCustomerAction } from '@/services/customerServices';
import { Group } from '@/types/group';
import { handleUpdateGroupAction } from '@/services/groupServices';
import { Input } from '../commonComponent/InputForm';
import ProtectedComponent from '../commonComponent/ProtectedComponent';

type FormData = {
  id: number;
  name: string;
  description: string;
};

function UpdateUserGroupModal(props: UpdateModalProps<Group>) {
  const {
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    data: groupData,
    setData,
    onMutate,
  } = props;

  const initalFormData = {
    id: 0,
    name: '',
    description: '',
  };

  const [formData, setFormData] = useState<FormData>(initalFormData);

  useEffect(() => {
    if (groupData) {
      setFormData({
        id: groupData.id,
        name: groupData.name || '',
        description: groupData.description || '',
      });
    }
  }, [groupData]);

  const handleCloseCreateModal = () => {
    setIsUpdateModalOpen(false);
    setData?.(undefined);
  };

  const handleUpdateGroup = async () => {
    const res = await handleUpdateGroupAction(formData);
    if (res?.data) {
      handleCloseCreateModal();
      onMutate();
      toast.success(res.message);
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
        onHide={handleCloseCreateModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Thông tin nhóm người dùng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Thông tin khách hàng */}
          <Input
            title="Tên nhóm người dùng"
            size={12}
            value={formData.name}
            onChange={(value) => handleFormDataChange('name', value)}
          />
          <Input
            title="Mô tả"
            size={12}
            value={formData.description}
            onChange={(value) => handleFormDataChange('description', value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCreateModal}>
            Thoát
          </Button>
          <ProtectedComponent requiredRoles={['u_group']}>
            <Button variant="danger" onClick={handleUpdateGroup}>
              Lưu
            </Button>
          </ProtectedComponent>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UpdateUserGroupModal;
