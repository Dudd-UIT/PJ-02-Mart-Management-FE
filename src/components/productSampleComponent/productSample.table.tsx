import { FaEye } from 'react-icons/fa';
import { HiOutlineTrash } from 'react-icons/hi2';
import { useState } from 'react';
import { ProductSample, ProductSampleTableType, ProductSampleTransform } from '@/types/productSample';
import React from 'react';
import UpdateProductSampleModal from './productSample.update';
import DeleteProductSampleModal from './productSample.delete';

const ProductSampleTable = (props: ProductSampleTableType) => {
  const { productSamples, columns, onMutate } = props;
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedProductSample, setSelectedProductSample] = useState<
    ProductSampleTransform>();


  const groupByProductLine = (samples?: ProductSampleTransform[]) => {
    if (!samples || samples.length === 0) {
      return {};
    }
    return samples.reduce((acc, sample) => {
      const productLine = sample.productLineName;
      if (!acc[productLine]) {
        acc[productLine] = [];
      }
      acc[productLine].push(sample);
      return acc;
    }, {} as Record<string, ProductSampleTransform[]>);
  };

  const groupedProductSamples = groupByProductLine(productSamples);

  const handleOpenUpdateModal = (productSampleTransform: ProductSampleTransform) => {
    console.log("selectedProductSample:::", productSampleTransform);
    setSelectedProductSample(productSampleTransform);
    setIsUpdateModalOpen(true);
  };

  const handleOpenDeleteModal = (productSampleTransform: ProductSampleTransform) => {
    setSelectedProductSample(productSampleTransform);
    setIsDeleteModalOpen(true);
  };

  const renderEmptyState = () => (
    <div className="container">
      <table className="table">
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
      </table>
      <div className="text-center py-4 text-muted">
        Không có sản phẩm nào
      </div>
    </div>
  );
  if (!productSamples) {
    return renderEmptyState();
  }

  if (productSamples.length === 0) {
    return renderEmptyState();
  }

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
          {Object.keys(groupedProductSamples).map((productLine, groupIndex) => (
            <React.Fragment key={groupIndex}>
              {/* Dòng tiêu đề nhóm cho mỗi dòng sản phẩm */}
              <tr className="table-secondary">
                <td colSpan={columns.length + 1} className="text-start fw-bold">
                  Dòng sản phẩm: {productLine}
                </td>
              </tr>
              {/* Các sản phẩm trong nhóm */}
              {groupedProductSamples[productLine].map((row, rowIndex) => (
                <tr key={rowIndex} className="text-center align-middle">
                  {columns.map((column, colIndex) => (
                    <td key={colIndex}>{row[column.key as keyof ProductSampleTransform]}</td>
                  ))}
                  <td>
                    <button className="btn btn-sm" onClick={() => handleOpenUpdateModal(row)}>
                      <FaEye size={18} />
                    </button>
                    <button className="btn btn-sm" onClick={() => handleOpenDeleteModal(row)}>
                      <HiOutlineTrash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
          </tbody>
        </table>
      </div>

      <UpdateProductSampleModal
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        data={selectedProductSample}
        onMutate={onMutate}
      />
      <DeleteProductSampleModal
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        data={selectedProductSample}
        onMutate={onMutate}
      />
    </>
  );
};

export default ProductSampleTable;
