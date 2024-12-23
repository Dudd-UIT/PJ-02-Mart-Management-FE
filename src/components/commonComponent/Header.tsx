'use client';

import { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { IoPersonOutline } from 'react-icons/io5';
import InfoModal from './info.modal';
import { useSessionContext } from '@/context/SessionContext';
import { signOut } from 'next-auth/react';

export default function Header(props: any) {
  const { session } = props;
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const { currentSession, setCurrentSession } = useSessionContext();

  // Đặt session hiện tại
  if (session) {
    setCurrentSession(session);
  }

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: true, callbackUrl: '/login' });
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-end px-4 pt-1">
        <text className="me-auto pt-3">Xin chào, {session?.user.name} !</text>

        <Dropdown>
          <Dropdown.Toggle
            id="avatar"
            bsPrefix="custom-avatar"
            className="d-flex justify-content-center align-items-center p-0"
          >
            <IoPersonOutline className="fs-3" />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setIsInfoModalOpen(true)}>
              Thông tin
            </Dropdown.Item>
            <Dropdown.Item onClick={handleSignOut}>Đăng xuất</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <InfoModal
        isInfoModalOpen={isInfoModalOpen}
        setIsInfoModalOpen={setIsInfoModalOpen}
        data={session}
      />
    </>
  );
}
