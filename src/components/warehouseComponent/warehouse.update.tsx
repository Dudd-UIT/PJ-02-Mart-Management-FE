'use client';
import { Modal, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Input } from '../commonComponent/InputForm';
import { BatchGrouped } from '@/types/batch';
import { handleUpdateWarehouseAction } from '@/services/batchServices';
import Image from 'next/image';

type FormData = {
  id: number;
  discount: number;
};

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
    discount: 0,
  };

  console.log('warehouseData', warehouseData);
  const [formData, setFormData] = useState<FormData>(initalFormData);

  useEffect(() => {
    if (warehouseData) {
      setFormData({
        id: warehouseData.id,
        discount: warehouseData.discount,
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
                <Image
                  className="img-fluid img-thumbnail"
                  src={
                    typeof warehouseData?.image === 'string'
                      ? warehouseData.image
                      : altImg
                  }
                  alt="Warehouse"
                  width={200}
                  height={200}
                />
              </div>
              <div className="col col-md-8">
                <div className="row mb-3">
                  <Input
                    title="Mẫu sản phẩm"
                    value={props.data?.productSample || ''}
                    size={12}
                    readOnly={true}
                  />
                </div>
                <div className="row mb-3">
                  <Input
                    title="Nhà cung cấp"
                    value={props.data?.supplierName || ''}
                    size={12}
                    readOnly={true}
                  />
                </div>
                <div className="row mb-3">
                  <Input
                    title="Số lượng tồn"
                    value={props.data?.inventQuantity || 0}
                    size={6}
                    readOnly={true}
                  />
                  <Input
                    title="Số lượng nhập"
                    value={props.data?.inboundQuantity || 0}
                    size={6}
                    readOnly={true}
                  />
                </div>
              </div>
            </div>

            <div className="row mb-3">
              <Input
                title="Ngày nhập"
                value={props.data?.createdAt.split('T')[0] || ''}
                size={6}
                type="date"
                readOnly={true}
              />
              <Input
                title="Hạn sử dụng"
                value={props.data?.expiredAt.split('T')[0] || ''}
                size={6}
                type="date"
                readOnly={true}
              />
            </div>

            <div className="row mb-3">
              <Input
                title="Đơn vị tính"
                value={props.data?.unit || ''}
                size={2}
                readOnly={true}
              />
              <Input
                title="Giá nhập"
                value={props.data?.inboundPrice || ''}
                size={6}
                readOnly={true}
              />
              <Input
                title="Giảm giá"
                value={formData?.discount || 0}
                size={4}
                type="number"
                onChange={(value) =>
                  handleFormDataChange('discount', parseFloat(value))
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
