import { handleDeleteSupplierAction } from '@/services/supplierServices';
import { Supplier } from '@/types/supplier';
import { Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

const DeleteSupplierModal = (props: DeleteModalProps<Supplier>) => {
  const {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    data: supplierData,
    onMutate,
  } = props;
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteSupplier = async () => {
    const res = await handleDeleteSupplierAction(supplierData?.id);
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
          <text>Bạn có chắc muốn xóa nhà cung cấp {supplierData?.name}?</text>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDeleteSupplier}>
            Đồng ý
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteSupplierModal;
