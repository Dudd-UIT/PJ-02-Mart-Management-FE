// SupplierTable Component
import { FaEye } from 'react-icons/fa';
import { HiOutlineTrash } from 'react-icons/hi2';
import { useState } from 'react';
import {
  ProductLine,
  ProductLineTableType,
  ProductLineTransform,
} from '@/types/productLine';
import DeleteProductLineModal from './productLine.delete';
import UpdateProductLineModal from './productLine.update';

const ProductLineTable = (props: ProductLineTableType) => {
  const { productLines, columns, onMutate } = props;
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedProductLine, setSelectedProductLine] = useState<
    ProductLineTransform | undefined
  >();

  const handleOpenUpdateModal = (productLine: ProductLineTransform) => {
    setSelectedProductLine(productLine);
    setIsUpdateModalOpen(true);
  };

  const handleOpenDeleteModal = (productLine: ProductLineTransform) => {
    setSelectedProductLine(productLine);
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
                Chức năng
              </th>
            </tr>
          </thead>
          <tbody>
            {productLines?.map((row, rowIndex) => (
              <tr key={rowIndex} className="text-center align-middle">
                {columns.map((column, colIndex) => (
                  <td key={colIndex}>
                    {column.render
                      ? column.render(row)
                      : row[column.key as keyof ProductLineTransform]}
                  </td>
                ))}
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

      <UpdateProductLineModal
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        data={selectedProductLine}
        setData={setSelectedProductLine}
        onMutate={onMutate}
      />
      <DeleteProductLineModal
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        data={selectedProductLine}
        onMutate={onMutate}
      />
    </>
  );
};

export default ProductLineTable;
