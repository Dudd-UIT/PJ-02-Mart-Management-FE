import {
  ProductUnitTransform,
  SelectedProductUnitTableProps,
} from '@/types/productUnit';
import React from 'react';

function SelectedProductUnitModal(props: SelectedProductUnitTableProps) {
  const { columns, productUnits } = props;

  return (
    <div className="container">
      <table className="table table-hover">
        <thead>
          <tr>
            {columns?.map((column, index) => (
              <th key={index} scope="col" className="text-center align-middle">
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {productUnits?.map((row, rowIndex) => (
            <tr key={rowIndex} className="text-center align-middle">
              {columns.map((column, colIndex) => {
                const value = row[column.key as keyof ProductUnitTransform];

                // Kiểm tra kiểu dữ liệu trước khi hiển thị
                let content: React.ReactNode;

                if (typeof value === 'string' || typeof value === 'number') {
                  content = value; // Render trực tiếp nếu là string hoặc number
                } else if (value instanceof File) {
                  content = value.name; // Render tên file nếu là File
                } else if (value === undefined || value === null) {
                  content = ''; // Xử lý nếu giá trị undefined hoặc null
                } else {
                  content = JSON.stringify(value); // Render chuỗi JSON nếu không rõ kiểu
                }

                return <td key={colIndex}>{content}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SelectedProductUnitModal;
