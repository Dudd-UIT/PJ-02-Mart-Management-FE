'use client';
import { Modal, Button, Form } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Input } from '../commonComponent/InputForm';
import useSWR from 'swr';
import { FaSearch } from 'react-icons/fa';
import {
  fetchRoles,
  handleAssignRoleToGroupAction,
} from '@/services/roleServices';
import { AssignRoleModalProps, Role } from '@/types/role';
import RoleTable from '../roleComponent/role.table';
import { useSelectedRoles } from '@/context/selectedRolesContext';

const columns: Column<Role>[] = [
  { title: 'ID', key: 'id' },
  { title: 'Mô tả', key: 'description' },
];

function AssignRoleModal(props: AssignRoleModalProps) {
  const {
    isAssignRoleModalOpen,
    data: groupData,
    setData: setGroupData,
    setIsAssignRoleModalOpen,
    onMutate,
  } = props;

  const [searchDescription, setSearchDescription] = useState('');
  const [searchParams, setSearchParams] = useState({ description: '' });
  const { roleIds, setRoleIds } = useSelectedRoles();
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    if (groupData) {
      const selectedRoleIds = groupData.roles?.map((role: Role) => role.id);
      if (selectedRoleIds) {
        setRoleIds(selectedRoleIds);
      } else {
        setRoleIds([]);
      }
    }
  }, [groupData, setRoleIds]);

  const handleCloseAssignModal = () => {
    setRoleIds([]);
    setGroupData?.(undefined);
    setIsAssignRoleModalOpen(false);
  };

  const handleAssignRoleToGroup = async () => {
    const groupId = groupData?.id;
    const res = await handleAssignRoleToGroupAction({ groupId, roleIds });
    if (res?.data) {
      handleCloseAssignModal();
      onMutate();
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  const handlePreviousPage = () => {
    if (current > 1) setCurrent(current - 1);
  };

  const handleNextPage = () => {
    if (current < meta.pages) setCurrent(current + 1);
  };

  const handleSearchClick = () => {
    setSearchParams({ description: searchDescription });
    setCurrent(1);
  };
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/roles`;
  const { data, error } = useSWR(
    [url, current, pageSize, searchParams.description],
    () => fetchRoles(current, pageSize, searchParams.description),
  );

  const meta: MetaData = {
    current,
    pageSize,
    pages: data?.meta.pages,
    total: data?.meta.total,
  };

  return (
    <>
      <Modal
        backdrop={'static'}
        show={isAssignRoleModalOpen}
        onHide={handleCloseAssignModal}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Phân quyền nhóm người dùng {groupData?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* button search */}
          <Form>
            <div className="row mb-3">
              <Input
                title="Vai trò"
                size={12}
                value={searchDescription}
                placeholder="Nhập vai trò"
                onChange={(value) => setSearchDescription(value)}
                onClickIcon={handleSearchClick}
                icon={<FaSearch />}
              />
            </div>
          </Form>
          {/* ProductUnit Table */}
          <RoleTable columns={columns} roles={data?.results} />
          {/* Navigate Control */}
          <nav aria-label="Page navigation example" className="mt-3">
            <ul className="pagination justify-content-center">
              <li className={`page-item ${current === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={handlePreviousPage}>
                  Previous
                </button>
              </li>
              {Array.from({ length: meta.pages }, (_, index) => (
                <li
                  key={index}
                  className={`page-item ${
                    current === index + 1 ? 'active' : ''
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrent(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${
                  current === meta.pages ? 'disabled' : ''
                }`}
              >
                <button className="page-link" onClick={handleNextPage}>
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAssignModal}>
            Thoát
          </Button>
          <Button variant="danger" onClick={handleAssignRoleToGroup}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AssignRoleModal;
