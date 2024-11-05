import {
  ProductUnitTransform,
  SelectedProductUnitTableModalProps,
} from '@/types/productUnit';
import React from 'react';

function SelectedProductUnitTableModal(
  props: SelectedProductUnitTableModalProps,
) {
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
              {columns.map((column, colIndex) => (
                <td key={colIndex}>
                  {row[column.key as keyof ProductUnitTransform]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SelectedProductUnitTableModal;
