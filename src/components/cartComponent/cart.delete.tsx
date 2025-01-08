import { handleDeleteCartDetailAction } from '@/services/cartServices';
import { CartDetail } from '@/types/cart';
import { Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

const DeleteCartDetailModal = (props: DeleteModalProps<CartDetail>) => {
  const {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    data: cartDetailData,
    onMutate
  } = props;

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteCartDetail = async () => {
    const res = await handleDeleteCartDetailAction(cartDetailData);
    if (res?.data) {
      toast.success(res.message);
      onMutate();
      handleCloseDeleteModal();
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
          <div>Bạn có chắc muốn xóa mặt hàng</div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDeleteCartDetail}>
            Đồng ý
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteCartDetailModal;
