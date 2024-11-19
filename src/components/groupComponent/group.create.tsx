'use client';
import { Modal, Button } from 'react-bootstrap';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { handleCreateGroupAction } from '@/services/groupServices';
import { Input } from '../commonComponent/InputForm';

type FormData = {
  name: string;
  description: string;
};

function CreateUserGroupModal(props: CreateModalProps) {
  const { isCreateModalOpen, setIsCreateModalOpen, onMutate } = props;

  const initalFormData = {
    name: '',
    description: '',
  };

  const [formData, setFormData] = useState<FormData>(initalFormData);

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setFormData(initalFormData);
  };

  const handleCreateGroup = async () => {
    const res = await handleCreateGroupAction(formData);
    if (res?.data) {
      handleCloseCreateModal();
      setFormData(initalFormData);
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
          <Modal.Title>Thêm mới nhóm người dùng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Thông tin nhóm người dùng */}
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
          <Button variant="danger" onClick={handleCreateGroup}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CreateUserGroupModal;
