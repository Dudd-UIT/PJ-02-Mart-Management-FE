import { auth } from '@/auth';
import Header from '@/components/commonComponent/Header';
import Sidebar from '@/components/commonComponent/Sidebar';
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
        <Sidebar />
        <div className="content w-100">
          <Header session={session} />
          <hr className="h-color m-2" />
          <div className="container">
            <SelectedRolesProvider>{children}</SelectedRolesProvider>
          </div>
        </div>
      </div>
    </>
  );
}
