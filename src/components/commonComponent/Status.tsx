export const renderStatusBadge = (
  status: number | string,
  type: 'payment' | 'receipt',
) => {
  if (type === 'payment') {
    return status === 1 ? (
      <span className="p-2 rounded bg-opacity-10 fw-semibold text-success border border-success bg-success">
        Đã thanh toán
      </span>
    ) : (
      <span className="p-2 rounded bg-opacity-10 fw-semibold text-warning border border-warning bg-warning">
        Chưa thanh toán
      </span>
    );
  } else if (type === 'receipt') {
    return status === 1 ? (
      <span className="p-2 rounded bg-opacity-10 fw-semibold text-info border border-info bg-info">
        Đã nhận hàng
      </span>
    ) : (
      <span className="p-2 rounded bg-opacity-10 fw-semibold text-danger border border-danger bg-danger">
        Chưa nhận hàng
      </span>
    );
  }
  return null;
};
