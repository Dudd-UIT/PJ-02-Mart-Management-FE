import { SelectedProductSampleUnitTableProps } from '@/types/productSample';
import { ProductUnitTransform } from '@/types/productUnit';
import React from 'react';
import { HiOutlineTrash } from 'react-icons/hi2';

function SelectedProductSampleUnitTable(
  props: SelectedProductSampleUnitTableProps,
) {
  const { columns, productSampleUnits, onDeleteUnit } = props;

  const getImageName = (cellData: string | File) => {
    if (typeof cellData === 'object' && cellData instanceof File) {
      return cellData.name;
    }
    return cellData;
  };

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
            <th scope="col" className="text-center align-middle">
              Xóa
            </th>
          </tr>
        </thead>
        <tbody>
          {productSampleUnits?.map((row, rowIndex) => (
            <tr key={rowIndex} className="text-center align-middle">
              {columns.map((column, colIndex) => {
                const cellData = row[column.key as keyof ProductUnitTransform];
                const conversionRate = row[`conversionRate`];
                const compareUnitName = row[`compareUnitName`];

                if (column.key === 'unitName') {
                  return (
                    <td key={colIndex}>
                      {cellData}{' '}
                      {conversionRate && compareUnitName
                        ? `(${conversionRate} ${compareUnitName})`
                        : ''}
                    </td>
                  );
                }

                if (column.key === 'image') {
                  return <td key={colIndex}>{getImageName(cellData)}</td>;
                }
                
                return <td key={colIndex}>{cellData}</td>;
              })}
              <td>
                <button onClick={() => onDeleteUnit(row.id)}>
                  <HiOutlineTrash size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SelectedProductSampleUnitTable;
