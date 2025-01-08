import type { Metadata } from 'next';
import './globals.css';
import { Josefin_Sans } from 'next/font/google';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/custom.min.css';
import { SelectedProductUnitsProvider } from '@/context/selectedProductUnitsContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SessionProvider } from 'next-auth/react';
import ImportBsJS from '@/components/nullComponent/importBsJS';
import { SessionProvider as CustomSessionProvider } from '@/context/SessionContext';

const josefin = Josefin_Sans({
  subsets: ['vietnamese'],
});

export const metadata: Metadata = {
  title: 'BMart',
  description: '',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ImportBsJS />
      <body className={josefin.className}>
        <SessionProvider>
          <SelectedProductUnitsProvider>
            <CustomSessionProvider>{children}</CustomSessionProvider>
            {/* {children} */}
          </SelectedProductUnitsProvider>
        </SessionProvider>
        <ToastContainer position="top-right" autoClose={3000} />
      </body>
    </html>
  );
}
