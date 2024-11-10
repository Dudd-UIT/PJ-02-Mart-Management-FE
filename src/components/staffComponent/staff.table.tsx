import { FaEye } from 'react-icons/fa';
import { HiOutlineTrash } from 'react-icons/hi2';
import { useState } from 'react';
import UpdateCustomerModal from './staff.update';
import DeleteCustomerModal from './staff.delete';
import { Staff, StaffTableType } from '@/types/staff';

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
              <th scope="col" className="text-center align-middle">
                Chức năng
              </th>
            </tr>
          </thead>
          <tbody>
            {staffs?.map((row, rowIndex) => (
              <tr key={rowIndex} className="text-center align-middle">
                {columns.map((column, colIndex) => {
                  const cellValue = row[column.key as keyof Staff];

                  // Kiểm tra nếu giá trị là đối tượng `Group`, hiển thị thuộc tính `name` hoặc thuộc tính cần thiết khác
                  const displayValue =
                    cellValue &&
                    typeof cellValue === 'object' &&
                    'name' in cellValue
                      ? cellValue.name
                      : cellValue;

                  return <td key={colIndex}>{displayValue}</td>;
                })}
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
