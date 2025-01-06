import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Input } from './InputForm';
import { handleChangePasswordAction } from '@/services/staffServices';
import { toast } from 'react-toastify';
import { signOut } from 'next-auth/react';

type FormData = {
  id: number;
  password: string;
  newPassword: string;
  confirmPassword: string;
};

function ChangePasswordModal(props: ChangePasswordModalProps) {
  const { isChangePasswordModalOpen, setIsChangePasswordModalOpen, data } =
    props;

  const initalFormData = {
    id: data?.user?.id,
    password: '',
    newPassword: '',
    confirmPassword: '',
  };

  const [formData, setFormData] = useState<FormData>(initalFormData);

  const handleFormDataChange = (
    field: keyof typeof formData,
    value: number[] | string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCloseModal = () => {
    setIsChangePasswordModalOpen(false);
    setFormData(initalFormData);
  };

  const handleChangePassword = async () => {
    const res = await handleChangePasswordAction(formData);
    if (res?.data) {
      handleCloseModal();
      toast.success(res.message);
      await signOut({ redirect: true, callbackUrl: '/login' });
    } else {
      toast.error(res.message);
    }
  };

  return (
    <Modal
      backdrop={'static'}
      show={isChangePasswordModalOpen}
      onHide={handleCloseModal}
    >
      <Modal.Header closeButton>
        <Modal.Title>Đổi mật khẩu</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container mb-4">
          <div className="row mb-3">
            <Input
              size={12}
              readOnly
              title="Họ và tên"
              value={data?.user.name || ''}
            />
          </div>
          <div className="row mb-3">
            <Input
              size={12}
              title="Mật khẩu cũ"
              value={formData.password || ''}
              onChange={(value) => handleFormDataChange('password', value)}
            />
          </div>
          <div className="row mb-3">
            <Input
              size={12}
              title="Mật khẩu mới"
              value={formData.newPassword || ''}
              onChange={(value) => handleFormDataChange('newPassword', value)}
            />
          </div>
          <div className="row mb-3">
            <Input
              title="Xác nhận mật khẩu"
              size={12}
              value={formData.confirmPassword || ''}
              onChange={(value) =>
                handleFormDataChange('confirmPassword', value)
              }
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Thoát
        </Button>
        <Button className="btn-primary" onClick={handleChangePassword}>
          Lưu
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ChangePasswordModal;
