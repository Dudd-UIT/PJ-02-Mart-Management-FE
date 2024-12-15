import { handleDeleteCustomerAction } from '@/services/customerServices';
import { Customer } from '@/types/customer';
import { Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

const DeleteCustomerModal = (props: DeleteModalProps<Customer>) => {
  const {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    data: customerData,
    onMutate,
  } = props;

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteCustomer = async () => {
    const res = await handleDeleteCustomerAction(customerData?.id);
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
          <div>Bạn có chắc muốn xóa khách hàng {customerData?.name}?</div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDeleteCustomer}>
            Đồng ý
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteCustomerModal;
