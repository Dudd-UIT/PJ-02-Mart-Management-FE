'use client';

import Header from '@/components/commonComponent/Header';
import Sidebar from '@/components/commonComponent/Sidebar';
import { SelectedRolesProvider } from '@/context/selectedRolesContext';
import { signOut } from 'next-auth/react';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const handleLogout = () => {
    signOut();
  };
  return (
    <>
      <div className="d-flex">
        <Sidebar />
        <div className="content w-100">
          <Header />
          <hr className="h-color m-2" />
          <div className="container">
            <SelectedRolesProvider>{children}</SelectedRolesProvider>
          </div>
        </div>
      </div>
    </>
  );
}
