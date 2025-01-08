import { FaEye } from 'react-icons/fa';
import { HiOutlineTrash } from 'react-icons/hi2';
import { useState } from 'react';
import { formatDateDMY } from '@/utils/format';
import { OrderTableModalProps, OrderTransform } from '@/types/order';
import UpdateOrderModal from './order.update';
import DeleteOrderModal from './order.delete';
import { renderStatusBadge } from '../commonComponent/Status';
import ProtectedComponent from '../commonComponent/ProtectedComponent';

const OrderTable = (props: OrderTableModalProps) => {
  const { orders, columns, onMutate } = props;
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const [selectedOrder, setSelectedOrder] = useState<
    OrderTransform | undefined
  >();

  const handleOpenUpdateModal = (order: OrderTransform) => {
    setSelectedOrder(order);
    setIsUpdateModalOpen(true);
  };

  const handleOpenDeleteModal = (order: OrderTransform) => {
    setSelectedOrder(order);
    setIsDeleteModalOpen(true);
  };

  return (
    <>
      <div className="container">
        <table className="table table-hover">
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
              <ProtectedComponent requiredRoles={['v_orders', 'd_order']}>
                <th scope="col" className="text-center align-middle">
                  Thao tác
                </th>
              </ProtectedComponent>
            </tr>
          </thead>
          <tbody>
            {orders?.map((row, rowIndex) => (
              <tr key={rowIndex} className="text-center align-middle">
                {columns.map((column, colIndex) => {
                  const cellData = row[column.key as keyof OrderTransform];
                  // Conditional rendering for isPaid and isReceived statuses
                  if (column.key === 'isPaid') {
                    return (
                      <td key={colIndex}>
                        {renderStatusBadge(+cellData, 'payment')}
                      </td>
                    );
                  }

                  if (column.key === 'isReceived') {
                    return (
                      <td key={colIndex}>
                        {renderStatusBadge(+cellData, 'receipt')}
                      </td>
                    );
                  }
                  if (
                    (column.key === 'paymentTime' ||
                      column.key === 'createdAt') &&
                    typeof cellData === 'string'
                  ) {
                    return <td key={colIndex}>{formatDateDMY(cellData)}</td>;
                  }

                  if (Array.isArray(cellData)) {
                    return (
                      <td key={colIndex}>{`Batches: ${cellData.length}`}</td>
                    );
                  }

                  return <td key={colIndex}>{cellData}</td>;
                })}
                <ProtectedComponent requiredRoles={['v_orders', 'd_order']}>
                  <td>
                    <ProtectedComponent requiredRoles={['v_orders']}>
                      <button onClick={() => handleOpenUpdateModal(row)}>
                        <FaEye size={18} />
                      </button>
                    </ProtectedComponent>
                    <ProtectedComponent requiredRoles={['d_order']}>
                      <button onClick={() => handleOpenDeleteModal(row)}>
                        <HiOutlineTrash size={18} />
                      </button>
                    </ProtectedComponent>
                  </td>
                </ProtectedComponent>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <UpdateOrderModal
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        data={selectedOrder}
        setData={setSelectedOrder}
        onMutate={onMutate}
      />
      <DeleteOrderModal
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        data={selectedOrder}
        onMutate={onMutate}
      />
    </>
  );
};

export default OrderTable;
