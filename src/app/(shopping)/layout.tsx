import { auth } from '@/auth';
import Header, { HeaderCustomerSide } from '@/components/commonComponent/Header';
import Sidebar from '@/components/commonComponent/Sidebar';
import Sidebar2 from '@/components/commonComponent/Sidebar2';
import { SelectedRolesProvider } from '@/context/selectedRolesContext';
import { useSessionContext } from '@/context/SessionContext';

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <>
      <div className="d-flex">
        <div className="content w-100">
          <HeaderCustomerSide session={session} />
          <hr className="h-color mb-2 mt-0" />
          <div className="container">
            <SelectedRolesProvider>{children}</SelectedRolesProvider>
          </div>
        </div>
      </div>
    </>
  );
}
