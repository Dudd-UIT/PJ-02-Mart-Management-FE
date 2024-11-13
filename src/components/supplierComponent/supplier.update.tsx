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

const columns: Column<ProductUnitTransform>[] = [
  { title: 'ID', key: 'id' },
  { title: 'Tên sản phẩm', key: 'productSampleName' },
  { title: 'Đơn vị', key: 'unitName' },
  { title: 'Khối lượng', key: 'volumne' },
  { title: 'Tỷ lệ chuyển đổi', key: 'conversion_rate' },
  { title: 'Giá bán', key: 'sell_price' },
];

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
  const [id, setId] = useState<number>();
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

  useEffect(() => {
    if (supplierData) {
      setId(supplierData.id);
      setName(supplierData.name || '');
      setPhone(supplierData.phone || '');
      setAddress(supplierData.address || '');
      setCountry(supplierData.country || '');
      setSelectedProductUnitIds(supplierData.supplierProducts || []);
      setProductUnitIds(supplierData.supplierProducts || []);
    }
  }, [supplierData, setProductUnitIds]);

  const resetForm = () => {
    setId(supplierData?.id);
    setName(supplierData?.name || '');
    setPhone(supplierData?.phone || '');
    setAddress(supplierData?.address || '');
    setCountry(supplierData?.country || '');
    setSelectedProductUnitIds([]);
    setProductUnitIds([]);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSupplierData?.(undefined);
    resetForm();
  };

  const handleUpdateSupplier = async () => {
    const newSupplier = {
      id,
      name,
      phone,
      address,
      country,
      productUnitIds,
    };

    const res = await handleUpdateSupplierAction(newSupplier);
    if (res?.data) {
      handleCloseUpdateModal();
      setProductUnitIds([]);
      toast.success(res.message);
      onMutate();
    } else {
      toast.error(res.message);
    }
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
          {/* Danh sách sản phẩm được cung cấp */}
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
