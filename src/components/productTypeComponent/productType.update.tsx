'use client';

import { Modal, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { handleUpdateProductTypeAction } from '@/services/productTypeServices';
import { ProductType } from '@/types/productType';

function UpdateProductTypeModal(props: UpdateModalProps<ProductType>) {
  const {
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    data: productTypeData,
    onMutate,
  } = props;

  const [id, setId] = useState<number>();
  const [name, setName] = useState('');

  useEffect(() => {
    if (productTypeData) {
      setId(productTypeData.id);
      setName(productTypeData.name || '');
    }
  }, [productTypeData]);

  const resetForm = () => {
    setId(productTypeData?.id);
    setName(productTypeData?.name || '');
  };

  const handleCloseCreateModal = () => {
    setIsUpdateModalOpen(false);
    resetForm();
  };

  const handleUpdateProductType = async () => {
    const newProductType = {
      id,
      name,
    };

    const res = await handleUpdateProductTypeAction(newProductType);
    if (res?.data) {
      handleCloseCreateModal();
      toast.success('Cập nhật loại sản phẩm thành công');
      onMutate(); // Gọi hàm onMutate để cập nhật danh sách
    } else {
      toast.error('Lỗi cập nhật loại sản phẩm');
    }
  };

  return (
    <>
      <Modal
        backdrop={'static'}
        show={isUpdateModalOpen}
        onHide={handleCloseCreateModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Thông tin loại sản phẩm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Thông tin loại sản phẩm */}
          <div className="container mb-4">
            <div className="row mb-3">
              <div className="col-md-12">
                <label>Tên loại sản phẩm</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCreateModal}>
            Thoát
          </Button>
          <Button variant="danger" onClick={handleUpdateProductType}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UpdateProductTypeModal;
