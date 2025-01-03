'use client';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { toast } from 'react-toastify';
import { sendRequest } from '@/utils/api';
import ProductSupplierModal from '../productSupplierComponent/productSupplier.list';
import { ProductUnit } from '@/types/productUnit';
import { HiOutlineTrash } from 'react-icons/hi2';
import { Batch, InboundReceiptCreate } from '@/types/batch';
import { Input } from '../commonComponent/InputForm';
import { fetchSuppliers } from '@/services/supplierServices';
import { useSelectedProductUnits } from '@/context/selectedProductUnitsContext';
import { InboundReceiptTransform } from '@/types/inboundReceipt';
import { formatDate } from '@/utils/format';
import {
  handleUpdatedInboundReceiptAction,
  handleUpdatedStatusInboundReceiptAction,
} from '@/services/inboundReceiptServices';
import { fetchProductUnitByIds } from '@/services/productUnitServices';
import ProtectedComponent from '../commonComponent/ProtectedComponent';

type FormDataBatch = {
  id?: number;
  inboundPrice: number;
  discount: number;
  inventQuantity: number;
  inboundQuantity: number;
  expiredAt: string;
  productUnitId: number;
  productSampleName?: string;
  unitName?: string;
  total: number;
};

type FormDataInboundReceipt = {
  id?: number;
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
  { title: 'Số lượng nhập', key: 'inboundQuantity' },
  { title: 'Giá nhập', key: 'inboundPrice' },
  { title: 'Tổng lô hàng', key: 'totalPriceBatch' },
  { title: 'Ngày hết hạn', key: 'expiredAt' },
];

function UpdateInboundReceiptModal(
  props: UpdateModalProps<InboundReceiptTransform>,
) {
  const {
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    data: inboundReceiptData,
    setData: setInboundReceiptDate,
    onMutate,
  } = props;
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

  useEffect(() => {
    if (inboundReceiptData) {
      // Populate inboundReceiptInfo fields
      setInboundReceiptInfo({
        id: inboundReceiptData.id,
        createdAt: formatDate(inboundReceiptData.createdAt),
        totalPrice: inboundReceiptData.totalPrice,
        discount: inboundReceiptData.discount,
        vat: inboundReceiptData.vat,
        paymentTotal: calculatePaymentTotal(
          inboundReceiptData.totalPrice,
          inboundReceiptData.discount,
          inboundReceiptData.vat,
        ),
        staffId: inboundReceiptData.staffId,
        supplierId: inboundReceiptData.supplierId,
        isReceived: inboundReceiptData.isReceived,
        isPaid: +inboundReceiptData.isPaid,
      });

      // Populate formBatchData from batches
      const updatedBatchData = inboundReceiptData.batchs.map(
        (batch: Batch) => ({
          id: batch?.id,
          inboundPrice: batch.inboundPrice,
          discount: batch.discount,
          inventQuantity: batch.inventQuantity,
          inboundQuantity: batch.inboundQuantity,
          expiredAt: batch.expiredAt,
          productUnitId: batch.productUnit.id,
          productSampleName: batch.productUnit?.productSample?.name,
          unitName: batch.productUnit?.unit?.name,
          total: batch.inboundPrice * batch.inboundQuantity,
        }),
      );
      setFormBatchData(updatedBatchData);

      const productUnitInitial = inboundReceiptData.batchs
        .map((batch) => batch.productUnit?.id)
        .filter((id) => id !== undefined);

      setProductUnitIds(productUnitInitial);
    }
  }, [inboundReceiptData, setProductUnitIds]);

  useEffect(() => {
    if (selectedProductUnitIds.length > 0) {
      fetchProductUnitByIds(selectedProductUnitIds).then(
        (selectedProductUnitId) => {
          const updatedFormBatchData = selectedProductUnitId?.results.map(
            (productUnit: ProductUnit) => ({
              inboundPrice: 0,
              discount: 0,
              inventQuantity: 0,
              inboundQuantity: 0,
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
    const totalPrice = formBatchData.reduce((acc, item) => acc + item.total, 0);
    setInboundReceiptInfo((prev) => ({
      ...prev,
      totalPrice: totalPrice,
      paymentTotal: calculatePaymentTotal(totalPrice, prev.discount, prev.vat),
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
              field === 'inboundPrice' || field === 'inboundQuantity'
                ? (field === 'inboundPrice'
                    ? (value as number)
                    : item.inboundPrice) *
                  (field === 'inboundQuantity'
                    ? (value as number)
                    : item.inboundQuantity)
                : item.total,
          }
        : item,
    );
    setFormBatchData(updatedFormBatchData);
  };

  const calculatePaymentTotal = (
    totalPrice: number,
    discount: number,
    vat: number,
  ) => {
    const discountAmount = totalPrice * (discount / 100);
    const priceAfterDiscount = totalPrice - discountAmount;
    const vatAmount = priceAfterDiscount * (vat / 100);
    return priceAfterDiscount + vatAmount;
  };

  const handleInboundReceiptInfoChange = (
    field: keyof typeof inboundReceiptInfo,
    value: number | string,
  ) => {
    setInboundReceiptInfo((prev) => ({
      ...prev,
      [field]: value,
      paymentTotal: calculatePaymentTotal(
        prev.totalPrice,
        prev.discount,
        prev.vat,
      ),
    }));
  };

  const handleSupplierChange = (value: number) => {
    handleInboundReceiptInfoChange('supplierId', value);
  };

  const handleDeleteRow = (index: number) => {
    setFormBatchData(formBatchData.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const inboundReceiptId = inboundReceiptInfo.id;
    const inboundReceiptDto = {
      staffId: inboundReceiptInfo.staffId,
      supplierId: inboundReceiptInfo.supplierId,
      totalPrice: inboundReceiptInfo.totalPrice,
      isReceived: inboundReceiptInfo.isReceived,
      isPaid: inboundReceiptInfo.isPaid,
      discount: inboundReceiptInfo.discount,
      vat: inboundReceiptInfo.vat,
      createdAt: inboundReceiptInfo.createdAt,
    };

    const batchsDto = formBatchData.map((item) => ({
      id: item?.id,
      inboundPrice: item.inboundPrice,
      discount: item.discount,
      inventQuantity: item.inboundQuantity,
      inboundQuantity: item.inboundQuantity,
      expiredAt: item.expiredAt,
      productUnitId: item.productUnitId,
    }));

    const payload = {
      inboundReceiptId,
      inboundReceiptDto,
      batchsDto,
    };

    const res = await handleUpdatedInboundReceiptAction(payload);
    if (res?.data) {
      toast.success(res.message);
      handleCloseModal();
      onMutate();
    } else {
      toast.error(res.message);
    }
  };

  const handleCloseModal = () => {
    setIsUpdateModalOpen(false);
    setFormBatchData([]);
    setProductUnitIds([]);
    setInboundReceiptInfo(initialInboundReceipt);
    setInboundReceiptDate?.(undefined);
  };

  const handlePaidStatus = async () => {
    setInboundReceiptInfo((prev) => ({ ...prev, isPaid: 1 }));
    await handleUpdateStatus({ isPaid: 1 });
  };

  const handleReceivedStatus = async () => {
    if (inboundReceiptInfo.isPaid === 0) {
      setInboundReceiptInfo((prev) => ({ ...prev, isPaid: 1, isReceived: 1 }));
      await handleUpdateStatus({ isPaid: 1, isReceived: 1 });
    } else {
      setInboundReceiptInfo((prev) => ({ ...prev, isReceived: 1 }));
      await handleUpdateStatus({ isReceived: 1 });
    }
  };

  const handleUpdateStatus = async (
    updatedStatus: Partial<typeof inboundReceiptInfo>,
  ) => {
    const id = inboundReceiptInfo.id;
    const payload = { id, ...updatedStatus };
    const res = await handleUpdatedStatusInboundReceiptAction(payload);
    if (res?.data) {
      toast.success(res.message);
      handleCloseModal();
      onMutate();
    } else {
      toast.error(res.message);
      handleCloseModal();
    }
  };

  return (
    <>
      <Modal
        show={isUpdateModalOpen}
        onHide={handleCloseModal}
        size="xl"
        backdrop={'static'}
      >
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật đơn nhập hàng</Modal.Title>
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
                readOnly={+inboundReceiptInfo.isPaid === 1}
                disabled={+inboundReceiptInfo.isPaid === 1}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-9">
              <div className="d-flex justify-content-between">
                <div>
                  <button
                    disabled={+inboundReceiptInfo.isPaid === 1}
                    className="btn btn-secondary"
                    onClick={handlePaidStatus}
                  >
                    <text>Đã thanh toán</text>
                  </button>
                  <button
                    disabled={+inboundReceiptInfo.isReceived === 1}
                    className="btn btn-secondary"
                    onClick={handleReceivedStatus}
                  >
                    <text>Chuyển vào kho</text>
                  </button>
                </div>
                {+inboundReceiptInfo.isPaid === 1 ? (
                  <></>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={() => setIsProductSupplierModalOpen(true)}
                  >
                    <FaPlus className="align-middle" />
                    <text>Thêm</text>
                  </button>
                )}
              </div>
              <table className="table">
                <thead>
                  <tr>
                    {columns.map((column, index) => (
                      <th key={index} className="text-center align-middle">
                        {column.title}
                      </th>
                    ))}
                    {+inboundReceiptInfo.isPaid === 1 ? (
                      <></>
                    ) : (
                      <th className="text-center align-middle">Xóa</th>
                    )}
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
                          value={item.inboundQuantity}
                          onChange={(e) =>
                            handleBatchInfoChange(
                              index,
                              'inboundQuantity',
                              parseInt(e.target.value),
                            )
                          }
                          className="form-control input-table"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={item.inboundPrice}
                          onChange={(e) =>
                            handleBatchInfoChange(
                              index,
                              'inboundPrice',
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
                          value={formatDate(item.expiredAt)} // Format for display
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
                      {+inboundReceiptInfo.isPaid === 1 ? (
                        <></>
                      ) : (
                        <td>
                          <button onClick={() => handleDeleteRow(index)}>
                            <HiOutlineTrash size={18} />
                          </button>
                        </td>
                      )}
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
                  disabled={+inboundReceiptInfo.isPaid === 1}
                  value={formatDate(inboundReceiptInfo.createdAt)} // Format for display
                  onChange={(e) =>
                    handleInboundReceiptInfoChange('createdAt', e.target.value)
                  }
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Tổng tiền hàng</Form.Label>
                <Form.Control
                  disabled={+inboundReceiptInfo.isPaid === 1}
                  type="number"
                  value={inboundReceiptInfo.totalPrice}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Giảm giá (%)</Form.Label>
                <Form.Control
                  type="number"
                  disabled={+inboundReceiptInfo.isPaid === 1}
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
                <Form.Label>VAT (%)</Form.Label>
                <Form.Control
                  type="number"
                  disabled={+inboundReceiptInfo.isPaid === 1}
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
                  disabled={+inboundReceiptInfo.isPaid === 1}
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
          <ProtectedComponent requiredRoles={['u_inbound']}>
            {+inboundReceiptInfo.isPaid === 1 ? (
              <></>
            ) : (
              <Button variant="primary" onClick={handleSubmit}>
                Lưu
              </Button>
            )}
          </ProtectedComponent>
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

export default UpdateInboundReceiptModal;
