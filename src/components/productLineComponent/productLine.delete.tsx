import { handleDeleteProductLineAction } from '@/services/productLineServices';
import { ProductLineTransform } from '@/types/productLine';
import { Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

const DeleteProductLineModal = (
  props: DeleteModalProps<ProductLineTransform>,
) => {
  const {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    data: productTypeData,
    onMutate,
  } = props;
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteProductLine = async () => {
    const res = await handleDeleteProductLineAction(productTypeData?.id);
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
          <div>Bạn có chắc muốn xóa dòng sản phẩm {productTypeData?.name}?</div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDeleteProductLine}>
            Đồng ý
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteProductLineModal;
