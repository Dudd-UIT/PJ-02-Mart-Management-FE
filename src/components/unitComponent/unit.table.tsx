import { FaEye } from 'react-icons/fa';
import { HiOutlineTrash } from 'react-icons/hi2';
import { useState } from 'react';
import ProtectedComponent from '../commonComponent/ProtectedComponent';
import UpdateUnitModal from './unit.update';
import DeleteUnitModal from './unit.delete';
import { Unit, UnitTableType } from '@/types/unit';

const UnitTable = (props: UnitTableType) => {
  const { units, columns, onMutate } = props;
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedUnit, setSelectedUnit] = useState<Unit | undefined>();

  const handleOpenUpdateModal = (unit: Unit) => {
    setSelectedUnit(unit);
    setIsUpdateModalOpen(true);
  };

  const handleOpenDeleteModal = (unit: Unit) => {
    setSelectedUnit(unit);
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
              <ProtectedComponent requiredRoles={['v_pdtypes', 'd_pdtype']}>
                <th scope="col" className="text-center align-middle">
                  Thao tác
                </th>
              </ProtectedComponent>
            </tr>
          </thead>
          <tbody>
            {units?.map((row, rowIndex) => (
              <tr key={rowIndex} className="text-center align-middle">
                {columns.map((column, colIndex) => (
                  <td key={colIndex}>{row[column.key as keyof Unit]}</td>
                ))}
                <ProtectedComponent requiredRoles={['v_units', 'd_unit']}>
                  <td>
                    <ProtectedComponent requiredRoles={['v_units']}>
                      <button onClick={() => handleOpenUpdateModal(row)}>
                        <FaEye size={18} />
                      </button>
                    </ProtectedComponent>
                    <ProtectedComponent requiredRoles={['d_unit']}>
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

      <UpdateUnitModal
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        data={selectedUnit}
        setData={setSelectedUnit}
        onMutate={onMutate}
      />
      <DeleteUnitModal
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        data={selectedUnit}
        onMutate={onMutate}
      />
    </>
  );
};

export default UnitTable;
