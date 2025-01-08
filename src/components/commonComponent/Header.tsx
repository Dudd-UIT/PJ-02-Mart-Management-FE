'use client';

import { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { IoPersonOutline } from 'react-icons/io5';
import InfoModal from './info.modal';
import { useSessionContext } from '@/context/SessionContext';
import { signOut } from 'next-auth/react';
import ChangePasswordModal from './changePassword.modal';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function Header(props: any) {
  const { session } = props;
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);

  const { currentSession, setCurrentSession } = useSessionContext();

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
            <Dropdown.Item onClick={() => setIsChangePasswordModalOpen(true)}>
              Đổi mật khẩu
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
      <ChangePasswordModal
        isChangePasswordModalOpen={isChangePasswordModalOpen}
        setIsChangePasswordModalOpen={setIsChangePasswordModalOpen}
        data={session}
      />
    </>
  );
}

export function HeaderCustomerSide(props: any) {
  const { session } = props;
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const { currentSession, setCurrentSession } = useSessionContext();
  console.log('currentSession', currentSession);
  setCurrentSession(session);
  const pathname = usePathname();

  return (
    <>
      <div className="d-flex justify-content-between px-4">
        <div className="position-relative py-1">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={48} // Tương đương 3rem
            height={48} // Tương đương 3rem
          />
          <h2 style={{ position: 'absolute', top: '1rem', left: '3rem' }}>
            <strong>BMart</strong>
          </h2>
        </div>
        <div className="d-flex align-items-end">
          <Link
            href="/product-sale"
            className={`${
              pathname == '/product-sale' ? `active` : ``
            } navigate-header`}
          >
            <h4 className="mb-0">
              <strong>Mặt hàng</strong>
            </h4>
          </Link>
          <Link
            href="cart"
            className={`${
              pathname == '/cart' ? `active` : ``
            } navigate-header border-end border-start`}
          >
            <h4 className="mb-0">
              <strong>Giỏ hàng</strong>
            </h4>
          </Link>
          <Link
            href="order-history"
            className={`${
              pathname == 'order-history' ? `active` : ``
            } navigate-header`}
          >
            <h4 className="mb-0">
              <strong>Đơn hàng</strong>
            </h4>
          </Link>
        </div>
        <Dropdown className="pt-2">
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
