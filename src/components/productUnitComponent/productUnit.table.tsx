import { useSelectedProductUnits } from '@/context/selectedProductUnitsContext';
import {
  ProductUnitTableProps,
  ProductUnitTransform,
} from '@/types/productUnit';
import React from 'react';
import RowHighlight from '../nullComponent/RowHighlight';

function ProductUnitTable(props: ProductUnitTableProps) {
  const { columns, productUnits } = props;

  const { productUnitIds, setProductUnitIds } = useSelectedProductUnits();

  const handleCheckboxChange = (id: number) => {
    const isSelected = productUnitIds.includes(id);
    const updatedSelectedIds = isSelected
      ? productUnitIds.filter((selectedId) => selectedId !== id)
      : [...productUnitIds, id];

    setProductUnitIds(updatedSelectedIds);
  };

  return (
    <div className="container">
      <RowHighlight />
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col" className="text-center align-middle"></th>
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
              <td>
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={productUnitIds.includes(row.id)}
                  onChange={() => handleCheckboxChange(row.id)}
                />
              </td>
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

export default ProductUnitTable;
