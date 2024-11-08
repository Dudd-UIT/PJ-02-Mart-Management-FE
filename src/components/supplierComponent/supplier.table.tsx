// SupplierTable Component
import { FaEye } from 'react-icons/fa';
import { Supplier, SupplierTableType } from '@/types/supplier';
import { HiOutlineTrash } from 'react-icons/hi2';
import { useState } from 'react';
import UpdateSupplierModal from './supplier.update';
import DeleteSupplierModal from './supplier.delete';

const SupplierTable = (props: SupplierTableType) => {
  const { suppliers, columns, onMutate } = props;
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const [selectedSupplier, setSelectedSupplier] = useState<
    Supplier | undefined
  >();

  const handleOpenUpdateModal = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsUpdateModalOpen(true);
  };

  const handleOpenDeleteModal = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
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
              <th scope="col" className="text-center align-middle">
                Chức năng
              </th>
            </tr>
          </thead>
          <tbody>
            {suppliers?.map((row, rowIndex) => (
              <tr key={rowIndex} className="text-center align-middle">
                {columns.map((column, colIndex) => (
                  <td key={colIndex}>{row[column.key as keyof Supplier]}</td>
                ))}
                <td>
                  <button onClick={() => handleOpenUpdateModal(row)}>
                    <FaEye size={18} />
                  </button>
                  <button onClick={() => handleOpenDeleteModal(row)}>
                    <HiOutlineTrash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <UpdateSupplierModal
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        data={selectedSupplier} // Pass selected supplier data to modal
        setData={setSelectedSupplier}
        onMutate={onMutate}
      />
      <DeleteSupplierModal
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        data={selectedSupplier}
        onMutate={onMutate}
      />
    </>
  );
};

export default SupplierTable;
