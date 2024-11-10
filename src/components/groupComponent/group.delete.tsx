import { handleDeleteGroupAction } from '@/services/groupServices';
import { Customer } from '@/types/customer';
import { Group } from '@/types/group';
import { Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

const DeleteUserGroupModal = (props: DeleteModalProps<Group>) => {
  const {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    data: groupData,
    onMutate,
  } = props;

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteGroup = async () => {
    const res = await handleDeleteGroupAction(groupData?.id);
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
        backdrop={'static'}
      >
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>Bạn có chắc muốn xóa nhóm người dùng {groupData?.name}?</div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDeleteGroup}>
            Đồng ý
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteUserGroupModal;
