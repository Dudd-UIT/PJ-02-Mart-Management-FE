'use client';
import { Modal, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Staff } from '@/types/staff';
import { handleUpdateStaffAction } from '@/services/staffServices';
import { Input } from '../commonComponent/InputForm';
import useSWR from 'swr';
import { fetchGroups } from '@/services/groupServices';
import ProtectedComponent from '../commonComponent/ProtectedComponent';

type FormData = {
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

  const initalFormData = {
    id: 0,
    name: '',
    phone: '',
    address: '',
    email: '',
    password: '',
    groupId: 0,
  };

  const [formData, setFormData] = useState<FormData>(initalFormData);

  useEffect(() => {
    if (staffData) {
      setFormData({
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
    const res = await handleUpdateStaffAction(formData);
    if (res?.data) {
      handleCloseUpdateModal();
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

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/groups`;

  const { data: groups, error } = useSWR([url], () => fetchGroups());

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
                value={formData?.name || ''}
                onChange={(value) => handleFormDataChange('name', value)}
              />
              <Input
                title="Nhóm người dùng"
                size={5}
                value={formData?.groupId || 0}
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
                value={formData?.email || ''}
                onChange={(value) => handleFormDataChange('email', value)}
              />
              <Input
                size={6}
                readOnly={true}
                title="Mật khẩu"
                value={formData?.password || ''}
                onChange={(value) => handleFormDataChange('password', value)}
              />
            </div>
            <div className="row mb-3">
              <Input
                size={4}
                title="Số điện thoại"
                value={formData?.phone || ''}
                onChange={(value) => handleFormDataChange('phone', value)}
              />
              <Input
                title="Địa chỉ"
                size={8}
                value={formData?.address || ''}
                onChange={(value) => handleFormDataChange('address', value)}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseUpdateModal}>
            Thoát
          </Button>
          <ProtectedComponent requiredRoles={['u_staff']}>
            <Button variant="danger" onClick={handleUpdateStaff}>
              Lưu
            </Button>
          </ProtectedComponent>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UpdateStaffModal;
