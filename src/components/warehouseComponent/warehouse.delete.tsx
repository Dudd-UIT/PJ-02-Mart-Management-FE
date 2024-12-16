import { handleDeleteWarehouseAction } from '@/services/batchServices';
import { BatchGrouped } from '@/types/batch';
import { Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

const DeleteWarehouseModal = (props: DeleteModalProps<BatchGrouped>) => {
  const {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    data: batchData,
    onMutate,
  } = props;
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteWarehouse = async () => {
    const res = await handleDeleteWarehouseAction(batchData?.id);
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
          <text>Bạn có chắc muốn xóa lô hàng mã số {batchData?.id}?</text>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDeleteWarehouse}>
            Đồng ý
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteWarehouseModal;
