import { handleDeletedInboundReceiptAction } from '@/services/inboundReceiptServices';
import { handleDeletedOrderAction } from '@/services/orderServices';
import { InboundReceiptTransform } from '@/types/inboundReceipt';
import { OrderTransform } from '@/types/order';
import { Supplier } from '@/types/supplier';
import { Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

const DeleteOrderModal = (props: DeleteModalProps<OrderTransform>) => {
  const {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    data: orderData,
    onMutate,
  } = props;
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteInboundReceipt = async () => {
    const res = await handleDeletedOrderAction(orderData?.id);
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
          <text>Bạn có chắc muốn xóa đơn hàng {orderData?.id}?</text>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDeleteInboundReceipt}>
            Đồng ý
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteOrderModal;
