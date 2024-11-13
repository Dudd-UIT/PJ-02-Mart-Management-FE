'use client';
import { Modal, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Staff } from '@/types/staff';
import { handleUpdateStaffAction } from '@/services/staffServices';
import { Input } from '../commonComponent/InputForm';
import useSWR from 'swr';
import { fetchGroups } from '@/services/groupServices';

type FormDataStaffInfo = {
  id: number;
  groupId: number;
  name: string;
  phone: string;
  address: string;
  email: string;
  password?: string;
};

function UpdateStaffModal(props: UpdateModalProps<Staff>) {
  const {
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    data: staffData,
    setData: setStaffData,
    onMutate,
  } = props;

  const initalStaffInfo = {
    id: 0,
    name: '',
    phone: '',
    address: '',
    email: '',
    password: '',
    groupId: 0,
  };

  const [staffInfo, setStaffInfo] =
    useState<FormDataStaffInfo>(initalStaffInfo);

  useEffect(() => {
    if (staffData) {
      setStaffInfo({
        id: staffData.id,
        name: staffData.name,
        phone: staffData.phone,
        address: staffData.address,
        email: staffData.email,
        // password: staffData.password,
        groupId: staffData?.group?.id,
      });
    }
  }, [staffData]);

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setStaffData?.(undefined);
  };

  const handleUpdateStaff = async () => {
    const res = await handleUpdateStaffAction(staffInfo);
    if (res?.data) {
      handleCloseUpdateModal();
      onMutate();
      toast.success(res.message);
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

  const { data: groups, error } = useSWR([], () => fetchGroups());

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
        backdrop={'static'}
        show={isUpdateModalOpen}
        onHide={handleCloseUpdateModal}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Thông tin nhân viên</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Thông tin nhân viên */}
          <div className="container mb-4">
            <div className="row mb-3">
              <Input
                size={7}
                title="Tên nhân viên"
                value={staffInfo?.name || ''}
                onChange={(value) => handleStaffInfoChange('name', value)}
              />
              <Input
                title="Nhóm người dùng"
                size={5}
                value={staffInfo?.groupId || 0}
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
                value={staffInfo?.email || ''}
                onChange={(value) => handleStaffInfoChange('email', value)}
              />
              <Input
                size={6}
                readOnly={true}
                title="Mật khẩu"
                value={staffInfo?.password || ''}
                onChange={(value) => handleStaffInfoChange('password', value)}
              />
            </div>
            <div className="row mb-3">
              <Input
                size={4}
                title="Số điện thoại"
                value={staffInfo?.phone || ''}
                onChange={(value) => handleStaffInfoChange('phone', value)}
              />

              <Input
                title="Địa chỉ"
                size={8}
                value={staffInfo?.address || ''}
                onChange={(value) => handleStaffInfoChange('address', value)}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseUpdateModal}>
            Thoát
          </Button>
          <Button variant="danger" onClick={handleUpdateStaff}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UpdateStaffModal;
