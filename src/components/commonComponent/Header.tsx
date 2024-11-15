'use client';

import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { IoPersonOutline } from 'react-icons/io5';
import InfoModal from './info.modal';

export default function Header(props: any) {
  const { session } = props;
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

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
            <Dropdown.Item onClick={() => signOut()}>Đăng xuất</Dropdown.Item>
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
