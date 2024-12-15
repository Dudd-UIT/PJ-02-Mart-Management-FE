'use client';
import { Modal, Button } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { Supplier } from '@/types/supplier';
import SelectedProductUnitTable from '../productUnitComponent/selectedProductUnit.table';
import { ProductUnit, ProductUnitTransform } from '@/types/productUnit';
import { handleUpdateSupplierAction } from '@/services/supplierServices';
import useSWR from 'swr';
import ProductSupplierModal from '../productSupplierComponent/productSupplier.list';
import { useSelectedProductUnits } from '@/context/selectedProductUnitsContext';
import { toast } from 'react-toastify';
import { fetchProductUnitByIds } from '@/services/productUnitServices';
import { Input } from '../commonComponent/InputForm';

const columns: Column<ProductUnitTransform>[] = [
  { title: 'ID', key: 'id' },
  { title: 'Tên sản phẩm', key: 'productSampleName' },
  { title: 'Đơn vị', key: 'unitName' },
  { title: 'Khối lượng', key: 'volumne' },
  { title: 'Tỷ lệ chuyển đổi', key: 'conversionRate' },
  { title: 'Giá bán', key: 'sellPrice' },
];

type FormData = {
  id: number;
  name: string;
  phone: string;
  address: string;
  country: string;
  productUnitIds: number[];
};

function UpdateSupplierModal(props: UpdateModalProps<Supplier>) {
  const {
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    data: supplierData,
    setData: setSupplierData,
    onMutate,
  } = props;
  const [isProductSupplierModalOpen, setIsProductSupplierModalOpen] =
    useState(false);

  const initalFormData = {
    id: 0,
    name: '',
    phone: '',
    address: '',
    country: '',
    productUnitIds: [],
  };

  const [formData, setFormData] = useState<FormData>(initalFormData);
  const { productUnitIds, setProductUnitIds } = useSelectedProductUnits();

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    if (supplierData) {
      setFormData({
        id: supplierData.id,
        name: supplierData.name || '',
        phone: supplierData.phone || '',
        address: supplierData.address || '',
        country: supplierData.country || '',
        productUnitIds: supplierData.supplierProducts || [],
      });
      setProductUnitIds(supplierData.supplierProducts || []);
    }
  }, [supplierData, setProductUnitIds]);

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSupplierData?.(undefined);
    setProductUnitIds([]);
  };

  const handleUpdateSupplier = async () => {
    const res = await handleUpdateSupplierAction(formData);
    if (res?.data) {
      handleCloseUpdateModal();
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

  const { data, error } = useSWR(
    [current, pageSize, productUnitIds.length],
    () => fetchProductUnitByIds(productUnitIds, current, pageSize),
  );
  if (error)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div>Failed to load suppliers: {error.message}</div>
      </div>
    );

  if (!data)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-grow" role="status" color=""></div>
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
        backdrop={'static'}
        show={isUpdateModalOpen}
        onHide={handleCloseUpdateModal}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Thông tin nhà cung cấp</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Thông tin nhà cung cấp */}
          <div className="container mb-4">
            <div className="row mb-3">
              <Input
                title="Tên nhà cung cấp"
                value={formData?.name || ''}
                size={6}
                onChange={(value) => handleFormDataChange('name', value)}
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
          {/* Button Cập nhật danh sách sản phẩm được cung cấp */}
          <div className="d-flex justify-content-end mx-3">
            <button
              className="btn d-flex align-items-center btn-primary"
              onClick={() => setIsProductSupplierModalOpen(true)}
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
          {/* Quản lý sản phẩm được cung cấp */}
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
          <Button variant="secondary" onClick={handleCloseUpdateModal}>
            Thoát
          </Button>
          <Button variant="danger" onClick={handleUpdateSupplier}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
      <ProductSupplierModal
        isProductSupplierModalOpen={isProductSupplierModalOpen}
        setIsProductSupplierModalOpen={setIsProductSupplierModalOpen}
        // selectedProductUnitIds={selectedProductUnitIds}
        // onSelectedProductUnitsChange={setSelectedProductUnitIds}
      />
    </>
  );
}

export default UpdateSupplierModal;
