'use client';
import { Modal, Button } from 'react-bootstrap';
import { CartDetailItem } from '@/types/cart';
import { useEffect, useState } from 'react';
import { formatCurrency } from '@/utils/format';
import { Input } from '../commonComponent/InputForm';
import { FaSearch } from 'react-icons/fa';

function CheckOutModal(props: UpdateModalProps<CartDetailItem[]>) {
  const {
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    data: selectedItems,
    setData,
    onMutate,
  } = props;

  const [address, setAddress] = useState<string>('');
  const [shippingCost, setShippingCost] = useState<number>(0);
  // Đánh dấu phí ship có hợp lệ với địa chỉ hiện tại không
  const [isShippingCostValid, setIsShippingCostValid] =
    useState<boolean>(false);
  // Lưu lại địa chỉ cuối cùng mà ta đã tính phí ship
  const [lastCalculatedAddress, setLastCalculatedAddress] =
    useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<
    'cod' | 'momo' | 'zalopay'
  >('cod');

  // Hàm tính phí ship khi bấm icon
  const handleCaculateShipping = () => {
    if (address.trim() !== '') {
      const randomCost =
        Math.floor(Math.random() * (50000 - 10000 + 1)) + 10000;
      setShippingCost(randomCost);
      setIsShippingCostValid(true);
      setLastCalculatedAddress(address);
    } else {
      // Nếu địa chỉ rỗng thì không tính được
      setShippingCost(0);
      setIsShippingCostValid(false);
      setLastCalculatedAddress('');
    }
  };
  const subtotal =
    selectedItems?.reduce((acc, item) => {
      const discountPrice =
        item.productUnit.sellPrice -
        item.productUnit.sellPrice * item.productUnit.batches[0].discount;
      return acc + discountPrice * item.quantity;
    }, 0) || 0;

  // Tổng (đã bao gồm phí ship)
  const totalWithShipping = subtotal + shippingCost;

  // Đóng modal
  const handleClose = () => {
    setIsUpdateModalOpen(false);
    // Bạn có thể reset state tuỳ ý
  };

  const handleCloseCreateModal = () => {
    setIsUpdateModalOpen(false);
    setData?.(undefined);
  };
  const handleConfirmPayment = () => {
    //api gì đó

    handleCloseCreateModal();
  };
  console.log('selectedItems', selectedItems);

  return (
    <>
      <Modal
        backdrop={'static'}
        show={isUpdateModalOpen}
        onHide={handleCloseCreateModal}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Thanh toán</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            {/* Bên trái: Danh sách các món hàng */}
            <div className="col-12 col-md-6 border-end">
              <h5 className="mb-3">Giỏ hàng đã chọn</h5>
              {selectedItems?.length === 0 ? (
                <p>Không có sản phẩm nào.</p>
              ) : (
                selectedItems?.map((item) => {
                  const discountPrice =
                    item.productUnit.sellPrice -
                    item.productUnit.sellPrice *
                      item.productUnit.batches[0].discount;
                  return (
                    <div
                      key={item.id}
                      className="d-flex justify-content-between align-items-center mb-2"
                    >
                      <div>
                        <strong>{item.productUnit.productSample.name}</strong>
                        <div>
                          SL: {item.quantity} | Giá:{' '}
                          {formatCurrency(discountPrice)} đ
                        </div>
                      </div>
                      <div className="text-end">
                        <span className="text-danger">
                          {formatCurrency(discountPrice * item.quantity)} đ
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bên phải: Thông tin */}
            <div className="col-12 col-md-6 px-4">
              <h5 className="mt-3 mt-md-0">Thông tin giao hàng</h5>

              {/* Nhập địa chỉ */}
              <div className="mb-3">
                <Input
                  title="Địa chỉ giao hàng"
                  required={true}
                  placeholder="Nhập địa chỉ"
                  value={address}
                  onChange={(value) => setAddress(value)}
                  size={12}
                  icon={<FaSearch />}
                  onClickIcon={handleCaculateShipping}
                />
                <div className="text-muted" style={{ fontSize: '0.9rem' }}>
                  * Sau khi thay đổi địa chỉ, hãy bấm vào icon (tìm kiếm) để
                  tính lại phí ship.
                </div>
              </div>

              {/* Phí ship */}
              <div className="mb-3">
                <label className="form-label fw-bold">
                  Phí ship: (Nhấn icon tìm kiếm để tính phí)
                </label>
                <div>
                  {shippingCost === 0
                    ? 'Chưa có địa chỉ'
                    : formatCurrency(shippingCost) + ' đ'}
                </div>
              </div>

              {/* Tổng hoá đơn */}
              <div className="mb-3">
                <label className="form-label fw-bold">Tổng hoá đơn:</label>
                <div className="text-danger fw-bold fs-5">
                  {formatCurrency(totalWithShipping)} đ
                </div>
              </div>

              {/* Phương thức thanh toán */}
              <div className="mb-3">
                <label className="form-label fw-bold">
                  Phương thức thanh toán:
                </label>
                <div className="d-flex flex-column gap-2">
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="payMomo"
                      checked={paymentMethod === 'momo'}
                      disabled={true} // không hỗ trợ
                      onChange={() => setPaymentMethod('momo')}
                    />
                    <label htmlFor="payMomo" className="form-check-label">
                      Momo (chưa hỗ trợ)
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="payZalo"
                      checked={paymentMethod === 'zalopay'}
                      disabled={true} // không hỗ trợ
                      onChange={() => setPaymentMethod('zalopay')}
                    />
                    <label htmlFor="payZalo" className="form-check-label">
                      ZaloPay (chưa hỗ trợ)
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="payCod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                    />
                    <label htmlFor="payCod" className="form-check-label">
                      Thanh toán khi nhận hàng (COD)
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCreateModal}>
            Thoát
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirmPayment}
            disabled={
              // Không cho thanh toán nếu:
              selectedItems?.length === 0 || // Không có hàng
              address.trim() === '' ||      // Chưa có địa chỉ
              !isShippingCostValid          // Chưa tính phí ship hoặc phí ship cũ
            }
          >
            Xác nhận thanh toán
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CheckOutModal;
