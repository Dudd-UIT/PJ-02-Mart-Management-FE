import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Input } from './InputForm';

interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  groupName: string;
  address: string;
}

function InfoModal(props: InfoModalProps) {
  const { isInfoModalOpen, setIsInfoModalOpen, data } = props;
  const [userSession, setUserSession] = useState<User | null>(null);

  const handleCloseUpdateModal = () => {
    setIsInfoModalOpen(false);
  };

  return (
    <Modal
      backdrop={'static'}
      show={isInfoModalOpen}
      onHide={handleCloseUpdateModal}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Thông tin tài khoản</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container mb-4">
          <div className="row mb-3">
            <Input
              size={3}
              title="Mã số (ID)"
              readOnly
              value={data?.user.id || ''}
            />
            <Input
              size={5}
              readOnly
              title="Họ và tên"
              value={data?.user.name || ''}
            />
            <Input
              size={4}
              title="Số điện thoại"
              readOnly
              value={data?.user.phone || ''}
            />
          </div>
          <div className="row mb-3">
            <Input
              size={6}
              title="Email"
              readOnly
              value={data?.user.email || ''}
            />
            <Input
              title="Nhóm người dùng"
              readOnly
              size={6}
              value={data?.user.groupName || ''}
            />
          </div>
          <div className="row mb-3">
            <Input
              title="Địa chỉ"
              readOnly
              size={12}
              value={data?.user.address || ''}
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
  );
}

export default InfoModal;
