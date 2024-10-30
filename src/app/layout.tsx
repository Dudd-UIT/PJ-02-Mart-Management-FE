import type { Metadata } from 'next';
import './globals.css';
import { Josefin_Sans } from 'next/font/google';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/custom.min.css';
import ImportBsJS from '../components/nullComponent/importBsJS';

const josefin = Josefin_Sans({
  subsets: ['vietnamese'],
});

export const metadata: Metadata = {
  title: 'BMart',
  description: '',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ImportBsJS />
      <body className={josefin.className}>{children}</body>
    </html>
  );
}
