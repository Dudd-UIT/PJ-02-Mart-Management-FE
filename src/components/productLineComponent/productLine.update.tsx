'use client';

import { Modal, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { ProductLine } from '@/types/productLine';
import { handleUpdateProductLineAction } from '@/services/productLineServices';
import useSWR from 'swr';
import { fetchProductTypes } from '@/services/productTypeServices';
import { ProductType } from '@/types/productType';
import { Input } from '../commonComponent/InputForm';

function UpdateProductLineModal(props: UpdateModalProps<ProductLine>) {
  const {
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    data: productLineData,
    onMutate,
  } = props;

  const [id, setId] = useState<number>();
  const [name, setName] = useState('');
  const [productTypeName, setProductTypeName] = useState('');
  const [productTypeId, setProductTypeId] = useState<number>();

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/product-types`;

  const { data: productTypes, error } = useSWR<{ results: ProductType[] }>(url, fetchProductTypes);


  useEffect(() => {
    if (productLineData) {
      setId(productLineData.id);
      setName(productLineData.name || '');
      setProductTypeName(productLineData.productType.name || '');
      setProductTypeId(productLineData.productType.id);
    }

    
  }, [productLineData]);

  const resetForm = () => {
    setId(productLineData?.id);
    setName(productLineData?.name || '');
    setProductTypeName(productLineData?.productType.name || '');
    setProductTypeId(productLineData?.productType.id);
  };

  const handleCloseCreateModal = () => {
    setIsUpdateModalOpen(false);
    resetForm();
  };

  const handleUpdateProductType = async () => {
    const newProductLine = {
      id,
      name,
      productTypeId,
    };

    const res = await handleUpdateProductLineAction(newProductLine);
    if (res?.data) {
      handleCloseCreateModal();
      toast.success('Cập nhật dòng sản phẩm thành công');
      onMutate();
    } else {
      toast.error('Lỗi cập nhật dòng sản phẩm');
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
        backdrop={'static'}
        show={isUpdateModalOpen}
        onHide={handleCloseCreateModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Thông tin dòng sản phẩm</Modal.Title>
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
          <Button variant="danger" onClick={handleUpdateProductType}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UpdateProductLineModal;
