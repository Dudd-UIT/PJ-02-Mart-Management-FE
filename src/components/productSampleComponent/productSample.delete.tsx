import { handleDeleteProductSampleAction } from '@/services/productSampleServices';
import { ProductSample } from '@/types/productSample';
import { Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

const DeleteProductSampleModal = (props: DeleteModalProps<ProductSample>) => {
  const {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    data: productSampleData,
    onMutate,
  } = props;
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteProductSample = async () => {
    const res = await handleDeleteProductSampleAction(productSampleData?.id);
    if (res?.data) {
      handleCloseDeleteModal();
      onMutate();
      toast.success('Xóa mẫu sản phẩm thành công');
    } else {
      toast.error('Lỗi xóa mẫu sản phẩm');
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
          <div>Bạn có chắc muốn xóa mẫu sản phẩm {productSampleData?.name}?</div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDeleteProductSample}>
            Đồng ý
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteProductSampleModal;
