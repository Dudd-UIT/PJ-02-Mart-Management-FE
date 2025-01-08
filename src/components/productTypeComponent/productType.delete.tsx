import { handleDeleteProductTypeAction } from '@/services/productTypeServices';
import { ProductType } from '@/types/productType';
import { Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

const DeleteProductTypeModal = (props: DeleteModalProps<ProductType>) => {
  const {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    data: productTypeData,
    onMutate,
  } = props;
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteProductType = async () => {
    const res = await handleDeleteProductTypeAction(productTypeData?.id);
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
          <div>Bạn có chắc muốn xóa loại sản phẩm {productTypeData?.name}?</div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDeleteProductType}>
            Đồng ý
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteProductTypeModal;
