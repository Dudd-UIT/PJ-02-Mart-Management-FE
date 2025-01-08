import { FaEye } from 'react-icons/fa';
import { HiOutlineTrash } from 'react-icons/hi2';
import { useState } from 'react';
import { ProductType, ProductTypeTableType } from '@/types/productType';
import DeleteProductTypeModal from './productType.delete';
import UpdateProductTypeModal from './productType.update';
import ProtectedComponent from '../commonComponent/ProtectedComponent';

const ProductTypeTable = (props: ProductTypeTableType) => {
  const { productTypes, columns, onMutate } = props;
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedProductType, setSelectedProductType] = useState<
    ProductType | undefined
  >();

  const handleOpenUpdateModal = (productType: ProductType) => {
    setSelectedProductType(productType);
    setIsUpdateModalOpen(true);
  };

  const handleOpenDeleteModal = (productType: ProductType) => {
    setSelectedProductType(productType);
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
              <ProtectedComponent requiredRoles={['v_pdtypes', 'd_pdtype']}>
                <th scope="col" className="text-center align-middle">
                  Thao tác
                </th>
              </ProtectedComponent>
            </tr>
          </thead>
          <tbody>
            {productTypes?.map((row, rowIndex) => (
              <tr key={rowIndex} className="text-center align-middle">
                {columns.map((column, colIndex) => (
                  <td key={colIndex}>{row[column.key as keyof ProductType]}</td>
                ))}
                <ProtectedComponent requiredRoles={['v_pdtypes', 'd_pdtype']}>
                  <td>
                    <ProtectedComponent requiredRoles={['v_pdtypes']}>
                      <button onClick={() => handleOpenUpdateModal(row)}>
                        <FaEye size={18} />
                      </button>
                    </ProtectedComponent>
                    <ProtectedComponent requiredRoles={['d_pdtype']}>
                      <button onClick={() => handleOpenDeleteModal(row)}>
                        <HiOutlineTrash size={18} />
                      </button>
                    </ProtectedComponent>
                  </td>
                </ProtectedComponent>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <UpdateProductTypeModal
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        data={selectedProductType}
        setData={setSelectedProductType}
        onMutate={onMutate}
      />
      <DeleteProductTypeModal
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        data={selectedProductType}
        onMutate={onMutate}
      />
    </>
  );
};

export default ProductTypeTable;
