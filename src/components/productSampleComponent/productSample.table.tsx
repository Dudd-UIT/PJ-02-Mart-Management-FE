import { FaEye } from 'react-icons/fa';
import { HiOutlineTrash } from 'react-icons/hi2';
import { useState } from 'react';
import UpdateProductSampleModal from './productSample.update';
import DeleteProductSampleModal from './productSample.delete';
import {
  ProductSample,
  ProductSampleUnitTableType,
} from '@/types/productSample';
import { ProductLine } from '@/types/productLine';

const ProductSampleUnitTable = (props: ProductSampleUnitTableType) => {
  const { productUnits, columns, onMutate } = props;
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const [selectedProductUnit, setSelectedProductUnit] = useState<
    ProductSample | undefined
  >();

  const handleOpenUpdateModal = (productUnit: ProductSample) => {
    setSelectedProductUnit(productUnit);
    setIsUpdateModalOpen(true);
  };

  const handleOpenDeleteModal = (productUnit: ProductSample) => {
    setSelectedProductUnit(productUnit);
    setIsDeleteModalOpen(true);
  };

  return (
    <>
      <div className="container">
        <table className="table table-hover">
          <thead>
            <tr>
              {columns.map((column, index) => (
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
            {productUnits?.map((row, rowIndex) => (
              <tr key={rowIndex} className="text-center align-middle">
                {columns.map((column, colIndex) => {
                  const cellData = row[column.key as keyof ProductSample];

                  const formattedData = Array.isArray(cellData)
                    ? cellData.map((item) => item.id || item.id).join(', ')
                    : typeof cellData === 'object' && cellData !== null
                    ? (cellData as ProductLine).name
                    : cellData;

                  return <td key={colIndex}>{formattedData}</td>;
                })}
                <td>
                  <button onClick={() => handleOpenUpdateModal(row)}>
                    <FaEye size={18} />
                  </button>
                  <button onClick={() => handleOpenDeleteModal(row)}>
                    <HiOutlineTrash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <UpdateProductSampleModal
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        data={selectedProductUnit}
        setData={setSelectedProductUnit}
        onMutate={onMutate}
      />
      <DeleteProductSampleModal
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        data={selectedProductUnit}
        onMutate={onMutate}
      />
    </>
  );
};

export default ProductSampleUnitTable;
