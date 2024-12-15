// SupplierTable Component
import { FaEye } from 'react-icons/fa';
import { HiOutlineTrash } from 'react-icons/hi2';
import { useState } from 'react';
import { HiOutlineUserGroup } from 'react-icons/hi2';

import { Group, UserGroupTableType } from '@/types/group';
import UpdateUserGroupModal from './group.update';
import DeleteUserGroupModal from './group.delete';
import AssignRoleModal from './group.asignRole';

const UserGroupTable = (props: UserGroupTableType) => {
  const { groups, columns, onMutate } = props;
  const [isAssignRoleModalOpen, setIsAssignRoleModalOpen] =
    useState<boolean>(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | undefined>();

  const handleOpenAssignRoleModal = (group: Group) => {
    setSelectedGroup(group);
    setIsAssignRoleModalOpen(true);
  };

  const handleOpenUpdateModal = (group: Group) => {
    setSelectedGroup(group);
    setIsUpdateModalOpen(true);
  };

  const handleOpenDeleteModal = (group: Group) => {
    setSelectedGroup(group);
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
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {groups?.map((row, rowIndex) => (
              <tr key={rowIndex} className="text-center align-middle">
                {columns.map((column, colIndex) => {
                  const cellValue = row[column.key as keyof Group];

                  const displayValue =
                    cellValue &&
                    typeof cellValue === 'object' &&
                    'name' in cellValue
                      ? (cellValue as { name: string }).name
                      : cellValue !== undefined && cellValue !== null
                      ? String(cellValue)
                      : '';

                  return <td key={colIndex}>{displayValue}</td>;
                })}
                <td>
                  <button onClick={() => handleOpenAssignRoleModal(row)}>
                    <HiOutlineUserGroup size={18} />
                  </button>
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

      <AssignRoleModal
        data={selectedGroup}
        setData={setSelectedGroup}
        isAssignRoleModalOpen={isAssignRoleModalOpen}
        setIsAssignRoleModalOpen={setIsAssignRoleModalOpen}
        onMutate={onMutate}
      />

      <UpdateUserGroupModal
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        data={selectedGroup}
        setData={setSelectedGroup}
        onMutate={onMutate}
      />
      <DeleteUserGroupModal
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        data={selectedGroup}
        onMutate={onMutate}
      />
    </>
  );
};

export default UserGroupTable;
