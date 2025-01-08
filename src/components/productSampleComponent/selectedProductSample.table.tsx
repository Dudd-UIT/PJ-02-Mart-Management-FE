import { SelectedProductSampleUnitTableProps } from '@/types/productSample';
import { ProductUnitTransform } from '@/types/productUnit';
import React, { useState } from 'react';
import { FaEye } from 'react-icons/fa';
import { HiOutlineTrash } from 'react-icons/hi2';
import UpdateProductSampleUnitModal from '../productSampleUnitComponent/productSampleUnit.update';

function SelectedProductSampleUnitTable(
  props: SelectedProductSampleUnitTableProps,
) {
  const {
    columns,
    productSampleUnits,
    productSampleData,
    onUpdateUnit,
    onDeleteUnit,
  } = props;
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [selectedProductUnit, setSelectedProductUnit] = useState<
    ProductUnitTransform | undefined
  >();
  const getImageName = (cellData: string | File) => {
    if (typeof cellData === 'object' && cellData instanceof File) {
      return cellData.name;
    }
    return cellData;
  };

  const handleUpdateProductUnit = (productUnit: ProductUnitTransform) => {
    setSelectedProductUnit(productUnit);
    setIsUpdateModalOpen(true);
  };

  return (
    <>
      <div className="container">
        <table className="table table-hover">
          <thead>
            <tr>
              {columns?.map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  className="text-center align-middle"
                >
                  {column.title}
                </th>
              ))}
              <th scope="col" className="text-center align-middle">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {productSampleUnits?.map((row, rowIndex) => (
              <tr key={rowIndex} className="text-center align-middle">
                {columns.map((column, colIndex) => {
                  const cellData =
                    row[column.key as keyof ProductUnitTransform];
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
                  <button onClick={() => handleUpdateProductUnit(row)}>
                    <FaEye size={18} />
                  </button>
                  <button onClick={() => onDeleteUnit(row.id)}>
                    <HiOutlineTrash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <UpdateProductSampleUnitModal
        isProductSampleUnitsModalOpen={isUpdateModalOpen}
        setIsProductSampleUnitsModalOpen={setIsUpdateModalOpen}
        productSampleData={productSampleData}
        productUnitData={selectedProductUnit}
        onUpdateUnit={(updatedUnit) => {
          onUpdateUnit?.(updatedUnit);
          setIsUpdateModalOpen(false);
        }}
        setData={setSelectedProductUnit}
      />
    </>
  );
}

export default SelectedProductSampleUnitTable;
