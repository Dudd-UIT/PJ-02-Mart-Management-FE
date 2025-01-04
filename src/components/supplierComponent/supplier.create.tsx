'use client';
import { Modal, Button } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import { useState } from 'react';
import { handleCreateSupplierAction } from '@/services/supplierServices';
import ProductSupplierModal from '../productSupplierComponent/productSupplier.list';
import SelectedProductUnitTable from '../productUnitComponent/selectedProductUnit.table';
import { ProductUnit, ProductUnitTransform } from '@/types/productUnit';
import useSWR from 'swr';
import { toast } from 'react-toastify';
import { useSelectedProductUnits } from '@/context/selectedProductUnitsContext';
import { fetchProductUnitByIds } from '@/services/productUnitServices';
import { Input } from '../commonComponent/InputForm';

const columns: Column<ProductUnitTransform>[] = [
  { title: 'ID', key: 'id' },
  { title: 'Tên sản phẩm', key: 'productSampleName' },
  { title: 'Đơn vị', key: 'unitName' },
  { title: 'Khối lượng', key: 'volumne' },
  { title: 'Tỷ lệ chuyển đổi', key: 'conversionRate' },
];

type FormData = {
  name: string;
  phone: string;
  email: string;
  address: string;
  country: string;
  productUnitIds: number[];
};

function CreateSupplierModal(props: CreateModalProps) {
  const { isCreateModalOpen, setIsCreateModalOpen, onMutate } = props;
  const [isProductSupplierModalOpen, setIsProductSupplierModalOpen] =
    useState(false);

  const initalFormData = {
    name: '',
    email: '',
    phone: '',
    address: '',
    country: '',
    productUnitIds: [],
  };

  const [formData, setFormData] = useState<FormData>(initalFormData);

  const { productUnitIds, setProductUnitIds } = useSelectedProductUnits();
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setFormData(initalFormData);
    setProductUnitIds([]);
  };

  const handleCreateSupplier = async () => {
    const res = await handleCreateSupplierAction(formData);
    if (res?.data) {
      handleCloseCreateModal();
      setFormData(initalFormData);
      setProductUnitIds([]);
      toast.success(res.message);
      onMutate();
    } else {
      toast.error(res.message);
    }
  };

  const handleFormDataChange = (
    field: keyof typeof formData,
    value: number[] | string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/product-units/find-by-ids`;
  const { data, error } = useSWR(
    [url, current, pageSize, formData.productUnitIds],
    () => fetchProductUnitByIds(formData.productUnitIds, current, pageSize),
  );

  if (error)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div>: {error.message}</div>
      </div>
    );

  if (!data)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-grow text-success" role="status"></div>
        <span className="sr-only text-success">Loading...</span>
      </div>
    );

  const productUnits = Array.isArray(data?.results)
    ? data.results.map((item: ProductUnit) => ({
        id: item.id,
        sellPrice: item.sellPrice,
        conversionRate: item.conversionRate,
        createdAt: item.createdAt,
        volumne: item.volumne,
        productSampleName: item.productSample?.name,
        unitName: item.unit?.name,
      }))
    : [];

  const meta: MetaData = {
    current,
    pageSize,
    pages: data.meta.pages,
    total: data.meta.total,
  };

  const handlePreviousPage = () => {
    if (current > 1) setCurrent(current - 1);
  };

  const handleNextPage = () => {
    if (current < meta.pages) setCurrent(current + 1);
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
          <Modal.Title>Thêm mới nhà cung cấp</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Thông tin nhà cung cấp */}
          <div className="container mb-4">
            <div className="row mb-3">
              <Input
                title="Tên nhà cung cấp"
                value={formData?.name || ''}
                size={12}
                onChange={(value) => handleFormDataChange('name', value)}
              />
            </div>
            <div className="row mb-3">
              <Input
                title="Email"
                value={formData?.email || ''}
                size={6}
                onChange={(value) => handleFormDataChange('email', value)}
              />
              <Input
                title="Số điện thoại"
                value={formData?.phone || ''}
                size={6}
                onChange={(value) => handleFormDataChange('phone', value)}
              />
            </div>
            <div className="row mb-3">
              <Input
                title="Địa chỉ"
                value={formData?.address || ''}
                size={8}
                onChange={(value) => handleFormDataChange('address', value)}
              />
              <Input
                title="Quốc gia"
                value={formData?.country || ''}
                size={4}
                onChange={(value) => handleFormDataChange('country', value)}
              />
            </div>
          </div>
          <h5>Quản lý mặt hàng được cung cấp</h5>
          {/* Button thêm */}
          <div className="d-flex justify-content-end mx-3">
            <button
              className="btn d-flex align-items-center btn-primary"
              onClick={() => setIsProductSupplierModalOpen(true)}
            >
              <FaPlus className="align-middle" />
              <text>Thêm</text>
            </button>
          </div>
          {/* Quản lý các sản phẩm được chọn */}
          {productUnits.length > 0 && (
            <>
              <SelectedProductUnitTable
                columns={columns}
                productUnits={productUnits}
              />
              {/* Navigate control */}
              <nav aria-label="Page navigation example" className="mt-3">
                <ul className="pagination justify-content-center">
                  <li
                    className={`page-item ${current === 1 ? 'disabled' : ''}`}
                  >
                    <button className="page-link" onClick={handlePreviousPage}>
                      Previous
                    </button>
                  </li>
                  {Array.from({ length: meta.pages }, (_, index) => (
                    <li
                      key={index}
                      className={`page-item ${
                        current === index + 1 ? 'active' : ''
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrent(index + 1)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                  <li
                    className={`page-item ${
                      current === meta.pages ? 'disabled' : ''
                    }`}
                  >
                    <button className="page-link" onClick={handleNextPage}>
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleCloseCreateModal}>
            Thoát
          </Button>
          <Button className="btn-primary" onClick={handleCreateSupplier}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Modal thêm sản phẩm được cung cấp */}
      <ProductSupplierModal
        isProductSupplierModalOpen={isProductSupplierModalOpen}
        setIsProductSupplierModalOpen={setIsProductSupplierModalOpen}
        onSelectedProductUnitsChange={(value) =>
          handleFormDataChange('productUnitIds', value)
        }
      />
    </>
  );
}

export default CreateSupplierModal;
