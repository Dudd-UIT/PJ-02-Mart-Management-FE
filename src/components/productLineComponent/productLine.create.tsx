'use client';
import { Modal, Button } from 'react-bootstrap';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { fetchProductTypes } from '@/services/productTypeServices';
import { handleCreaterProductLineAction } from '@/services/productLineServices';
import useSWR from 'swr';
import { Input } from '../commonComponent/InputForm';

type FormData = {
  name: string;
  productTypeId: number;
};

function CreateProductLineModal(props: CreateModalProps) {
  const { isCreateModalOpen, setIsCreateModalOpen, onMutate } = props;
  const initalFormData = {
    id: 0,
    name: '',
    productTypeId: 0,
  };

  const [formData, setFormData] = useState<FormData>(initalFormData);

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/product-types`;

  const { data: productTypes, error } = useSWR([url], () =>
    fetchProductTypes(),
  );

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setFormData(initalFormData);
  };

  const handleCreateProductLine = async () => {
    const res = await handleCreaterProductLineAction(formData);
    if (res?.data) {
      handleCloseCreateModal();
      toast.success(res.message);
      onMutate();
    } else {
      toast.error(res.message);
    }
  };

  const handleFormDataChange = (
    field: keyof typeof formData,
    value: number | string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
          <div className="container mb-4">
            <div className="row mb-3">
              <Input
                size={12}
                title="Tên dòng sản phẩm"
                value={formData?.name || ''}
                onChange={(value) => handleFormDataChange('name', value)}
              />
              <Input
                title="Tên loại sản phẩm"
                size={12}
                value={formData.productTypeId}
                placeholder="Chọn tên loại sản phẩm"
                options={productTypes?.results}
                keyObj="id"
                showObj="name"
                onSelectedChange={(value) =>
                  handleFormDataChange('productTypeId', value)
                }
              />
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
