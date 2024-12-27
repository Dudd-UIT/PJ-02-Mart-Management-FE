'use client';

import { Card } from '@/components/commonComponent/Card';
import {
  fetchInbounds,
  fetchRevenue,
  fetchOrders,
} from '@/services/statisticServices';
import useSWR from 'swr';

function StatisticsPage() {
  const date = new Date();
  const urlRevenue = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/statistics/revenue`;
  const { data: revenue } = useSWR([urlRevenue], () => fetchRevenue());
  const urlOrders = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/statistics/orders`;
  const { data: orders } = useSWR([urlOrders], () => fetchOrders());

  const urlInboundReceipts = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/statistics/inbound-cost`;
  const { data: inboundReceipt } = useSWR([urlInboundReceipts], () =>
    fetchInbounds(),
  );
  return (
    <>
      <h2>Dashboard</h2>
      <div>
        <hr className="mt-4" />
        <h4>Doanh thu</h4>
        <div className="d-flex justify-content-between pb-3">
          <Card title={`Ngày ${date.getDate()}`} data={revenue?.daily} />
          <Card
            title={`Tháng ${date.getMonth() + 1}`}
            data={revenue?.monthly}
          />
          <Card title={`Năm ${date.getFullYear()}`} data={revenue?.yearly} />
        </div>
      </div>
      <div>
        <hr className="mt-4" />
        <h4>Lượng đơn hàng</h4>
        <div className="d-flex justify-content-between pb-3">
          <Card title={`Ngày ${date.getDate()}`} data={orders?.daily} />
          <Card title={`Tháng ${date.getMonth() + 1}`} data={orders?.monthly} />
          <Card title={`Năm ${date.getFullYear()}`} data={orders?.yearly} />
        </div>
      </div>
      <div>
        <hr className="mt-4" />
        <div className="d-flex justify-content-between pb-3">
          <h4 className="col col-md-4">Tiền nhập hàng</h4>
          <h4 className="col col-md-4">Giá trị tồn kho</h4>
        </div>

        <div className="d-flex justify-content-between pb-3">
          <Card
            title={`Ngày ${date.getDate()}`}
            data={inboundReceipt?.daily}
            unit="VNĐ"
          />
          <Card
            title={`Năm ${date.getFullYear()}`}
            data={inboundReceipt?.yearly}
            unit="VNĐ"
          />
        </div>
      </div>
    </>
  );
}

export default StatisticsPage;
