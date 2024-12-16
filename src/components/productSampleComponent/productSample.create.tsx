'use client';
import { Modal, Button } from 'react-bootstrap';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { handleCreateProductSampleAction } from '@/services/productSampleServices';
import useSWR from 'swr';
import { fetchProductLines } from '@/services/productLineServices';
import { fetchUnits } from '@/services/unitServices';
import { Input } from '../commonComponent/InputForm';
import { FaPlus } from 'react-icons/fa6';
import SelectedProductSampleUnitTable from './selectedProductSample.table';
import { ProductUnitTransform } from '@/types/productUnit';
import ProductSampleUnitModal from '../productSampleUnitComponent/productSampleUnit.add';

const columns: Column<ProductUnitTransform>[] = [
  { title: 'Đơn vị tính', key: 'unitName' },
  { title: 'Tỷ lệ chuyển đổi', key: 'conversionRate' },
  { title: 'Giá bán', key: 'sellPrice' },
  { title: 'Khối lượng', key: 'volumne' },
];

type FormData = {
  name: string;
  productLineId: number;
  description: string;
};

function CreateProductSampleModal(props: CreateModalProps) {
  const { isCreateModalOpen, setIsCreateModalOpen, onMutate } = props;

  const [isProductSampleUnitsModalOpen, setIsProductSampleUnitsModalOpen] =
    useState(false);

  const initalFormData = {
    name: '',
    productLineId: 0,
    description: '',
  };
  const [formData, setFormData] = useState<FormData>(initalFormData);
  const [productUnits, setProductUnits] = useState<ProductUnitTransform[]>([]);

  const urlProductLines = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/product-lines`;
  const { data: productLinesData, error } = useSWR([urlProductLines], () =>
    fetchProductLines(),
  );

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setFormData(initalFormData);
  };

  const handleFormDataChange = (
    field: keyof typeof formData,
    value: number[] | string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDeleteUnit = (productUnitId: number) => {
    const newProductunits = productUnits?.filter(
      (productUnit) => productUnit.id !== productUnitId,
    );
    setProductUnits(newProductunits);
    toast.info(`Đơn vị tính ${productUnitId} đã được xóa`);
  };

  const handleAddUnit = (newUnit: ProductUnitTransform) => {
    if (productUnits) {
      const newProdudctUnits = [...productUnits, newUnit];
      setProductUnits(newProdudctUnits);
    }
  };

  const handleCreateProductSample = async () => {
    const productUnitsDto = productUnits.map?.((productUnit) => ({
      volumne: productUnit.volumne,
      sellPrice: productUnit.sellPrice,
      conversionRate: productUnit.conversionRate,
      image: productUnit.image,
      productSampleId: 0,
      unitId: productUnit.unitId,
    }));
    const payload = { productSampleDto: formData, productUnitsDto };

    const res = await handleCreateProductSampleAction(payload);

    if (res?.data) {
      handleCloseCreateModal();
      toast.success(res.message);
      onMutate();
    } else {
      toast.error(res.message);
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
          <Modal.Title>Thêm mới mẫu sản phẩm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container mb-4">
            <div className="row mb-3">
              <Input
                title="Tên mẫu sản phẩm"
                size={6}
                value={formData.name}
                onChange={(value) => handleFormDataChange('name', value)}
              />
              <Input
                title="Tên dòng sản phẩm"
                size={6}
                value={formData.productLineId}
                keyObj="id"
                showObj="name"
                placeholder="Chọn dòng sản phẩm"
                options={productLinesData?.results}
                onSelectedChange={(value) =>
                  handleFormDataChange('productLineId', value)
                }
              />
            </div>
            <div className="row mb-3">
              <Input
                title="Mô tả"
                size={12}
                value={formData.description}
                onChange={(value) => handleFormDataChange('description', value)}
              />
            </div>
          </div>

          <h5>Danh sách đơn vị tính</h5>
          <div className="d-flex justify-content-end mx-3">
            <button
              className="btn d-flex align-items-center btn-primary"
              onClick={() => setIsProductSampleUnitsModalOpen(true)}
            >
              <FaPlus className="align-middle" />
              <span
                className="ms-1"
                style={{ position: 'relative', top: '2px' }}
              >
                Thêm
              </span>
            </button>
          </div>

          <SelectedProductSampleUnitTable
            columns={columns}
            productSampleUnits={productUnits}
            onDeleteUnit={handleDeleteUnit}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCreateModal}>
            Thoát
          </Button>
          <Button variant="danger" onClick={handleCreateProductSample}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
      <ProductSampleUnitModal
        isProductSampleUnitsModalOpen={isProductSampleUnitsModalOpen}
        setIsProductSampleUnitsModalOpen={setIsProductSampleUnitsModalOpen}
        onAddUnit={handleAddUnit}
      />
    </>
  );
}

export default CreateProductSampleModal;
