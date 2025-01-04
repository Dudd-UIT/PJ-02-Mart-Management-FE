import React, { useState } from 'react';
import { RevenueChartData } from '@/types/commonType';
import { formatCurrency } from '@/utils/format';
import { downloadExcel } from '@/utils/downloadExcel';

interface RevenueTableProps {
  data: RevenueChartData[];
}

const RevenueTable: React.FC<RevenueTableProps> = ({ data }) => {
  const [highlight, setHighlight] = useState(false);

  const toggleHighlight = (): void => {
    setHighlight(!highlight);
  };

  const handleExport = (): void => {
    const formattedData = data.map(row => ({
      'Thời gian': row.time,
      'Chi nhập hàng': formatCurrency(row.expense),
      'Thu bán hàng': formatCurrency(row.income),
      'Lợi nhuận': formatCurrency(row.income - row.expense), // Thêm cột "Lợi nhuận"
    }));
    downloadExcel(formattedData);
  };

  return (
    <div>
      <div
        className="controls-container"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <button onClick={handleExport} className="btn btn-primary">
          Xuất số liệu
        </button>
        <div className="form-check form-check-reverse">
          <input
            className="form-check-input"
            type="checkbox"
            id="flexCheckDefault"
            onChange={toggleHighlight}
          />
          <label className="form-check-label" htmlFor="flexCheckDefault">
            Đánh dấu lợi nhuận âm
          </label>
        </div>
        
      </div>
      <div
        style={{
          maxHeight: '300px',
          overflowY: 'auto',
          paddingLeft: 2,
          paddingRight: 2,
        }}
      >
        <table className="table">
          <thead>
            <tr className="text-center align-middle">
              <th>Thời gian</th>
              <th>Chi nhập hàng</th>
              <th>Thu bán hàng</th>
              <th>Lợi nhuận</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => {
              const profit = row.income - row.expense;
              return (
                <tr
                  key={index}
                  className={`text-center align-middle ${
                    highlight && profit < 0 ? 'highlight' : ''
                  }`}
                  style={{
                    backgroundColor: highlight && profit < 0 ? 'red' : 'white',
                  }}
                >
                  <td>{row.time}</td>
                  <td>{formatCurrency(row.expense)}</td>
                  <td>{formatCurrency(row.income)}</td>
                  <td>{formatCurrency(profit)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RevenueTable;
