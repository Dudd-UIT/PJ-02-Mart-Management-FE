import { IoCheckmarkDone, IoClose } from 'react-icons/io5';
import { MdAttachMoney, MdMoneyOff } from 'react-icons/md';

export const renderStatusBadge = (
  status: number | string,
  type: 'payment' | 'receipt',
  text: boolean = false,
) => {
  if (type === 'payment') {
    return status === 1 ? (
      <span className="p-2 rounded bg-opacity-10 fw-semibold text-success border border-success bg-success">
        {text && `Đã thanh toán`}
        <MdAttachMoney size={18} />
      </span>
    ) : (
      <span className="p-2 rounded bg-opacity-10 fw-semibold text-danger border border-danger bg-danger">
        {text && `Chưa thanh toán`}
        <MdMoneyOff size={18} />
      </span>
    );
  } else if (type === 'receipt') {
    return status === 1 ? (
      <span className="p-2 rounded bg-opacity-10 fw-semibold text-success border border-success bg-success">
        {text && `Đã nhận hàng`}
        <IoCheckmarkDone size={18} />
      </span>
    ) : (
      <span className="p-2 rounded bg-opacity-10 fw-semibold text-danger border border-danger bg-danger">
        {text && `Chưa nhận hàng`}
        <IoClose size={18} />
      </span>
    );
  }
  return null;
};
