'use client';
import { Modal, Button } from 'react-bootstrap';
import { Input } from '../commonComponent/InputForm';
import { useSession } from 'next-auth/react';

function InfoModal(props: InfoModalProps) {
  const { isInfoModalOpen, setIsInfoModalOpen } = props;
  const { data: session } = useSession();

  const handleCloseUpdateModal = () => {
    setIsInfoModalOpen(false);
  };

  return (
    <>
      <Modal
        backdrop={'static'}
        show={isInfoModalOpen}
        onHide={handleCloseUpdateModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Thông tin tài khoản</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Thông tin nhân viên */}
          <div className="container mb-4">
            <div className="row mb-3">
              <Input
                size={3}
                title="Mã số (ID)"
                readOnly
                value={session?.user.id || ''}
              />
              <Input
                size={5}
                readOnly
                title="Họ và tên"
                value={session?.user.name || ''}
              />
              <Input
                size={4}
                title="Số điện thoại"
                readOnly
                value={session?.user.phone || ''}
              />
            </div>
            <div className="row mb-3">
              <Input
                size={6}
                title="Email"
                readOnly
                value={session?.user.email || ''}
              />
              <Input
                title="Nhóm người dùng"
                readOnly
                size={6}
                value={session?.user.groupName || ''}
              />
            </div>
            <div className="row mb-3">
              <Input
                title="Địa chỉ"
                readOnly
                size={12}
                value={session?.user.address || ''}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseUpdateModal}>
            Thoát
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default InfoModal;
