import { useSelectedProductUnits } from '@/context/selectedProductUnitsContext';
import React from 'react';
import RowHighlight from '../nullComponent/RowHighlight';
import { Role, RoleTableProps } from '@/types/role';
import { useSelectedRoles } from '@/context/selectedRolesContext';

function RoleTable(props: RoleTableProps) {
  const { columns, roles } = props;

  const { roleIds, setRoleIds } = useSelectedRoles();

  const handleCheckboxChange = (id: number) => {
    const isSelected = roleIds.includes(id);
    const updatedSelectedIds = isSelected
      ? roleIds.filter((selectedId) => selectedId !== id)
      : [...roleIds, id];

    setRoleIds(updatedSelectedIds);
  };

  return (
    <div className="container">
      <RowHighlight />
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col" className="text-center align-middle"></th>
            {columns?.map((column, index) => (
              <th key={index} scope="col" className="text-center align-middle">
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {roles?.map((row, rowIndex) => (
            <tr key={rowIndex} className="text-center align-middle">
              <td>
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={roleIds.includes(row.id)}
                  onChange={() => handleCheckboxChange(row.id)}
                />
              </td>
              {columns.map((column, colIndex) => (
                <td key={colIndex}>{row[column.key as keyof Role]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RoleTable;
