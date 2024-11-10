'use client';
import { Modal, Button } from 'react-bootstrap';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { handleCreateGroupAction } from '@/services/groupServices';

function CreateUserGroupModal(props: CreateModalProps) {
  const { isCreateModalOpen, setIsCreateModalOpen, onMutate } = props;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const clearForm = () => {
    setName('');
    setDescription('');
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    clearForm();
  };

  const handleCreateGroup = async () => {
    const newGroup = {
      name,
      description,
    };

    const res = await handleCreateGroupAction(newGroup);
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
          <Modal.Title>Thêm mới nhóm người dùng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Thông tin nhóm người dùng */}
          <div className="container mb-4">
            <div className="row mb-3">
              <div className="col-md-12">
                <label>Tên nhóm người dùng</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="col-md-12">
                <label>Mô tả</label>
                <input
                  type="text"
                  className="form-control"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </div>
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
