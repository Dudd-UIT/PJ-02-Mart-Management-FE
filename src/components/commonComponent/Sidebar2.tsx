'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { IoStatsChart, IoPeople } from 'react-icons/io5';
import {
  FaShoppingCart,
  FaWarehouse,
  FaAngleDoubleRight,
  FaAngleDoubleLeft,
  FaAngleDown,
  FaAngleUp,
  FaRegHandshake,
} from 'react-icons/fa';
import { LuImport } from 'react-icons/lu';
import { TbShieldStar } from 'react-icons/tb';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import ProtectedComponent from './ProtectedComponent';

export default function Sidebar2() {
  const [isPinned, setIsPinned] = useState(false);
  const [isSaleOpen, setIsSaleOpen] = useState(false);
  const [isStatOpen, setIsStatOpen] = useState(false);
  const [isRuleOpen, setIsRuleOpen] = useState(false);
  const pathname = usePathname();
  const togglePin = () => {
    setIsPinned(!isPinned);
    setIsSaleOpen(false);
    setIsStatOpen(false);
    setIsRuleOpen(false);
  };
  const toggleSale = () => {
    setIsSaleOpen(!isSaleOpen);
  };
  const toggleStat = () => {
    setIsStatOpen(!isStatOpen);
  };
  const toggleRule = () => {
    setIsRuleOpen(!isRuleOpen);
  };

  return (
    <div
      className={`sidebar col-md-2 col-sm-4 ${isPinned ? 'pinned' : ''}`}
      id="side_nav"
      style={{
        height: 'auto',
        minHeight: '100vh',
        width: isPinned ? '230px' : '60px',
        transition: 'width 0.3s',
      }}
    >
      <div className="h-5rem d-flex justify-content-between align-items-center">
        <h1 className="fs-4">
          <span
            className="text-white"
            style={{ display: isPinned ? 'inline' : 'none' }}
          >
            {/* BMart */}
          </span>
        </h1>
        <button className="btn text-white" onClick={togglePin}>
          {isPinned ? <FaAngleDoubleLeft /> : <FaAngleDoubleRight />}
        </button>
      </div>
      <hr className="h-color mx-2" style={{ color: 'white' }} />

      <ul
        className="list-unstyled px-2 gap-4"
        onMouseEnter={() => {
          setIsPinned(true);
        }}
      >
        <ProtectedComponent requiredRoles={['view_product-samples']}>
          <li className={pathname == '/product-sale' ? 'active' : ''}>
            <Link href="/product-sale" className="btn btn-sc">
              <div style={{ padding: '0.2rem 0' }}>
                <LuImport />
              </div>
              {isPinned && <text>Sản phẩm</text>}
            </Link>
          </li>
        </ProtectedComponent>
        <ProtectedComponent requiredRoles={['view_product-samples']}>
          <li className={pathname == '/cart' ? 'active' : ''}>
            <Link href="/cart" className="btn btn-sc">
              <div style={{ padding: '0.2rem 0' }}>
                <FaRegHandshake />
              </div>
              {isPinned && <text>Giỏ hàng</text>}
            </Link>
          </li>
        </ProtectedComponent>
        <ProtectedComponent requiredRoles={['view_orders']}>
          <li className={pathname == '/order-history' ? 'active' : ''}>
            <Link href="/order-history" className="btn btn-sc">
              <div style={{ padding: '0.2rem 0' }}>
                <FaWarehouse />
              </div>
              {isPinned && <text>Lịch sử</text>}
            </Link>
          </li>
        </ProtectedComponent>
      </ul>

      <hr className="h-color mx-2" />
    </div>
  );
}
