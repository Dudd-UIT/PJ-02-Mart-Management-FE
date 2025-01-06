'use client';
import { fetchBatchs } from '@/services/batchServices';
import { useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import WarehouseTable from '@/components/warehouseComponent/warehouse.table';
import { Batch, BatchGrouped } from '@/types/batch';
import { fetchProductUnits } from '@/services/productUnitServices';
import { Product } from '@/types/productUnit';
import { GroupedProductData } from '@/types/commonType';
import { Input } from '@/components/commonComponent/InputForm';
import {
  FaSearch,
  FaEye,
  FaEyeDropper,
  FaFilter,
  FaPlus,
} from 'react-icons/fa';
import './style.css';
import { RiEyeCloseLine, RiEyeFill } from 'react-icons/ri';
import Link from 'next/link';
import withRoleAuthorization from '@/hoc/withRoleAuthorization';

function WarehousePage() {
  const current = 1;
  const pageSize = 100;
  const [level, setLevel] = useState(1);
  const [showOption, setShowOption] = useState(0);
  const [searchSample, setSearchSample] = useState('');
  const [searchType, setSearchType] = useState('');
  const [searchLine, setSearchLine] = useState('');
  const [searchQuantity, setSearchQuantity] = useState('');
  const [searchExpDate, setSearchExpDate] = useState('');
  const [searchProductUnitParams, setSearchProductUnitParams] = useState({
    name: '',
    productTypeName: '',
    productLineName: '',
  });
  const [searchBatchParams, setSearchBatchParams] = useState({
    quantity: '',
    expDate: '',
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const columnsBatch: Column<BatchGrouped>[] = [
    { title: '#', key: 'id' },
    { title: 'Mã đơn nhập', key: 'inboundReceiptId' },
    { title: 'Giá nhập', key: 'inboundPrice' },
    { title: 'Giá bán', key: 'sellPrice' },
    { title: 'Giảm giá', key: 'discount' },
    { title: 'Tồn', key: 'inventQuantity' },
    { title: 'Nhập', key: 'inboundQuantity' },
    { title: 'HSD', key: 'expiredAt' },
    { title: 'Đơn vị', key: 'unit' },
  ];

  const { data, error } = useSWR([current, pageSize], async () => {
    const [batchData, productUnitsData] = await Promise.all([
      fetchBatchs(
        current,
        pageSize,
        searchBatchParams.quantity,
        searchBatchParams.expDate,
      ), // Fetch batches
      fetchProductUnits(
        current,
        pageSize,
        searchProductUnitParams.name,
        undefined,
        searchProductUnitParams.productLineName,
        searchProductUnitParams.productTypeName,
      ), // Fetch product units
    ]);

    return { batchData, productUnitsData }; // Combine both results
  });

  if (error)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div>{error.message}</div>
      </div>
    );

  if (!data)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-grow text-success" role="status"></div>
        <span className="sr-only text-success">Loading...</span>
      </div>
    );

  const groupedProductData = groupProductData(data.productUnitsData.results);
  const groupedBatchData = groupBatch(data.batchData.results);

  const totalValue = getWarehouseValue(groupedBatchData);

  console.log('Tổng giá trị kho hàng:', totalValue);

  const handleSearchClick = () => {
    setSearchProductUnitParams({
      name: searchSample,
      productTypeName: searchType,
      productLineName: searchLine,
    });
    setSearchBatchParams({ quantity: searchQuantity, expDate: searchExpDate });
  };

  const onMutate = () => mutate(['', current, pageSize]);

  function convertISOString(dateString: string) {
    const date = new Date(dateString);
    return date.toISOString();
  }

  return (
    <>
      <div className="col col-md-9">
        <div className="row mb-3">
          <Input
            title="Mẫu sản phẩm"
            size={6}
            value={searchSample}
            placeholder="Nhập mẫu sản phẩm"
            onChange={(value) => setSearchSample(value)}
            onClickIcon={handleSearchClick}
            icon={<FaSearch />}
          />
          <Input
            title="Mức độ phân loại"
            value={level}
            size={6}
            onSelectedChange={(value) => {
              setLevel(value);
            }}
            // onClickIcon={handleSearchClick}
            icon={<FaFilter />}
            options={[
              { label: 'Loại sản phẩm', value: 1 },
              { label: 'Dòng sản phẩm', value: 2 },
              { label: 'Mẫu sản phẩm', value: 3 },
            ]}
            keyObj="value"
            showObj="label"
          />
        </div>
        <div className="row mb-3">
          <div className="col col-md-8">
            <div className="row mb-3">
              <Input
                title="Loại sản phẩm"
                size={6}
                value={searchType}
                placeholder="Chọn"
                onChange={(value) => setSearchType(value)}
                onClickIcon={handleSearchClick}
                icon={<FaSearch />}
              />
              <Input
                title="Dòng sản phẩm"
                value={searchLine}
                size={6}
                placeholder="Chọn"
                onChange={(value) => setSearchLine(value)}
                onClickIcon={handleSearchClick}
                icon={<FaSearch />}
              />
            </div>
            <div className="row mb-3">
              <Input
                title="Số lượng tồn"
                size={6}
                value={searchQuantity}
                placeholder="Chọn"
                onChange={(value) => setSearchQuantity(value)}
                onClickIcon={handleSearchClick}
                icon={<FaSearch />}
              />
              <Input
                title="Hạn sử dụng"
                value={searchExpDate.split('T')[0]}
                size={6}
                type="date"
                placeholder="Chọn"
                onChange={(value) => setSearchExpDate(convertISOString(value))}
                onClickIcon={handleSearchClick}
                icon={<FaSearch />}
              />
            </div>
          </div>
          <div className="col col-md-4 d-flex flex-column">
            <label>Hiển thị nhanh</label>
            <div
              className="btn-group-vertical my-2"
              role="group"
              aria-label="Vertical button group"
            >
              <span className="d-flex justify-content-between w-100 align-items-center border rounded-top ps-2">
                <div className="mb-0">Lô sắp hết hạn sử dụng</div>
                {showOption == 1 ? (
                  <button
                    type="button"
                    className="btn btn-group-custom  btn-group-custom-selected"
                    style={{ borderTopRightRadius: '0.375rem' }}
                    onClick={() => {
                      setShowOption(0);
                    }}
                  >
                    <RiEyeFill />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-group-custom"
                    style={{ borderTopRightRadius: '0.375rem' }}
                    onClick={() => {
                      setShowOption(1);
                    }}
                  >
                    <RiEyeCloseLine />
                  </button>
                )}
              </span>
              <span className="d-flex justify-content-between w-100 align-items-center border-start border-end ps-2">
                <div className="mb-0">Mẫu SP sắp hết hàng</div>
                {showOption == 2 ? (
                  <button
                    type="button"
                    className="btn btn-group-custom  btn-group-custom-selected"
                    onClick={() => {
                      setShowOption(0);
                    }}
                  >
                    <RiEyeFill />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-group-custom"
                    onClick={() => {
                      setShowOption(2);
                    }}
                  >
                    <RiEyeCloseLine />
                  </button>
                )}
              </span>
              <span className="d-flex justify-content-between w-100 align-items-center border rounded-bottom ps-2">
                <div className="mb-0">Hàng mới nhập kho</div>
                {showOption == 3 ? (
                  <button
                    type="button"
                    className="btn btn-group-custom  btn-group-custom-selected"
                    style={{ borderBottomRightRadius: '0.375rem' }}
                    onClick={() => {
                      setShowOption(0);
                    }}
                  >
                    <RiEyeFill />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-group-custom"
                    style={{ borderBottomRightRadius: '0.375rem' }}
                    onClick={() => {
                      setShowOption(3);
                    }}
                  >
                    <RiEyeCloseLine />
                  </button>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Button thêm */}
      <div className="d-flex justify-content-end my-3">
        <Link
          className="btn d-flex align-items-center btn-primary"
          href={'/inbound'}
          // onClick={() => setIsCreateModalOpen(true)}
        >
          <FaPlus className="align-middle" />
          <text>Nhập lô</text>
        </Link>
      </div>

      {data && (
        <WarehouseTable
          level={level}
          product={groupedProductData}
          batches={groupedBatchData}
          columnsBatch={columnsBatch}
        />
      )}
    </>
  );
}

export default withRoleAuthorization(WarehousePage, ['v_batchs']);

function groupProductData(data: Product[]) {
  const result: GroupedProductData = {};

  data.forEach((item) => {
    const typeName = item?.productSample?.productLine?.productType?.name;
    const lineName = item?.productSample?.productLine?.name;
    const sampleData = {
      id: item.productSample.id,
      name: item.productSample.name,
      description: item.productSample.description,
      sellPrice: item.sellPrice,
      // unit: item.unit.name,
      image: item.image,
    };

    if (!result[typeName]) {
      result[typeName] = {};
    }

    if (!result[typeName][lineName]) {
      result[typeName][lineName] = [];
    }

    result[typeName][lineName].push(sampleData);
  });

  return result;
}

function groupBatch(results: Batch[]): BatchGrouped[] {
  return results.map((item) => ({
    id: item.id,
    inboundPrice: item.inboundPrice,
    sellPrice: item.sellPrice ?? 0,
    discount: item.discount,
    inventQuantity: item.inventQuantity,
    inboundQuantity: item.inboundQuantity,
    expiredAt: new Date(item.expiredAt).toISOString(),
    inboundReceiptId: item.inboundReceipt?.id ?? 0,
    unit: item.productUnit.unit?.name || '',
    productSample: item.productUnit.productSample?.name || '',
  }));
}

function getWarehouseValue(data: BatchGrouped[]) {
  return data.reduce(
    (total, item) => total + item.inboundPrice * item.inventQuantity,
    0,
  );
}
