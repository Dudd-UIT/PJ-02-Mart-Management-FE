'use client';
import { Modal, Button } from 'react-bootstrap';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { handleCreateStaffAction } from '@/services/staffServices';
import { Input } from '../commonComponent/InputForm';
import { FaSearch } from 'react-icons/fa';
import { fetchGroups } from '@/services/groupServices';
import useSWR from 'swr';

type FormDataStaffInfo = {
  groupId: number;
  name: string;
  phone: string;
  address: string;
  email: string;
  password: string;
};

function CreateStaffModal(props: CreateModalProps) {
  const { isCreateModalOpen, setIsCreateModalOpen, onMutate } = props;

  const initalStaffInfo = {
    name: '',
    phone: '',
    address: '',
    email: '',
    password: '',
    groupId: 0,
  };

  const [staffInfo, setStaffInfo] =
    useState<FormDataStaffInfo>(initalStaffInfo);

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setStaffInfo(initalStaffInfo);
  };

  const handleCreateStaff = async () => {
    const res = await handleCreateStaffAction(staffInfo);
    if (res?.data) {
      handleCloseCreateModal();
      toast.success(res.message);
      onMutate();
    } else {
      toast.error(res.message);
    }
  };

  const handleStaffInfoChange = (
    field: keyof typeof staffInfo,
    value: number | string,
  ) => {
    setStaffInfo((prev) => ({ ...prev, [field]: value }));
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
                value={staffInfo.name}
                onChange={(value) => handleStaffInfoChange('name', value)}
              />
              <Input
                title="Nhóm người dùng"
                size={5}
                value={staffInfo.groupId}
                placeholder="Chọn nhóm người dùng"
                // icon={<FaSearch />}
                options={groups?.results}
                keyObj="id"
                showObj="name"
                onSelectedChange={(value) =>
                  handleStaffInfoChange('groupId', value)
                }
              />
            </div>
            <div className="row mb-3">
              <Input
                size={6}
                title="Email"
                value={staffInfo.email}
                onChange={(value) => handleStaffInfoChange('email', value)}
              />
              <Input
                size={6}
                title="Mật khẩu"
                value={staffInfo.password}
                onChange={(value) => handleStaffInfoChange('password', value)}
              />
            </div>
            <div className="row mb-3">
              <Input
                size={4}
                title="Số điện thoại"
                value={staffInfo.phone}
                onChange={(value) => handleStaffInfoChange('phone', value)}
              />

              <Input
                title="Địa chỉ"
                size={8}
                value={staffInfo.address}
                onChange={(value) => handleStaffInfoChange('address', value)}
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
