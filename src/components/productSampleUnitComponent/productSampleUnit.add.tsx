'use client';

import { useSelectedProductUnits } from '@/context/selectedProductUnitsContext';
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { sendRequest } from '@/utils/api';
import useSWR from 'swr';
import { Input } from '../commonComponent/InputForm';
import { ProductSampleUnitModalProps } from '@/types/unit';
import { fetchUnits } from '@/services/unitServices';
import { handleCreateProductUnitAction } from '@/services/productUnitServices';
import { toast } from 'react-toastify';


interface Unit {
  id: string;
  name: string;
}

function ProductSampleUnitModal(props: ProductSampleUnitModalProps) {
  const {
    isProductSampleUnitsModalOpen,
    setIsProductSampleUnitsModalOpen,
    onSelectedProductUnitsChange,
    productSampleData,
    onMutate
  } = props;

  const { productUnitIds, setProductUnitIds } = useSelectedProductUnits();
  const [unitId, setUnitId] = useState('');
  const [conversionRate, setConversionRate] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [inboundLatestPrice, setInboundLatestPrice] = useState('');
  const [inboundAvgPrice, setInboundAvgPrice] = useState('');
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/units`;
  const { data: unitsData, error } = useSWR([url, current, pageSize], () =>
    fetchUnits(url, current, pageSize),
  );

  if (error)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div>Failed to load suppliers: {error.message}</div>
      </div>
    );

  if (!unitsData)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-grow text-success" role="status"></div>
        <span className="sr-only text-success">Loading...</span>
      </div>
    );

    const clearForm = () => {
      setUnitId('');
      setConversionRate('');
      setSellPrice('');
      setInboundLatestPrice('');
      setInboundAvgPrice('');
    };

  const handleCloseProductUnitListModal = () => {
    setProductUnitIds([]);
    setIsProductSampleUnitsModalOpen(false);
    clearForm();
  };

  const handleSave = async () => {
    const newProductUnit = {
      unitId,
      productSampleId: productSampleData.id,
      sell_price: sellPrice,
      conversion_rate: conversionRate,
      // image: "new.jpg"
    }
    console.log("newProductUnit:::", newProductUnit);
    const res = await handleCreateProductUnitAction(newProductUnit)
    if (res?.data) {
      handleCloseProductUnitListModal();
      clearForm();
      toast.success('Thêm mới đơn vị tính cho mẫu sản phẩm thành công');
      onMutate();
    } else {
      toast.error(res.message);
    }
    onSelectedProductUnitsChange(productUnitIds);
    setIsProductSampleUnitsModalOpen(false);
  };

  return (
    <Modal
      backdrop="static"
      show={isProductSampleUnitsModalOpen}
      onHide={handleCloseProductUnitListModal}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Thông tin đơn vị tính</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Thông tin đơn vị tính */}
        <div className="container p-3">
          <div className="row g-3">
            {/* Cột ảnh sản phẩm */}
            <div className="col-md-4 d-flex align-items-center justify-content-center">
              <div
                className="border rounded bg-light d-flex align-items-center justify-content-center"
                style={{ width: '100%', height: '200px' }}
              >
                <span className="text-muted">Ảnh sản phẩm</span>
              </div>
            </div>

            {/* Cột thông tin đơn vị tính */}
            <div className="col-md-8">
              <div className="mb-3">
                <label className="form-label">Đơn vị tính</label>
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
              <div className="mb-3">
                <label className="form-label">Tỷ lệ quy đổi</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder=""
                  value={conversionRate}
                  onChange={(e) => setConversionRate(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Giá bán</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder=""
                  value={sellPrice}
                  onChange={(e) => setSellPrice(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">
                  Giá nhập trên 1 đơn vị trong lô hàng gần nhất
                </label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="" 
                  value={inboundLatestPrice}
                  onChange={(e) => setInboundLatestPrice(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label">
                  Giá nhập trên 1 đơn vị, tính trung bình các lô hàng
                </label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="" 
                  value={inboundAvgPrice}
                  onChange={(e) => setInboundAvgPrice(e.target.value)} />
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleCloseProductUnitListModal}>
          Thoát
        </Button>
        <Button className="btn-primary" onClick={handleSave}>
          Lưu
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ProductSampleUnitModal;
