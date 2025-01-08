import { handleDeleteStaffAction } from '@/services/staffServices';
import { Staff } from '@/types/staff';
import { Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

const DeleteStaffModal = (props: DeleteModalProps<Staff>) => {
  const {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    data: staffData,
    onMutate,
  } = props;

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteStaff = async () => {
    const res = await handleDeleteStaffAction(staffData?.id);
    if (res?.data) {
      handleCloseDeleteModal();
      onMutate();
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <>
      <Modal
        show={isDeleteModalOpen}
        onHide={handleCloseDeleteModal}
        size="lg"
        backdrop={'static'}
      >
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>Bạn có chắc muốn xóa tài khoản nhân viên {staffData?.name}?</div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
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

export default DeleteStaffModal;
