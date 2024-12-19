'use client';

import Card from '@/components/commonComponent/Card';
import { useStaticContext } from '@/context/staticContext';

function StaticPage() {
  const d = new Date();
  console.log(d);
  const { totalValue, totalSale } = useStaticContext();
  return (
    <>
      <h2>Dashboard tổng quan</h2>
      <div>
        <hr className="mt-4" />
        <h4>Doanh thu</h4>
        <div className="d-flex justify-content-between pb-3">
          <Card title={`Ngày ${d.getDate()}`} />
          <Card title={`Tháng ${d.getMonth() + 1}`} />
          <Card title={`Năm ${d.getFullYear()}`} />
        </div>
      </div>
      <div>
        <hr className="mt-4" />
        <h4>Lượng đơn hàng</h4>
        <div className="d-flex justify-content-between pb-3">
          <Card title={`Ngày ${d.getDate()}`} />
          <Card title={`Tháng ${d.getMonth() + 1}`} />
          <Card title={`Năm ${d.getFullYear()}`} />
        </div>
      </div>
      <div>
        <hr className="mt-4" />
        <div className="d-flex justify-content-between pb-3">
          <h4 className="col col-md-4">Tiền nhập hàng</h4>
          <h4 className="col col-md-4">Giá trị tồn kho</h4>
        </div>

        <div className="d-flex justify-content-between pb-3">
          <Card title={`Ngày ${d.getDate()}`} />
          <Card
            title={`Năm ${d.getFullYear()}`}
            data={totalValue ? totalValue : 0}
          />
        </div>
      </div>
    </>
  );
}

export default StaticPage;
