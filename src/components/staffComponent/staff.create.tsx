'use client';
import { Modal, Button } from 'react-bootstrap';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { handleCreateStaffAction } from '@/services/staffServices';
import { Input } from '../commonComponent/InputForm';
import { FaSearch } from 'react-icons/fa';
import { fetchGroups } from '@/services/groupServices';
import useSWR from 'swr';

type FormData = {
  groupId: number;
  name: string;
  phone: string;
  address: string;
  email: string;
  password: string;
};

function CreateStaffModal(props: CreateModalProps) {
  const { isCreateModalOpen, setIsCreateModalOpen, onMutate } = props;

  const initalFormData = {
    name: '',
    phone: '',
    address: '',
    email: '',
    password: '',
    groupId: 0,
  };

  const [formData, setFormData] = useState<FormData>(initalFormData);

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setFormData(initalFormData);
  };

  const handleCreateStaff = async () => {
    const res = await handleCreateStaffAction(formData);
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
    value: number | string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/groups`;

  const { data: groups, error } = useSWR([url], () => fetchGroups());

  if (error)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div>Failed to load groups: {error.message}</div>
      </div>
    );

  if (!groups)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-grow text-success" role="status"></div>
        <span className="sr-only text-success">Loading...</span>
      </div>
    );

  return (
    <>
      <Modal
        show={isCreateModalOpen}
        onHide={handleCloseCreateModal}
        backdrop={'static'}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Thêm mới tài khoản nhân viên</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Thông tin tài khoản nhân viên */}
          <div className="container mb-4">
            <div className="row mb-3">
              <Input
                size={7}
                title="Tên nhân viên"
                value={formData.name}
                onChange={(value) => handleFormDataChange('name', value)}
              />
              <Input
                title="Nhóm người dùng"
                size={5}
                value={formData.groupId}
                placeholder="Chọn nhóm người dùng"
                options={groups?.results}
                keyObj="id"
                showObj="name"
                onSelectedChange={(value) =>
                  handleFormDataChange('groupId', value)
                }
              />
            </div>
            <div className="row mb-3">
              <Input
                size={6}
                title="Email"
                value={formData.email}
                onChange={(value) => handleFormDataChange('email', value)}
              />
              <Input
                size={6}
                title="Mật khẩu"
                value={formData.password}
                onChange={(value) => handleFormDataChange('password', value)}
              />
            </div>
            <div className="row mb-3">
              <Input
                size={4}
                title="Số điện thoại"
                value={formData.phone}
                onChange={(value) => handleFormDataChange('phone', value)}
              />

              <Input
                title="Địa chỉ"
                size={8}
                value={formData.address}
                onChange={(value) => handleFormDataChange('address', value)}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCreateModal}>
            Thoát
          </Button>
          <Button variant="danger" onClick={handleCreateStaff}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CreateStaffModal;
