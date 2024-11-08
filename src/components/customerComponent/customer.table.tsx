// SupplierTable Component
import { FaEye } from 'react-icons/fa';
import { Supplier, SupplierTableType } from '@/types/supplier';
import { HiOutlineTrash } from 'react-icons/hi2';
import { useState } from 'react';
import { Customer, CustomerTableType } from '@/types/customer';
import UpdateCustomerModal from './customer.update';
import DeleteCustomerModal from './customer.delete';

const CustomerTable = (props: CustomerTableType) => {
  const { customers, columns, onMutate } = props;
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const [selectedCustomer, setSelectedCustomer] = useState<
    Customer | undefined
  >();

  const handleOpenUpdateModal = (Customer: Customer) => {
    setSelectedCustomer(Customer);
    setIsUpdateModalOpen(true);
  };

  const handleOpenDeleteModal = (Customer: Customer) => {
    setSelectedCustomer(Customer);
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
            {customers?.map((row, rowIndex) => (
              <tr key={rowIndex} className="text-center align-middle">
                {columns.map((column, colIndex) => (
                  <td key={colIndex}>{row[column.key as keyof Customer]}</td>
                ))}
                <td>
                  <button
                    onClick={() => handleOpenUpdateModal(row)}
                  >
                    <FaEye size={18} />
                  </button>
                  <button
                    onClick={() => handleOpenDeleteModal(row)}
                  >
                    <HiOutlineTrash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <UpdateCustomerModal
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        data={selectedCustomer}
        onMutate={onMutate}
      />
      <DeleteCustomerModal
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        data={selectedCustomer}
        onMutate={onMutate}
      />
    </>
  );
};

export default CustomerTable;
