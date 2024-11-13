'use client';
import { Modal, Button } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import { useState } from 'react';
import { handleCreateSupplierAction } from '@/services/supplierServices';
import ProductSupplierModal from '../productSupplierComponent/productSupplier.list';
import SelectedProductUnitTable from '../productUnitComponent/selectedProductUnit.table';
import { ProductUnit, ProductUnitTransform } from '@/types/productUnit';
import { sendRequest } from '@/utils/api';
import useSWR from 'swr';
import { toast } from 'react-toastify';
import { useSelectedProductUnits } from '@/context/selectedProductUnitsContext';
import { fetchProductUnitByIds } from '@/services/productUnitServices';

const columns: Column<ProductUnitTransform>[] = [
  { title: 'ID', key: 'id' },
  { title: 'Tên sản phẩm', key: 'productSampleName' },
  { title: 'Đơn vị', key: 'unitName' },
  { title: 'Khối lượng', key: 'volumne' },
  { title: 'Tỷ lệ chuyển đổi', key: 'conversion_rate' },
  { title: 'Giá bán', key: 'sell_price' },
];

function CreateSupplierModal(props: CreateModalProps) {
  const { isCreateModalOpen, setIsCreateModalOpen, onMutate } = props;
  const [isProductSupplierModalOpen, setIsProductSupplierModalOpen] =
    useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [country, setCountry] = useState('');
  const [selectedProductUnitIds, setSelectedProductUnitIds] = useState<
    number[]
  >([]);
  const { productUnitIds, setProductUnitIds } = useSelectedProductUnits();
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const clearForm = () => {
    setName('');
    setPhone('');
    setAddress('');
    setCountry('');
    setSelectedProductUnitIds([]);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    clearForm();
    setProductUnitIds([]);
  };

  const handleCreateSupplier = async () => {
    const newSupplier = {
      name,
      phone,
      address,
      country,
      productUnitIds: selectedProductUnitIds,
    };

    const res = await handleCreateSupplierAction(newSupplier);
    if (res?.data) {
      handleCloseCreateModal();
      clearForm();
      setProductUnitIds([]);
      toast.success(res.message);
      onMutate();
    } else {
      toast.error(res.message);
    }
  };

  const { data, error } = useSWR(
    [current, pageSize, selectedProductUnitIds.length],
    () => fetchProductUnitByIds(selectedProductUnitIds, current, pageSize),
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
        <div className="spinner-grow text-success" role="status"></div>
        <span className="sr-only text-success">Loading...</span>
      </div>
    );

  const productUnits = Array.isArray(data?.results)
    ? data.results.map((item: ProductUnit) => ({
        id: item.id,
        sell_price: item.sell_price,
        conversion_rate: item.conversion_rate,
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
              <div className="col-md-6">
                <label>Tên nhà cung cấp</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label>Số điện thoại</label>
                <input
                  type="text"
                  className="form-control"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-8">
                <label>Địa chỉ</label>
                <input
                  type="text"
                  className="form-control"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label>Quốc gia</label>
                <input
                  type="text"
                  className="form-control"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
            </div>
          </div>
          <h5>Danh sách mặt hàng được cung cấp</h5>
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
          {/* Danh sách các sản phẩm được chọn */}
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
        onSelectedProductUnitsChange={setSelectedProductUnitIds}
      />
    </>
  );
}

export default CreateSupplierModal;
