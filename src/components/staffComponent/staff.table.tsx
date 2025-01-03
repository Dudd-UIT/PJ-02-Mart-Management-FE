import { FaEye } from 'react-icons/fa';
import { HiOutlineTrash } from 'react-icons/hi2';
import { useState } from 'react';
import UpdateCustomerModal from './staff.update';
import DeleteCustomerModal from './staff.delete';
import { Staff, StaffTableType } from '@/types/staff';
import ProtectedComponent from '../commonComponent/ProtectedComponent';

const StaffTable = (props: StaffTableType) => {
  const { staffs, columns, onMutate } = props;
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | undefined>();

  const handleOpenUpdateModal = (staff: Staff) => {
    setSelectedStaff(staff);
    setIsUpdateModalOpen(true);
  };

  const handleOpenDeleteModal = (staff: Staff) => {
    setSelectedStaff(staff);
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
              <ProtectedComponent requiredRoles={['v_staffs', 'd_staff']}>
                <th scope="col" className="text-center align-middle">
                  Thao tác
                </th>
              </ProtectedComponent>
            </tr>
          </thead>
          <tbody>
            {staffs?.map((row, rowIndex) => (
              <tr key={rowIndex} className="text-center align-middle">
                {columns.map((column, colIndex) => {
                  const cellValue = row[column.key as keyof Staff];

                  const displayValue =
                    cellValue &&
                    typeof cellValue === 'object' &&
                    'name' in cellValue
                      ? cellValue.name
                      : cellValue;

                  return <td key={colIndex}>{displayValue}</td>;
                })}
                <ProtectedComponent requiredRoles={['v_staffs', 'd_staff']}>
                  <td>
                    <ProtectedComponent requiredRoles={['v_staffs']}>
                      <button onClick={() => handleOpenUpdateModal(row)}>
                        <FaEye size={18} />
                      </button>
                    </ProtectedComponent>

                    <ProtectedComponent requiredRoles={['d_staff']}>
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

      <UpdateCustomerModal
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        data={selectedStaff}
        setData={setSelectedStaff}
        onMutate={onMutate}
      />
      <DeleteCustomerModal
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        data={selectedStaff}
        onMutate={onMutate}
      />
    </>
  );
};

export default StaffTable;
