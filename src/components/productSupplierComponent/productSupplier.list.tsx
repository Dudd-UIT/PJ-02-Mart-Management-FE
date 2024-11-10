'use client';

import { useSelectedProductUnits } from '@/context/selectedProductUnitsContext';
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import ProductUnitTable from '../productUnitComponent/productUnit.table';
import {
  ProductSupplierModalProps,
  ProductUnit,
  ProductUnitTransform,
} from '@/types/productUnit';
import { sendRequest } from '@/utils/api';
import useSWR from 'swr';
import { Input } from '../commonComponent/InputForm';

const columns: Column<ProductUnitTransform>[] = [
  { title: 'ID', key: 'id' },
  { title: 'Tên sản phẩm', key: 'productSampleName' },
  { title: 'Đơn vị', key: 'unitName' },
  { title: 'Khối lượng', key: 'volumne' },
  { title: 'Tỷ lệ chuyển đổi', key: 'conversion_rate' },
  // { title: 'Giá bán', key: 'sell_price' },
];

const fetchProductUnits = async (
  url: string,
  current: number,
  pageSize: number,
  searchName?: string,
  searchCategory?: string,
) => {
  const queryParams: { [key: string]: any } = {
    current,
    pageSize,
  };

  if (searchName) queryParams.name = searchName;
  if (searchCategory) queryParams.productLine = searchCategory;

  try {
    const res = await sendRequest<IBackendRes<any>>({
      url,
      method: 'GET',
      queryParams,
      nextOption: {
        next: { tags: ['list-productUnits'] },
      },
    });

    if (res?.data) {
      return res.data;
    } else {
      throw new Error("Data format error: 'data' field is missing.");
    }
  } catch (error) {
    console.error('Fetch productSamples failed:', error);
    throw error;
  }
};

function ProductSupplierModal(props: ProductSupplierModalProps) {
  const {
    isProductSupplierModalOpen,
    setIsProductSupplierModalOpen,
    selectedProductUnitIds,
    onSelectedProductUnitsChange,
  } = props;

  const { productUnitIds, setProductUnitIds } = useSelectedProductUnits();
  const [searchName, setSearchName] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [searchParams, setSearchParams] = useState({ name: '', category: '' });
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // useEffect(() => {
  //   if (selectedProductUnitIds) {
  //     setProductUnitIds(selectedProductUnitIds);
  //   }
  // }, [selectedProductUnitIds]);

  // Trigger data re-fetch whenever `searchParams` or pagination parameters change
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/product-units`;
  const { data, error, mutate } = useSWR(
    [url, current, pageSize, searchParams.name, searchParams.category],
    () =>
      fetchProductUnits(
        url,
        current,
        pageSize,
        searchParams.name,
        searchParams.category,
      ),
  );

  if (error)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div>Failed to load suppliers: {error.message}</div>
      </div>
    );

  if (!data)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-grow text-success" role="status"></div>
        <span className="sr-only text-success">Loading...</span>
      </div>
    );

  const productUnits = data.results.map((item: ProductUnit) => ({
    id: item.id,
    sell_price: item.sell_price,
    conversion_rate: item.conversion_rate,
    createdAt: item.createdAt,
    volumne: item.volumne,
    productSampleName: item.productSample?.name,
    unitName: item.unit?.name,
  }));

  const meta: MetaData = {
    current,
    pageSize,
    pages: data.meta.pages,
    total: data.meta.total,
  };

  const handleCloseProductUnitListModal = () => {
    setIsProductSupplierModalOpen(false);
  };

  const handleSave = () => {
    onSelectedProductUnitsChange?.(productUnitIds);
    setIsProductSupplierModalOpen(false);
  };

  const handlePreviousPage = () => {
    if (current > 1) setCurrent(current - 1);
  };

  const handleNextPage = () => {
    if (current < meta.pages) setCurrent(current + 1);
  };

  const handleSearchClick = () => {
    setSearchParams({ name: searchName, category: searchCategory });
    setCurrent(1); // Reset to the first page when new search is triggered
  };

  return (
    <Modal
      backdrop="static"
      show={isProductSupplierModalOpen}
      onHide={handleCloseProductUnitListModal}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Chọn sản phẩm</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* 2 button search */}
        <Form>
          <div className="row mb-3">
            <div className="col-md-4">
              <Input
                title="Tên sản phẩm"
                size={12}
                value={searchName}
                placeholder="Nhập tên sản phẩm"
                onChange={(value) => setSearchName(value)}
                onClickIcon={handleSearchClick}
                icon={<FaSearch />}
              />
            </div>
            <div className="col-md-4">
              <Input
                title="Dòng sản phẩm"
                value={searchCategory}
                size={12}
                placeholder="Nhập dòng sản phẩm"
                onChange={(value) => setSearchCategory(value)}
                onClickIcon={handleSearchClick}
                icon={<FaSearch />}
              />
            </div>
          </div>
        </Form>
        {/* ProductUnit Table */}
        <ProductUnitTable columns={columns} productUnits={productUnits} />
        {/* Navigate Control */}
        <nav aria-label="Page navigation example" className="mt-3">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${current === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={handlePreviousPage}>
                Previous
              </button>
            </li>
            {Array.from({ length: meta.pages }, (_, index) => (
              <li
                key={index}
                className={`page-item ${current === index + 1 ? 'active' : ''}`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrent(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${
                current === meta.pages ? 'disabled' : ''
              }`}
            >
              <button className="page-link" onClick={handleNextPage}>
                Next
              </button>
            </li>
          </ul>
        </nav>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleCloseProductUnitListModal}>
          Thoát
        </Button>
        <Button className="btn-primary" onClick={handleSave}>
          Lưu
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ProductSupplierModal;
