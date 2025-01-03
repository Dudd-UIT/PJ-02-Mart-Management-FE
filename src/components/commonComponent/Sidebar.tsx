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

export default function Sidebar() {
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
        <li>
          <div
            className={`btn btn-sc ${
              pathname.startsWith('/statistics') ? 'active' : ''
            }`}
            onClick={toggleStat}
          >
            <div style={{ padding: '0.2rem 0' }}>
              <IoStatsChart />
            </div>
            {isPinned && (
              <div
                style={{
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <text>Thống kê</text>{' '}
                {isStatOpen ? <FaAngleUp /> : <FaAngleDown />}
              </div>
            )}
          </div>
          {isStatOpen && (
            <ul className="list-unstyled ps-5 gap-4">
              <li className={pathname == '/statistics' ? 'active' : ''}>
                <Link href="/statistics" className="btn btn-sc">
                  {isPinned && (
                    <text className="small">Tổng quan hệ thống</text>
                  )}
                </Link>
              </li>
              <li className={pathname == '/statistics/revenue' ? 'active' : ''}>
                <Link href="/statistics/revenue" className="btn btn-sc">
                  {isPinned && <text className="small">Doanh thu</text>}
                </Link>
              </li>
              <li
                className={pathname == '/statistics/best-sale' ? 'active' : ''}
              >
                <Link href="/statistics/best-sale" className="btn btn-sc">
                  {isPinned && (
                    <text className="small">Sản phẩm thịnh hành</text>
                  )}
                </Link>
              </li>
              <li
                className={
                  pathname == '/statistics/order-statistics' ? 'active' : ''
                }
              >
                <Link
                  href="/statistics/order-statistics"
                  className="btn btn-sc"
                >
                  {isPinned && <text className="small">Thống kê đơn hàng</text>}
                </Link>
              </li>
            </ul>
          )}
        </li>
        <ProtectedComponent requiredRoles={['c_order', 'v_orders']}>
          <li>
            <div
              className={`btn btn-sc ${
                pathname.startsWith('/sale') ? 'active' : ''
              }`}
              onClick={toggleSale}
            >
              <div style={{ padding: '0.2rem 0' }}>
                <FaShoppingCart />
              </div>
              {isPinned && (
                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <text>Bán Hàng</text>{' '}
                  {isSaleOpen ? <FaAngleUp /> : <FaAngleDown />}
                </div>
              )}
            </div>
            {isSaleOpen && (
              <ul className="list-unstyled ps-5 gap-4">
                <ProtectedComponent requiredRoles={['c_order']}>
                  <li className={pathname == '/order/sale' ? 'active' : ''}>
                    <Link href="/order/sale" className="btn btn-sc">
                      {isPinned && <text className="small">Bán hàng</text>}
                    </Link>
                  </li>
                </ProtectedComponent>

                <ProtectedComponent requiredRoles={['v_orders']}>
                  <li className={pathname == '/order' ? 'active' : ''}>
                    <Link href="/order" className="btn btn-sc">
                      {isPinned && (
                        <text className="small">Quản lý hóa đơn</text>
                      )}
                    </Link>
                  </li>
                </ProtectedComponent>
              </ul>
            )}
          </li>
        </ProtectedComponent>
        <ProtectedComponent requiredRoles={['v_inbounds']}>
          <li className={pathname == '/inbound' ? 'active' : ''}>
            <Link href="/inbound" className="btn btn-sc">
              <div style={{ padding: '0.2rem 0' }}>
                <LuImport />
              </div>
              {isPinned && <text>Đơn nhập hàng</text>}
            </Link>
          </li>
        </ProtectedComponent>
        <ProtectedComponent requiredRoles={['v_sups']}>
          <li className={pathname == '/suppliers' ? 'active' : ''}>
            <Link href="/suppliers" className="btn btn-sc">
              <div style={{ padding: '0.2rem 0' }}>
                <FaRegHandshake />
              </div>
              {isPinned && <text>Nhà cung cấp</text>}
            </Link>
          </li>
        </ProtectedComponent>
        <ProtectedComponent requiredRoles={['v_batchs']}>
          <li className={pathname == '/warehouse' ? 'active' : ''}>
            <Link href="/warehouse" className="btn btn-sc">
              <div style={{ padding: '0.2rem 0' }}>
                <FaWarehouse />
              </div>
              {isPinned && <text>Kho hàng</text>}
            </Link>
          </li>
        </ProtectedComponent>
        <ProtectedComponent requiredRoles={['v_cus']}>
          <li className={pathname == '/customers' ? 'active' : ''}>
            <Link href="/customers" className="btn btn-sc">
              <div style={{ padding: '0.2rem 0' }}>
                <IoPeople />
              </div>
              {isPinned && <text>Khách hàng</text>}
            </Link>
          </li>
        </ProtectedComponent>
        <ProtectedComponent
          requiredRoles={[
            'v_pdtypes',
            'v_pdlines',
            'v_pdsams',
            'u_param',
            'v_groups',
            'v_staffs',
          ]}
        >
          <li>
            <div
              className={`btn btn-sc ${
                pathname.startsWith('/rule') ? 'active' : ''
              }`}
              onClick={toggleRule}
            >
              <div style={{ padding: '0.2rem 0' }}>
                <TbShieldStar />
              </div>
              {isPinned && (
                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <text>Quy định</text>{' '}
                  {isRuleOpen ? <FaAngleUp /> : <FaAngleDown />}
                </div>
              )}
            </div>
            {isRuleOpen && (
              <ul className="list-unstyled ps-5 gap-4">
                <ProtectedComponent requiredRoles={['v_pdtypes']}>
                  <li
                    className={pathname == '/rule/product-type' ? 'active' : ''}
                  >
                    <Link href="/rule/product-type" className="btn btn-sc">
                      {isPinned && <text className="small">Loại sản phẩm</text>}
                    </Link>
                  </li>
                </ProtectedComponent>
                <ProtectedComponent requiredRoles={['v_pdlines']}>
                  <li
                    className={pathname == '/rule/product-line' ? 'active' : ''}
                  >
                    <Link href="/rule/product-line" className="btn btn-sc">
                      {isPinned && <text className="small">Dòng sản phẩm</text>}
                    </Link>
                  </li>
                </ProtectedComponent>
                <ProtectedComponent requiredRoles={['v_pdsams']}>
                  <li
                    className={
                      pathname == '/rule/product-sample' ? 'active' : ''
                    }
                  >
                    <Link href="/rule/product-sample" className="btn btn-sc">
                      {isPinned && <text className="small">Mẫu sản phẩm</text>}
                    </Link>
                  </li>
                </ProtectedComponent>
                <ProtectedComponent requiredRoles={['u_param']}>
                  <li
                    className={
                      pathname == '/rule/point-convert' ? 'active' : ''
                    }
                  >
                    <Link href="/rule/point-convert" className="btn btn-sc">
                      {isPinned && <text className="small">Quy đổi điểm</text>}
                    </Link>
                  </li>
                </ProtectedComponent>
                <ProtectedComponent requiredRoles={['v_groups']}>
                  <li
                    className={pathname == '/rule/user-group' ? 'active' : ''}
                  >
                    <Link href="/rule/user-group" className="btn btn-sc">
                      {isPinned && (
                        <text className="small">Nhóm người dùng</text>
                      )}
                    </Link>
                  </li>
                </ProtectedComponent>
                <ProtectedComponent requiredRoles={['v_staffs']}>
                  <li className={pathname == '/rule/staff' ? 'active' : ''}>
                    <Link href="/rule/staff" className="btn btn-sc">
                      {isPinned && <text className="small">Nhân viên</text>}
                    </Link>
                  </li>
                </ProtectedComponent>
              </ul>
            )}
          </li>
        </ProtectedComponent>
      </ul>

      <hr className="h-color mx-2" />
    </div>
  );
}
