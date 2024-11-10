'use client';
import { Modal, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { handleUpdateCustomerAction } from '@/services/customerServices';
import { Group } from '@/types/group';
import { handleUpdateGroupAction } from '@/services/groupServices';

function UpdateUserGroupModal(props: UpdateModalProps<Group>) {
  const {
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    data: groupData,
    onMutate,
  } = props;

  const [id, setId] = useState<number>();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (groupData) {
      setId(groupData.id);
      setName(groupData.name || '');
      setDescription(groupData.description || '');
    }
  }, [groupData]);

  const resetForm = () => {
    setId(groupData?.id);
    setName(groupData?.name || '');
    setDescription(groupData?.description || '');
  };

  const handleCloseCreateModal = () => {
    setIsUpdateModalOpen(false);
    resetForm();
  };

  const handleUpdateGroup = async () => {
    const newGroup = {
      id,
      name,
      description,
    };

    const res = await handleUpdateGroupAction(newGroup);
    if (res?.data) {
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
          <Modal.Title>Thông tin nhóm người dùng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Thông tin khách hàng */}
          <div className="container mb-4">
            <div className="row mb-3">
              <div className="col-md-6">
                <label>Tên nhóm người dùng</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="col-md-6">
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
          <Button variant="danger" onClick={handleUpdateGroup}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UpdateUserGroupModal;
