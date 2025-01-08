import { Modal, Button, Table } from 'react-bootstrap';
import { Input } from '../commonComponent/InputForm';
import { OrderDetailTransform, OrderTransform } from '@/types/order';
import { formatDate } from '@/utils/format';
import { renderStatusBadge } from '../commonComponent/Status';
import ProtectedComponent from '../commonComponent/ProtectedComponent';

const columns: Column<OrderDetailTransform>[] = [
  { title: '#', key: 'id' },
  { title: 'Tên sản phẩm', key: 'productSampleName' },
  { title: 'Đơn vị', key: 'unitName' },
  { title: 'Số lượng', key: 'quantity' },
  { title: 'Giá', key: 'currentPrice' },
];

const UpdateOrderModal = (props: UpdateModalProps<OrderTransform>) => {
  const {
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    data: selectedOrder,
    setData: setSelectedOrder,
    onMutate,
  } = props;

  const orderDetiailsTranform: Partial<OrderDetailTransform>[] =
    selectedOrder?.orderDetails?.map((orderDetail) => ({
      id: orderDetail?.id,
      productSampleName: orderDetail?.productUnit?.productSample?.name,
      quantity: orderDetail?.quantity,
      unitName: orderDetail?.productUnit?.unit?.name,
      currentPrice: orderDetail?.currentPrice,
    })) || [];

  const handleCloseModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedOrder?.(undefined);
  };

  const handleSaveChanges = () => {
    onMutate();
    handleCloseModal();
  };

  return (
    <Modal
      show={isUpdateModalOpen}
      onHide={handleCloseModal}
      size="lg"
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>Thông tin hóa đơn</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedOrder ? (
          <>
            {/* Thông tin đơn hàng */}
            <div className="row">
              <Input
                size={5}
                title="Tên khách hàng"
                value={selectedOrder.customerName}
                disabled
              />
              <Input
                size={4}
                title="Tên nhân viên"
                value={selectedOrder.staffName}
                disabled
              />
              <Input
                size={3}
                title="Loại hóa đơn"
                value={selectedOrder.orderType}
                disabled
              />
            </div>
            <div className="row align-items-end">
              <Input
                size={3}
                title="Phương thức thanh toán"
                value={selectedOrder.paymentMethod}
                disabled
              />
              <Input
                size={3}
                title="Thời điểm thanh toán"
                value={formatDate(selectedOrder.paymentTime)}
                disabled
              />
              <div className="col-md-3 mb-3">
                {renderStatusBadge(+selectedOrder.isReceived, 'payment', true)}
              </div>
              <div className="col-md-3 mb-3">
                {renderStatusBadge(+selectedOrder.isPaid, 'receipt', true)}
              </div>
            </div>
            <div className="row">
              <Input
                size={6}
                title="Ngày tạo"
                value={formatDate(selectedOrder.createdAt)}
                disabled
              />
              <Input
                size={6}
                title="Tổng tiền"
                value={selectedOrder.totalPrice}
                disabled
              />
            </div>
            {/* Danh sách sản phẩm */}
            <div className="mt-4">
              <h5>Danh sách sản phẩm</h5>
              <Table bordered hover>
                <thead>
                  <tr>
                    {columns.map((column, index) => (
                      <th
                        key={index}
                        scope="col"
                        className="text-center align-middle"
                      >
                        {column.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orderDetiailsTranform?.map((row, rowIndex) => (
                    <tr key={rowIndex} className="text-center align-middle">
                      {columns.map((column, colIndex) => {
                        const cellData =
                          row[column.key as keyof OrderDetailTransform];

                        if (typeof cellData === 'object') {
                          return (
                            <td key={colIndex}>{`Batches: ${cellData}`}</td>
                          );
                        }

                        return <td key={colIndex}>{cellData}</td>;
                      })}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </>
        ) : (
          <p>Không có dữ liệu đơn hàng.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Thoát
        </Button>
        <ProtectedComponent requiredRoles={['u_order']}>
          <Button variant="primary" onClick={handleSaveChanges}>
            Lưu
          </Button>
        </ProtectedComponent>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateOrderModal;
