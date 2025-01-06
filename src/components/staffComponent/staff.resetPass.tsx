import { handleResetPasswordAction } from '@/services/staffServices';
import { Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

const ResetPasswordModal = (props: ResetPasswordModal) => {
  const {
    isResetPasswordModalOpen,
    setIsResetPasswordModalOpen,
    data: staffData,
    // onMutate,
  } = props;

  const handleCloseResetPasswordModal = () => {
    setIsResetPasswordModalOpen(false);
  };

  const handleDeleteStaff = async () => {
    const res = await handleResetPasswordAction(staffData?.id);
    if (res?.data) {
      handleCloseResetPasswordModal();
      // onMutate();
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <>
      <Modal
        show={isResetPasswordModalOpen}
        onHide={handleCloseResetPasswordModal}
        backdrop={'static'}
      >
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            Bạn có chắc muốn reset mật khẩu tài khoản nhân viên{' '}
            {staffData?.name}?
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseResetPasswordModal}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDeleteStaff}>
            Đồng ý
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ResetPasswordModal;
