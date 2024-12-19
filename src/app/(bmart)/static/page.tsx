'use client';

import Card from '@/components/commonComponent/Card';

function StatisticsPage() {
  const d = new Date();
  console.log(d);
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
          <Card title={`Ngày ${d.getDate()}`} data={12345} unit='VNĐ' />
          <Card
            title={`Năm ${d.getFullYear()}`}
            unit='VNĐ'
          />
        </div>
      </div>
    </>
  );
}

export default StatisticsPage;
