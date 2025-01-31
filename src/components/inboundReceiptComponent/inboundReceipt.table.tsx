import { FaEye } from 'react-icons/fa';
import { HiOutlineTrash } from 'react-icons/hi2';
import { useState } from 'react';
import {
  InboundReceiptTableModalProps,
  InboundReceiptTransform,
} from '@/types/inboundReceipt';
import UpdateInboundReceiptModal from './inboundReceipt.update';
import DeleteInboundReceiptModal from './inboundReceipt.delete';
import { renderStatusBadge } from '../commonComponent/Status';
import { formatCurrencyLong, formatDateDMY } from '@/utils/format';
import ProtectedComponent from '../commonComponent/ProtectedComponent';

const InboundReceiptTable = (props: InboundReceiptTableModalProps) => {
  const { inboundReceipts, columns, onMutate } = props;
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const [selectedInboundReceipt, setSelectedInboundReceipt] = useState<
    InboundReceiptTransform | undefined
  >();

  const handleOpenUpdateModal = (inboundReceipt: InboundReceiptTransform) => {
    setSelectedInboundReceipt(inboundReceipt);
    setIsUpdateModalOpen(true);
  };

  const handleOpenDeleteModal = (inboundReceipt: InboundReceiptTransform) => {
    setSelectedInboundReceipt(inboundReceipt);
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
              <ProtectedComponent
                requiredRoles={['v_inbounds', 'd_inbound']}
              >
                <th scope="col" className="text-center align-middle">
                  Thao tác
                </th>
              </ProtectedComponent>
            </tr>
          </thead>
          <tbody>
            {inboundReceipts?.map((row, rowIndex) => (
              <tr key={rowIndex} className="text-center align-middle">
                {columns.map((column, colIndex) => {
                  const cellData =
                    row[column.key as keyof InboundReceiptTransform];

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

                  // Format 'createdAt' to dd-mm-yyyy
                  if (
                    column.key === 'totalPrice' 
                  ) {
                    return <td key={colIndex}>{formatCurrencyLong(+cellData)}</td>;
                  }
                  if (
                    column.key === 'createdAt' &&
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
                <ProtectedComponent requiredRoles={['v_inbounds', 'd_inbound']}>
                  <td>
                    <ProtectedComponent requiredRoles={['v_inbounds']}>
                      <button onClick={() => handleOpenUpdateModal(row)}>
                        <FaEye size={18} />
                      </button>
                    </ProtectedComponent>
                    <ProtectedComponent requiredRoles={['d_inbound']}>
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

      <UpdateInboundReceiptModal
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        data={selectedInboundReceipt} // Pass selected InboundReceipt data to modal
        setData={setSelectedInboundReceipt}
        onMutate={onMutate}
      />
      <DeleteInboundReceiptModal
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        data={selectedInboundReceipt}
        onMutate={onMutate}
      />
    </>
  );
};

export default InboundReceiptTable;
