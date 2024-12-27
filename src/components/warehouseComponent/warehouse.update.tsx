'use client';
import { Modal, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { ProductUnit, ProductUnitTransform } from '@/types/productUnit';
import useSWR from 'swr';
import { useSelectedProductUnits } from '@/context/selectedProductUnitsContext';
import { toast } from 'react-toastify';
import { fetchProductUnitByIds } from '@/services/productUnitServices';
import { Input } from '../commonComponent/InputForm';
import { BatchGrouped } from '@/types/batch';
import { handleUpdateWarehouseAction } from '@/services/batchServices';

type FormData = {
  id: number;
  inboundPrice: number;
  // sellPrice: number;
  discount: number;
  inventQuantity: number;
  inboundQuantity: number;
  expiredAt: string;
  inboundReceiptId: number;
  // unit: string;
  // productSample: string;
};

const imgURL =
  'https://bizweb.dktcdn.net/thumb/1024x1024/100/459/016/products/16172903911888-1.jpg?v=1722161429533';

const altImg = '/images/warehousePH.png';

function UpdateWarehouseModal(props: UpdateModalProps<BatchGrouped>) {
  const {
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    data: warehouseData,
    setData: setWarehouseData,
    onMutate,
  } = props;

  const initalFormData = {
    id: 0,
    inboundPrice: 0,
    // sellPrice: 0,
    discount: 0,
    inventQuantity: 0,
    inboundQuantity: 0,
    expiredAt: '',
    inboundReceiptId: 0,
    // unit: '',
    // productSample: '',
  };

  const [formData, setFormData] = useState<FormData>(initalFormData);
  const { productUnitIds, setProductUnitIds } = useSelectedProductUnits();

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  // console.log(warehouseData);

  useEffect(() => {
    if (warehouseData) {
      setFormData({
        id: warehouseData.id,
        inboundPrice: warehouseData.inboundPrice,
        // sellPrice: warehouseData.sellPrice,
        discount: warehouseData.discount,
        inventQuantity: warehouseData.inventQuantity,
        inboundQuantity: warehouseData.inboundQuantity,
        expiredAt: warehouseData.expiredAt,
        inboundReceiptId: warehouseData.inboundReceiptId,
        // unit: warehouseData.unit,
        // productSample: warehouseData.productSample,
      });
    }
  }, [warehouseData]);

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setWarehouseData?.(undefined);
  };

  const handleUpdateWarehouse = async () => {
    const res = await handleUpdateWarehouseAction(formData);
    if (res?.data) {
      handleCloseUpdateModal();
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

  const { data, error } = useSWR(
    [current, pageSize, productUnitIds.length],
    () => fetchProductUnitByIds(productUnitIds, current, pageSize),
  );
  if (error)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div>Failed to load Warehouses: {error.message}</div>
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

  function convertISOString(dateString : string) {
    const date = new Date(dateString);
    return date.toISOString();
}
  // console.log('formdata', formData);

  return (
    <>
      <Modal
        backdrop={'static'}
        show={isUpdateModalOpen}
        onHide={handleCloseUpdateModal}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Thông tin lô hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Thông tin nhà cung cấp */}
          <div className="container mb-4">
            <div className="row">
              <div className="col col-md-4 pt-2">
                <img
                  className="img-fluid img-thumbnail"
                  src={imgURL ? imgURL : altImg}
                  alt="..."
                />
              </div>
              <div className="col col-md-8">
                <div className="row mb-3">
                  <Input
                    title="Mẫu sản phẩm"
                    value={props.data?.productSample|| ''}
                    size={12}
                    // onChange={(value) =>
                    //   handleFormDataChange('productSample', value)
                    // }
                    readOnly={true}
                  />
                </div>
                <div className="row mb-3">
                  <Input
                    title="Nhà cung cấp"
                    value={''}
                    size={12}
                    // onChange={(value) => handleFormDataChange('', value)}
                  />
                </div>
                <div className="row mb-3">
                  <Input
                    title="Số lượng tồn"
                    value={formData?.inventQuantity || 0}
                    size={6}
                    onChange={(value) =>
                      handleFormDataChange('inventQuantity', value)
                    }
                  />
                  <Input
                    title="Số lượng nhập"
                    value={formData?.inboundQuantity || 0}
                    size={6}
                    onChange={(value) =>
                      handleFormDataChange('inboundQuantity', value)
                    }
                  />
                </div>
              </div>
            </div>

            <div className="row mb-3">
              <Input
                title="Giá nhập"
                value={formData?.inboundPrice || ''}
                size={6}
                onChange={(value) =>
                  handleFormDataChange('inboundPrice', value)
                }
              />
              <Input
                title="Ngày nhập"
                value={''}
                size={6}
                type="date"
              />
            </div>

            <div className="row mb-3">
              <Input
                title="Giảm giá"
                value={formData?.discount || 0}
                size={4}
                onChange={(value) => handleFormDataChange('discount', value)}
              />
              <Input
                title="Đơn vị tính"
                value={props.data?.unit || ''}
                size={2}
                readOnly={true}
                // onChange={(value) => handleFormDataChange('unit', value)}
              />
              <Input
                title="Hạn sử dụng"
                value={formData?.expiredAt.split('T')[0] || ''}
                size={6}
                type="date"
                onChange={(value) =>
                  handleFormDataChange('expiredAt', convertISOString(value))
                }
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseUpdateModal}>
            Thoát
          </Button>
          <Button variant="danger" onClick={handleUpdateWarehouse}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UpdateWarehouseModal;
