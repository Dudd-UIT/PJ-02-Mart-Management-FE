// SupplierTable Component
import { FaEye } from 'react-icons/fa';
import { Supplier, SupplierTableType } from '@/types/supplier';
import { HiOutlineTrash } from 'react-icons/hi2';
import { useState } from 'react';
import UpdateSupplierModal from './supplier.update';
import DeleteSupplierModal from './supplier.delete';
import ProtectedComponent from '../commonComponent/ProtectedComponent';

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
              <ProtectedComponent requiredRoles={['v_sups', 'd_sup']}>
                <th scope="col" className="text-center align-middle">
                  Thao tác
                </th>
              </ProtectedComponent>
            </tr>
          </thead>
          <tbody>
            {suppliers?.map((row, rowIndex) => (
              <tr key={rowIndex} className="text-center align-middle">
                {columns.map((column, colIndex) => (
                  <td key={colIndex}>{row[column.key as keyof Supplier]}</td>
                ))}
                <ProtectedComponent requiredRoles={['v_sups', 'd_sup']}>
                  <td>
                    <ProtectedComponent requiredRoles={['v_sups']}>
                      <button onClick={() => handleOpenUpdateModal(row)}>
                        <FaEye size={18} />
                      </button>
                    </ProtectedComponent>
                    <ProtectedComponent requiredRoles={['d_sup']}>
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
