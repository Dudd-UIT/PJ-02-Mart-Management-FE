'use client';
import { Modal, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  fetchProductSampleUnits,
  handleCreateProductSampleAction,
} from '@/services/productSampleServices';
import useSWR from 'swr';
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

function CreateProductSampleModal(props: CreateModalProps) {
  const { isCreateModalOpen, setIsCreateModalOpen, onMutate } = props;
  const [name, setName] = useState('');
  const [productLineId, setProductLineId] = useState('');
  const [volumne, setVolumne] = useState('');
  const [conversionRate, setConversionRate] = useState(1);
  const [unitId, setUnitId] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [description, setDescription] = useState('');
  const { productUnitIds, setProductUnitIds } = useSelectedProductUnits();

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const urlProductLines = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/product-lines`;
  const { data: productLinesData, error } = useSWR(
    [urlProductLines, current, pageSize],
    () => fetchProductLines(urlProductLines, current, pageSize),
  );

  const urlUnits = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/units`;
  const { data: unitsData } = useSWR([urlUnits, current, pageSize], () =>
    fetchUnits(urlUnits, current, pageSize),
  );

  const clearForm = () => {
    setName('');
    setProductLineId('');
    setVolumne('');
    setConversionRate(1);
    setUnitId('');
    setSellPrice('');
    setDescription('');
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    clearForm();
  };

  const handleCreateProductSample = async () => {
    const newProductSample = {
      name,
      productLineId: productLineId.toString(),
      description,
      unitIds: [unitId.toString()],
    };
  
    const unitDetails = {
      volumne,
      sell_price: parseFloat(sellPrice),
      conversion_rate: conversionRate,
      unitId: parseInt(unitId),
      image: '',
    };
  
    const res = await handleCreateProductSampleAction({
      productSample: newProductSample,
      unitDetails,
    });
    if (res?.data) {
      handleCloseCreateModal();
      clearForm();
      toast.success('Thêm mới mẫu sản phẩm thành công');
      onMutate();
    } else {
      toast.error(res.message);
    }
  };

  if (error)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div>Failed to load product lines: {error.message}</div>
      </div>
    );

  if (!productLinesData)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-grow" role="status" color=""></div>
        <span className="sr-only text-success">
          Loading... for fetch product lines
        </span>
      </div>
    );

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
          {/* Thông tin mẫu sản phẩm */}
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
                <label>Tên dòng sản phẩm</label>
                <select
                  className="form-control"
                  value={productLineId}
                  onChange={(e) => setProductLineId(e.target.value)}
                >
                  <option value="">Chọn dòng sản phẩm</option>
                  {productLinesData?.results.map((line: ProductLine) => (
                    <option key={line.id} value={line.id}>
                      {line.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-4">
                <label>Khối lượng/Dung tích</label>
                <input
                  type="text"
                  className="form-control"
                  value={volumne}
                  onChange={(e) => setVolumne(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label>Tỷ lệ</label>
                <input
                  type="text"
                  className="form-control"
                  value={conversionRate}
                />
              </div>
              <div className="col-md-4">
                <label>Đơn vị</label>
                <select
                  className="form-control"
                  value={unitId}
                  onChange={(e) => setUnitId(e.target.value)}
                >
                  <option value="">Chọn đơn vị</option>
                  {unitsData?.results.map((unit: Unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-4">
                <label>Giá bán</label>
                <input
                  type="text"
                  className="form-control"
                  value={sellPrice}
                  onChange={(e) => setSellPrice(e.target.value)}
                />
              </div>
              <div className="col-md-8">
                <label>Mô tả</label>
                <input
                  type="text"
                  className="form-control"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </div>
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
    </>
  );
}

export default CreateProductSampleModal;
