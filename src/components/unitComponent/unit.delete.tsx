import { handleDeleteUnitAction } from '@/services/unitServices';
import { Unit } from '@/types/unit';
import { Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

const DeleteUnitModal = (props: DeleteModalProps<Unit>) => {
  const {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    data: unitData,
    onMutate,
  } = props;
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteUnit = async () => {
    const res = await handleDeleteUnitAction(unitData?.id);
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
          <div>Bạn có chắc muốn xóa đơn vị tính {unitData?.name}?</div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDeleteUnit}>
            Đồng ý
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteUnitModal;
