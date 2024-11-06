'use client';
import { Modal, Button } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import { useState } from 'react';
import { handleCreateSupplierAction } from '@/services/supplierServices';
import ProductSupplierModal from '../productSupplierComponent/productSupplier.list';
import SelectedProductUnitTableModal from '../productUnitComponent/selectedProductUnit.table';
import { ProductUnit, ProductUnitTransform } from '@/types/productUnit';
import { sendRequest } from '@/utils/api';
import useSWR from 'swr';
import { toast } from 'react-toastify';
import { useSelectedProductUnits } from '@/context/selectedProductUnitsContext';
import { handleCreaterProductTypeAction } from '@/services/productTypeServices';

const columns: Column<ProductUnitTransform>[] = [
  { title: 'ID', key: 'id' },
  { title: 'Tên sản phẩm', key: 'productSampleName' },
  { title: 'Đơn vị', key: 'unitName' },
  { title: 'Khối lượng', key: 'volumne' },
  { title: 'Tỷ lệ chuyển đổi', key: 'conversion_rate' },
  { title: 'Giá bán', key: 'sell_price' },
];

const fetchProductUnits = async (
  url: string,
  current: number,
  pageSize: number,
  ids?: number[],
) => {
  const queryParams: { [key: string]: any } = {
    current,
    pageSize,
  };

  try {
    const res = await sendRequest<IBackendRes<any>>({
      url,
      method: 'POST',
      queryParams,
      body: { ids },
      nextOption: {
        next: { tags: ['list-productUnits'] },
      },
    });

    if (res?.data) {
      return res.data;
    } else {
      throw new Error("Data format error: 'data' field is missing.");
    }
  } catch (error) {
    console.error('Fetch productSamples failed:', error);
    throw error;
  }
};

function CreateProductTypeModal(props: CreateModalProps) {
  const { isCreateModalOpen, setIsCreateModalOpen, onMutate } = props;
  const [name, setName] = useState('');

  const clearForm = () => {
    setName('');
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    clearForm();
  };

  const handleCreateProductType = async () => {
    const newProductType = {
        name,
      };

    const res = await handleCreaterProductTypeAction(newProductType);
    if (res?.data) {
      handleCloseCreateModal();
      clearForm();
      toast.success('Thêm mới loại sản phẩm thành công');
      onMutate();
    } else {
      toast.error('Lỗi khi thêm mới loại sản phẩm');
    }
  };

  return (
    <>
      <Modal
        show={isCreateModalOpen}
        onHide={handleCloseCreateModal}
        size="lg"
        backdrop={'static'}
      >
        <Modal.Header closeButton>
          <Modal.Title>Thêm mới loại sản phẩm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Thông tin loại sản phẩm */}
          <div className="container mb-4 px-4">
              <label>Tên loại sản phẩm</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCreateModal}>
            Thoát
          </Button>
          <Button variant="danger" onClick={handleCreateProductType}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CreateProductTypeModal;
