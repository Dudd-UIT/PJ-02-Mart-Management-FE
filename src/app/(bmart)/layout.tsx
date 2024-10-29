import Sidebar from '@/components/Sidebar';
import { IoPersonOutline } from 'react-icons/io5';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="d-flex">
        <Sidebar />
        <div className="content w-100">
          <div className='d-flex justify-content-end px-4 pt-2'>
            <button id='avatar'>
              <IoPersonOutline className='fs-3'/>
            </button>
          </div>
        <hr className="h-color m-2" />
            {children}
        </div>
      </div>
    </>
  );
}
