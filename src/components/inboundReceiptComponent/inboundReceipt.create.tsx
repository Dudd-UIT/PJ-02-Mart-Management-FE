'use client';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { toast } from 'react-toastify';
import ProductSupplierModal from '../productSupplierComponent/productSupplier.list';
import { ProductUnit } from '@/types/productUnit';
import { HiOutlineTrash } from 'react-icons/hi2';
import { InboundReceiptCreate } from '@/types/batch';
import { Input } from '../commonComponent/InputForm';
import { fetchSuppliers } from '@/services/supplierServices';
import { useSelectedProductUnits } from '@/context/selectedProductUnitsContext';
import { handleCreatedInboundReceiptAction } from '@/services/inboundReceiptServices';
import { fetchProductUnitByIds } from '@/services/productUnitServices';

type FormDataBatch = {
  inbound_price: number;
  discount: number;
  invent_quantity: number;
  inbound_quantity: number;
  expiredAt: string;
  productUnitId: number;
  productSampleName: string;
  unitName: string;
  total: number;
};

type FormDataInboundReceipt = {
  staffId: number;
  supplierId: number;
  totalPrice: number;
  isReceived: number;
  isPaid: number;
  discount: number;
  vat: number;
  createdAt: string;
  paymentTotal: number;
};

const columns: Column<InboundReceiptCreate>[] = [
  { title: '#', key: 'id' },
  { title: 'Tên sản phẩm', key: 'productSampleName' },
  { title: 'Đơn vị', key: 'unitName' },
  { title: 'Số lượng nhập', key: 'inbound_quantity' },
  { title: 'Giá nhập', key: 'inbound_price' },
  { title: 'Tổng lô hàng', key: 'totalPriceBatch' },
  { title: 'Ngày hết hạn', key: 'expiredAt' },
];

function CreateInboundReceiptModal(props: CreateModalProps) {
  const { isCreateModalOpen, setIsCreateModalOpen, onMutate } = props;
  const [isProductSupplierModalOpen, setIsProductSupplierModalOpen] =
    useState(false);

  const initialInboundReceipt = {
    createdAt: '',
    totalPrice: 0,
    discount: 0,
    vat: 0,
    paymentTotal: 0,
    staffId: 0,
    supplierId: 0,
    isReceived: 0,
    isPaid: 0,
  };
  const [formBatchData, setFormBatchData] = useState<FormDataBatch[]>([]);
  const [inboundReceiptInfo, setInboundReceiptInfo] =
    useState<FormDataInboundReceipt>(initialInboundReceipt);

  const { productUnitIds, setProductUnitIds } = useSelectedProductUnits();
  const [selectedProductUnitIds, setSelectedProductUnitIds] = useState<
    number[]
  >([]);

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/suppliers`;
  const { data: suppliers, error } = useSWR([url], () => fetchSuppliers());
  console.log('suppliers', suppliers);

  useEffect(() => {
    if (selectedProductUnitIds.length > 0) {
      fetchProductUnitByIds(selectedProductUnitIds).then(
        (selectedProductUnitId) => {
          const updatedFormBatchData = selectedProductUnitId?.results.map(
            (productUnit: ProductUnit) => ({
              inbound_price: 0,
              discount: 0,
              invent_quantity: 0,
              inbound_quantity: 0,
              expiredAt: '',
              productUnitId: productUnit?.id,
              productSampleName: productUnit.productSample?.name || '',
              unitName: productUnit.unit?.name || '',
              total: 0,
            }),
          );
          setFormBatchData(updatedFormBatchData);
        },
      );
    }
  }, [selectedProductUnitIds]);

  useEffect(() => {
    // Calculate the total price and update the order info
    const totalPrice = formBatchData.reduce((acc, item) => acc + item.total, 0);
    setInboundReceiptInfo((prev) => ({
      ...prev,
      totalPrice: totalPrice,
      paymentTotal: totalPrice - prev.discount + prev.vat,
    }));
  }, [formBatchData, inboundReceiptInfo.discount, inboundReceiptInfo.vat]);

  const handleBatchInfoChange = (
    index: number,
    field: keyof FormDataBatch,
    value: number | string,
  ) => {
    const updatedFormBatchData = formBatchData.map((item, i) =>
      i === index
        ? {
            ...item,
            [field]: value,
            total:
              field === 'inbound_price' || field === 'inbound_quantity'
                ? (field === 'inbound_price'
                    ? (value as number)
                    : item.inbound_price) *
                  (field === 'inbound_quantity'
                    ? (value as number)
                    : item.inbound_quantity)
                : item.total,
          }
        : item,
    );
    setFormBatchData(updatedFormBatchData);
  };

  const handleInboundReceiptInfoChange = (
    field: keyof typeof inboundReceiptInfo,
    value: number | string,
  ) => {
    setInboundReceiptInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSupplierChange = (value: number) => {
    handleInboundReceiptInfoChange('supplierId', value);
  };

  const handleDeleteRow = (index: number) => {
    setFormBatchData(formBatchData.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const inboundReceiptDto = {
      staffId: inboundReceiptInfo.staffId,
      supplierId: inboundReceiptInfo.supplierId,
      totalPrice: inboundReceiptInfo.totalPrice,
      isReceived: 0,
      isPaid: 0,
      discount: inboundReceiptInfo.discount,
      vat: inboundReceiptInfo.vat,
      createdAt: inboundReceiptInfo.createdAt,
    };

    const batchsDto = formBatchData.map((item) => ({
      inbound_price: item.inbound_price,
      discount: item.discount,
      invent_quantity: item.inbound_quantity,
      inbound_quantity: item.inbound_quantity,
      expiredAt: item.expiredAt,
      productUnitId: item.productUnitId,
    }));

    const payload = {
      inboundReceiptDto,
      batchsDto,
    };
    console.log('>>>>>>');
    const res = await handleCreatedInboundReceiptAction(payload);
    if (res?.data) {
      toast.success(res.message);
      handleCloseModal();
      onMutate();
    } else {
      toast.error(res.message);
    }
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setFormBatchData([]);
    setProductUnitIds([]);
    setInboundReceiptInfo(initialInboundReceipt);
  };

  return (
    <>
      <Modal
        show={isCreateModalOpen}
        onHide={handleCloseModal}
        size="xl"
        backdrop={'static'}
      >
        <Modal.Header closeButton>
          <Modal.Title>Thêm mới đơn nhập hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-8">
              <Input
                title="Tên nhà cung cấp"
                size={12}
                value={inboundReceiptInfo.supplierId}
                placeholder="Chọn nhà cung cấp"
                icon={<FaSearch />}
                options={suppliers?.results}
                keyObj="id"
                showObj="name"
                onSelectedChange={handleSupplierChange}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-9">
              <div className="d-flex justify-content-end mx-3">
                <button
                  className="btn d-flex align-items-center btn-primary"
                  onClick={() => setIsProductSupplierModalOpen(true)}
                >
                  <FaPlus className="align-middle" />
                  <text>Thêm</text>
                </button>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    {columns.map((column, index) => (
                      <th key={index} className="text-center align-middle">
                        {column.title}
                      </th>
                    ))}
                    <th className="text-center align-middle">Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {formBatchData.map((item, index) => (
                    <tr className="text-center align-middle" key={index}>
                      <td>{index + 1}</td>
                      <td>{item.productSampleName}</td>
                      <td>{item.unitName}</td>
                      <td>
                        <input
                          type="number"
                          value={item.inbound_quantity}
                          onChange={(e) =>
                            handleBatchInfoChange(
                              index,
                              'inbound_quantity',
                              parseInt(e.target.value),
                            )
                          }
                          className="form-control input-table"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={item.inbound_price}
                          onChange={(e) =>
                            handleBatchInfoChange(
                              index,
                              'inbound_price',
                              parseFloat(e.target.value),
                            )
                          }
                          className="form-control input-table"
                        />
                      </td>
                      <td>{item.total.toFixed(2)}</td>
                      <td>
                        <input
                          type="date"
                          value={item.expiredAt}
                          onChange={(e) =>
                            handleBatchInfoChange(
                              index,
                              'expiredAt',
                              e.target.value,
                            )
                          }
                          className="form-control input-table"
                        />
                      </td>
                      <td>
                        <button onClick={() => handleDeleteRow(index)}>
                          <HiOutlineTrash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="col-md-3">
              <Form.Group className="mb-2">
                <Form.Label>Ngày nhập</Form.Label>
                <Form.Control
                  type="date"
                  value={inboundReceiptInfo.createdAt}
                  onChange={(e) =>
                    handleInboundReceiptInfoChange('createdAt', e.target.value)
                  }
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Tổng tiền hàng</Form.Label>
                <Form.Control
                  type="number"
                  value={inboundReceiptInfo.totalPrice}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Giảm giá</Form.Label>
                <Form.Control
                  type="number"
                  value={inboundReceiptInfo.discount}
                  onChange={(e) =>
                    handleInboundReceiptInfoChange(
                      'discount',
                      parseFloat(e.target.value),
                    )
                  }
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>VAT</Form.Label>
                <Form.Control
                  type="number"
                  value={inboundReceiptInfo.vat}
                  onChange={(e) =>
                    handleInboundReceiptInfoChange(
                      'vat',
                      parseFloat(e.target.value),
                    )
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Tổng tiền thanh toán</Form.Label>
                <Form.Control
                  type="number"
                  value={inboundReceiptInfo.paymentTotal}
                  readOnly
                />
              </Form.Group>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Thoát
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>

      <ProductSupplierModal
        isProductSupplierModalOpen={isProductSupplierModalOpen}
        setIsProductSupplierModalOpen={setIsProductSupplierModalOpen}
        onSelectedProductUnitsChange={setSelectedProductUnitIds}
      />
    </>
  );
}

export default CreateInboundReceiptModal;
