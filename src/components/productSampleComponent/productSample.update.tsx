'use client';
import { Modal, Button } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { ProductUnit, ProductUnitTransform } from '@/types/productUnit';
import useSWR from 'swr';
import ProductSupplierModal from '../productSupplierComponent/productSupplier.list';
import { toast } from 'react-toastify';
import {
  ProductSample,
  ProductSampleTransform,
  ProductSampleUnit,
  ProductSampleUnitTransform,
} from '@/types/productSample';
import SelectedProductSampleUnitTableModal from './selectedProductSample.table';
import {
  fetchProductSampleUnits,
  handleUpdateProductSampleAction,
} from '@/services/productSampleServices';
import ProductSampleUnitModal from '../productSampleUnitComponent/productSampleUnit.add';
import { useSelectedProductUnits } from '@/context/selectedProductUnitsContext';
import { fetchProductLines } from '@/services/productLineServices';
import { fetchUnits } from '@/services/unitServices';

interface ProductLine {
  id: string;
  name: string;
}

interface Unit {
  id: string;
  name: string;
}


const columns: Column<ProductSampleUnitTransform>[] = [
  { title: 'ID', key: 'id' },
  { title: 'Đơn vị tính', key: 'unitName' },
  { title: 'Tỷ lệ chuyển đổi', key: 'conversion_rate' },
  { title: 'Giá nhập lô gần nhất', key: 'latest_inbound_price' },
  { title: 'Giá nhập trung bình', key: 'avg_inbound_price' },
  { title: 'Giá bán', key: 'sell_price' },
];

function UpdateProductSampleModal(
  props: UpdateModalProps<ProductSampleTransform>,
) {
  const {
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    data: productSampleData,
    onMutate,
  } = props;
  const [isProductSampleUnitsModalOpen, setIsProductSampleUnitsModalOpen] =
    useState(false);
  const [id, setId] = useState<number>();
  const [name, setName] = useState('');
  const [productLineName, setProductLineName] = useState('');
  const [productLineId, setProductLineId] = useState('');
  const [unitId, setUnitId] = useState('');
  const [unitName, setUnitName] = useState('');
  const [volumne, setVolumne] = useState('');
  const { productUnitIds, setProductUnitIds } = useSelectedProductUnits();

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);


  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/product-samples/find-all-units`;
  const { data, error } = useSWR(
    [url, current, pageSize, productUnitIds.length],
    () => fetchProductSampleUnits(url, current, pageSize, productUnitIds),
  );

  const urlProductLines = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/product-lines`;
  const { data: productLinesData } = useSWR(
    [urlProductLines, current, pageSize],
    () => fetchProductLines(urlProductLines, current, pageSize),
  );

  const urlUnits = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/units`;
  const { data: unitsData } = useSWR([urlUnits, current, pageSize], () =>
    fetchUnits(urlUnits, current, pageSize),
  );

  useEffect(() => {
    if (productSampleData) {
      setId(productSampleData.id);
      setName(productSampleData.name);
      setProductLineName(productSampleData.productLineName);
      setUnitName(productSampleData.unitName);
      setVolumne(productSampleData.volumne);
      setProductUnitIds(productSampleData.productSampleUnits || []);
    }
  }, [productSampleData, setProductUnitIds]);

  const resetForm = () => {
    setId(productSampleData?.id);
    setName(productSampleData?.name || '');
    setProductLineName(productSampleData?.productLineName || '');
    setUnitName(productSampleData?.unitName || '');
    setVolumne(productSampleData?.volumne || '');
  };

  const handleCloseCreateModal = () => {
    setIsUpdateModalOpen(false);
    resetForm();
  };

  const handleUpdateProductSample = async () => {
    const updatedProductSample = {
      name,
      productLineId: productLineId.toString(),
    };

    const updatedUnit = {
      volumne,
      unitId: parseInt(unitId),
    };

    console.log("updatedProductSample:::", updatedProductSample);

    console.log("data:::", data);

    // Gọi service để cập nhật
    const res = await handleUpdateProductSampleAction({
      id,
      updatedProductSample,
      updatedUnit
    });

    if (res?.data) {
      handleCloseCreateModal();
      toast.success("Cập nhật mẫu sản phẩm thành công");
      onMutate();
    } else {
      toast.error(res.message);
    }
  };

  if (error)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div>Failed to load product sample units: {error.message}</div>
      </div>
    );

  if (!data)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-grow" role="status" color=""></div>
        <span className="sr-only text-success">
          Loading... for fetch product sample units
        </span>
      </div>
    );
    
  const productSampleUnits: ProductSampleUnitTransform[] = Array.isArray(data?.results)
  ? data.results.flatMap((item: ProductSample) =>
      item.productUnits
        ? item.productUnits.map((productUnit) => ({
            id: productUnit.id,
            sell_price: productUnit.sell_price,
            conversion_rate: productUnit.conversion_rate,
            avg_inbound_price: productUnit.average_inbound_price ?? 0,
            latest_inbound_price: productUnit.latest_inbound_price?.toString() || "0",
            unitName: productUnit.unit?.name || "",
          }))
        : []
    )
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
        onHide={handleCloseCreateModal}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Thông tin mẫu sản phẩm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Thông tin nhà cung cấp */}
          <div className="container mb-4">
            <div className="row mb-3">
              <div className="col-md-6">
                <label>Tên mẫu sản phẩm</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label>Đơn vị tính nhỏ nhất</label>
                <select
                  className="form-control"
                  value={unitId}
                  onChange={(e) => setUnitId(e.target.value)}
                >
                  <option value="">{unitName}</option>
                  {unitsData?.results.map((unit: Unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-8">
                <label>Khối lượng/Dung tích</label>
                <input
                  type="text"
                  className="form-control"
                  value={volumne}
                  onChange={(e) => setVolumne(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label>Tên dòng sản phẩm</label>
                <select
                  className="form-control"
                  value={productLineId}
                  onChange={(e) => setProductLineId(e.target.value)}
                >
                  <option value="">{productLineName}</option>
                  {productLinesData?.results.map((line: ProductLine) => (
                    <option key={line.id} value={line.id}>
                      {line.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <h5>Danh sách đơn vị tính</h5>
          {/* Button Cập nhật danh sách đơn vị tính */}
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
          {/* Danh sách đơn vị tính */}
          {productSampleUnits.length > 0 && (
            <>
              <SelectedProductSampleUnitTableModal
                columns={columns}
                productSampleUnits={productSampleUnits}
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
          <Button variant="secondary" onClick={handleCloseCreateModal}>
            Thoát
          </Button>
          <Button variant="danger" onClick={handleUpdateProductSample}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
      <ProductSampleUnitModal
        isProductSampleUnitsModalOpen={isProductSampleUnitsModalOpen}
        setIsProductSampleUnitsModalOpen={setIsProductSampleUnitsModalOpen}
        onSelectedProductUnitsChange={setProductUnitIds}
        productSampleData={productSampleData}
        onMutate={() => {}}
      />
    </>
  );
}

export default UpdateProductSampleModal;
