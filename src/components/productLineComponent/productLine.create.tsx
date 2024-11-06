'use client';
import { Modal, Button } from 'react-bootstrap';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { fetchProductTypes } from '@/services/productTypeServices';
import { handleCreaterProductLineAction } from '@/services/productLineServices';
import useSWR from 'swr';
import { ProductType } from '@/types/productType';


function CreateProductLineModal(props: CreateModalProps) {
  const { isCreateModalOpen, setIsCreateModalOpen, onMutate } = props;
  const [name, setName] = useState('');
  const [productTypeId, setProductTypeId] = useState<number>();
  const [productTypeName, setProductTypeName] = useState('');


  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/product-types`;
  const { data: productTypes, error } = useSWR<{ results: ProductType[] }>(url, fetchProductTypes);

  const clearForm = () => {
    setName('');
    setProductTypeName('');
    setProductTypeId(undefined);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    clearForm();
  };

  const handleCreateProductLine = async () => {
    const newProductLine = {
        name,
        productTypeId
      };

    const res = await handleCreaterProductLineAction(newProductLine);
    if (res?.data) {
      handleCloseCreateModal();
      clearForm();
      toast.success('Thêm mới dòng sản phẩm thành công');
      onMutate();
    } else {
      toast.error('Lỗi khi thêm mới dòng sản phẩm');
    }
  };

  const handleSelectedProductType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProductType = productTypes?.results.find(
      (type) => type.id === parseInt(e.target.value),
    );
    setProductTypeId(selectedProductType?.id);
    setProductTypeName(selectedProductType?.name || '');
  };


  return (
    <>
      <Modal
        show={isCreateModalOpen}
        onHide={handleCloseCreateModal}
        backdrop={'static'}
      >
        <Modal.Header closeButton>
          <Modal.Title>Thêm mới dòng sản phẩm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Thông tin loại sản phẩm */}
          <div className="container mb-4">
            <div className="row mb-3">
              <div className="col-md-12">
                <label>Tên dòng sản phẩm</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="col-md-12 pt-4">
                <label>Tên loại sản phẩm</label>
                <select
                  className="form-control"
                  value={productTypeId}
                  onChange={handleSelectedProductType}
                >
                    <option value="">Chọn loại sản phẩm</option>
                  {productTypes?.results?.map((productType: ProductType) => (
                    <option key={productType.id} value={productType.id}>
                      {productType.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCreateModal}>
            Thoát
          </Button>
          <Button variant="danger" onClick={handleCreateProductLine}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CreateProductLineModal;