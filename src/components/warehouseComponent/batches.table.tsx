// BatchTable Component
import { FaEye } from 'react-icons/fa';
import { Batch, BatchGrouped, BatchTableType } from '@/types/batch';
import { HiOutlineTrash } from 'react-icons/hi2';
import { useState } from 'react';
import UpdateWarehouseModal from './warehouse.update';
import DeleteWarehouseModal from './warehouse.delete';
// import UpdateBatchModal from './Batch.update';
// import DeleteBatchModal from './Batch.delete';

const BatchTable = (props: BatchTableType) => {
  const { batches, columns, onMutate } = props;
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const [selectedBatch, setSelectedBatch] = useState<
    BatchGrouped | undefined
  >();

  const handleOpenUpdateModal = (batch: BatchGrouped) => {
    setSelectedBatch(batch);
    setIsUpdateModalOpen(true);
  };

  const handleOpenDeleteModal = (batch: BatchGrouped) => {
    setSelectedBatch(batch);
    setIsDeleteModalOpen(true);
  };

  return (
    <>
      <table className="table table-hover">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} scope="col" className="text-center align-middle">
                {column.title}
              </th>
            ))}
            <th scope="col" className="text-center align-middle">
              Chức năng
            </th>
          </tr>
        </thead>
        <tbody>
          {batches.length > 0 ? (
            batches.map((row, rowIndex) => (
              <tr key={rowIndex} className="text-center align-middle">
                {columns.map((column, colIndex) => (
                  <td key={colIndex}>
                    {column.key === 'expiredAt' &&
                    row[column.key as keyof BatchGrouped]
                      ? (row[column.key as keyof BatchGrouped] as string)
                          .replace(/T.*/, '')
                          .split('-')
                          .reverse()
                          .join('/')
                      : row[column.key as keyof BatchGrouped]}
                  </td>
                ))}
                <td>
                  <button
                    className="btn btn-sm"
                    onClick={() => handleOpenUpdateModal(row)}
                  >
                    <FaEye size={18} />
                  </button>
                  <button
                    className="btn btn-sm"
                    onClick={() => handleOpenDeleteModal(row)}
                  >
                    <HiOutlineTrash size={18} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 1} className="text-center">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <UpdateWarehouseModal
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        data={selectedBatch} // Pass selected Batch data to modal
        onMutate={onMutate}
      />
      <DeleteWarehouseModal
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        data={selectedBatch}
        onMutate={onMutate}
      />
    </>
  );
};

export default BatchTable;
