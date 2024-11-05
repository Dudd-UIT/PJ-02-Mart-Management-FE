import type { Metadata } from 'next';
import './globals.css';
import { Josefin_Sans } from 'next/font/google';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/custom.min.css';
import { SelectedProductUnitsProvider } from '@/context/selectedProductUnitsContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      <body className={josefin.className}>
        <SelectedProductUnitsProvider>{children}</SelectedProductUnitsProvider>
        <ToastContainer position="top-right" autoClose={3000} />
      </body>
    </html>
  );
}
