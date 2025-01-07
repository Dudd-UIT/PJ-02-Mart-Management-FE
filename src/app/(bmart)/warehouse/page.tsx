'use client';

import { fetchBatches } from '@/services/batchServices';
import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import WarehouseTable from '@/components/warehouseComponent/warehouse.table';
import { Batch, BatchGrouped } from '@/types/batch';
import { fetchProductUnits } from '@/services/productUnitServices';
import { Product } from '@/types/productUnit';
import { GroupedProductData } from '@/types/commonType';
import { Input } from '@/components/commonComponent/InputForm';
import { FaSearch, FaFilter, FaPlus } from 'react-icons/fa';
import './style.css';
import { RiEyeCloseLine, RiEyeFill } from 'react-icons/ri';
import Link from 'next/link';
import withRoleAuthorization from '@/hoc/withRoleAuthorization';
import { fetchProductTypes } from '@/services/productTypeServices';
import { fetchProductLines } from '@/services/productLineServices';
import { formatCurrency } from '@/utils/format';

function WarehousePage() {
  const current = 1;
  const pageSize = 100;
  const [level, setLevel] = useState(1);
  const [showOption, setShowOption] = useState(0);
  const [searchSample, setSearchSample] = useState('');
  const [searchProductTypeId, setSearchProductTypeId] = useState<number>(0);
  const [searchProductLineId, setSearchProductLineId] = useState<number>(0);
  const [searchQuantity, setSearchQuantity] = useState('');
  const [searchExpDate, setSearchExpDate] = useState('');
  const [searchProductUnitParams, setSearchProductUnitParams] = useState({
    name: '',
    productTypeId: 0,
    productLineId: 0,
  });
  const [searchBatchParams, setSearchBatchParams] = useState({
    quantity: '',
    expDate: '',
  });

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

  const urlFetchBatches = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/batchs`;
  const { data: batchesData, error: batchesError } = useSWR(
    [
      urlFetchBatches,
      current,
      pageSize,
      searchBatchParams.quantity,
      searchBatchParams.expDate,
      showOption,
    ],
    () =>
      fetchBatches(current, pageSize, showOption, searchQuantity, searchExpDate),
  );

  const urlFetchProductUnits = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/product-units`;
  const { data: productUnitsData, error: productUnitsError } = useSWR(
    [
      urlFetchProductUnits,
      current,
      pageSize,
      searchProductUnitParams.name,
      searchProductLineId,
      searchProductTypeId,
      showOption,
    ],
    () =>
      fetchProductUnits(
        current,
        pageSize,
        searchProductUnitParams.name,
        undefined,
        searchProductLineId,
        searchProductTypeId,
        showOption,
      ),
  );

  const urlProductType = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/product-types`;
  const { data: productTypesData, error: productTypesError } = useSWR(
    [urlProductType],
    () => fetchProductTypes(1, 100),
  );

  const urlProductLine = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/product-lines`;
  const { data: productLinesData, error: productLinesError } = useSWR(
    [urlProductLine, searchProductTypeId],
    () => fetchProductLines(1, 100, undefined, searchProductTypeId),
  );

  if (batchesError)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div>{batchesError.message}</div>
      </div>
    );

  if (!batchesData)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-grow text-success" role="status"></div>
        <span className="sr-only text-success">Loading...</span>
      </div>
    );

  const groupedProductData = groupProductData(productUnitsData?.results);
  const groupedBatchData = groupBatch(batchesData?.results);

  const totalValue = getWarehouseValue(groupedBatchData);

  const handleSearchClick = () => {
    setSearchProductUnitParams({
      name: searchSample,
      productTypeId: searchProductTypeId,
      productLineId: searchProductLineId,
    });
    setSearchBatchParams({ quantity: searchQuantity, expDate: searchExpDate });
  };

  const handleProductTypeChange = (value: number) => {
    setSearchProductTypeId(+value);
    setSearchProductLineId(0);
  };

  return (
    <>
      <h2>Kho hàng</h2>

      <div className="row">
        <div className="col col-md-9">
          <div className="row">
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
          <div className="row">
            <div className="col col-md-8">
              <div className="row">
                <Input
                  title="Loại sản phẩm"
                  size={6}
                  value={searchProductTypeId}
                  onSelectedChange={handleProductTypeChange}
                  icon={<FaFilter />}
                  options={productTypesData?.results}
                  placeholder="Chọn tên loại sản phẩm"
                />
                <Input
                  title="Dòng sản phẩm"
                  size={6}
                  readOnly={searchProductTypeId === 0}
                  value={searchProductLineId}
                  onSelectedChange={(value) => setSearchProductLineId(+value)}
                  icon={<FaFilter />}
                  options={productLinesData?.results}
                  placeholder="Chọn tên dòng sản phẩm"
                />
              </div>
              <div className="row">
                <Input
                  title="Số lượng tồn"
                  size={6}
                  value={searchQuantity}
                  placeholder="Nhập giá trị tồn nhỏ nhất"
                  onChange={(value) => setSearchQuantity(value)}
                  onClickIcon={handleSearchClick}
                  icon={<FaSearch />}
                />
                <Input
                  title="Hạn sử dụng"
                  value={searchExpDate}
                  size={6}
                  type="date"
                  placeholder="Nhập HSD nhỏ nhất"
                  onChange={(value) => setSearchExpDate(value)}
                  onClickIcon={handleSearchClick}
                  icon={<FaSearch />}
                />
              </div>
            </div>
            <div className="col col-md-4 d-flex flex-column">
              <label>Hiển thị nhanh</label>
              <div
                className="btn-group-vertical"
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

        <div className="col col-md-3">
          <div className="stat-card w-100 d-flex-column justify-content-between align-items-center px-3 py-5">
            <h4 className="text-start">Tổng giá trị kho hàng</h4>
            <h1 className="text-start fw-bold" style={{ display: 'inline' }}>
              {typeof totalValue === 'string'
                ? totalValue
                : typeof totalValue === 'number'
                ? formatCurrency(totalValue)
                : '0'}{' '}
            </h1>
            <h5 style={{ display: 'inline' }}>VNĐ</h5>
          </div>
        </div>
      </div>

      {/* Button thêm */}
      <div className="d-flex justify-content-end mb-3 ">
        <Link
          className="btn d-flex align-items-center btn-primary"
          href={'/inbound'}
          // onClick={() => setIsCreateModalOpen(true)}
        >
          <FaPlus className="align-middle" />
          <text>Nhập lô</text>
        </Link>
      </div>

      {productUnitsData && (
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

function groupProductData(data: Product[]): GroupedProductData {
  const result: GroupedProductData = {};

  data?.forEach((item) => {
    const typeName =
      item?.productSample?.productLine?.productType?.name || 'Unknown Type';
    const lineName = item?.productSample?.productLine?.name || 'Unknown Line';
    const sampleName = item?.productSample?.name || 'Unknown Sample';

    const unitData = {
      id: item.id,
      name: item.unit?.name || 'Unknown Unit',
      sellPrice: item.sellPrice,
      image: item.image,
    };

    if (!result[typeName]) {
      result[typeName] = {};
    }

    if (!result[typeName][lineName]) {
      result[typeName][lineName] = {};
    }

    if (!result[typeName][lineName][sampleName]) {
      result[typeName][lineName][sampleName] = [];
    }

    result[typeName][lineName][sampleName].push(unitData);
  });

  return result;
}

function groupBatch(results: Batch[]): BatchGrouped[] {
  return results.map((item) => ({
    id: item.id,
    inboundPrice: item.inboundPrice,
    sellPrice: item.productUnit.sellPrice ?? 0,
    discount: item.discount,
    inventQuantity: item.inventQuantity,
    inboundQuantity: item.inboundQuantity,
    expiredAt: new Date(item.expiredAt).toISOString(),
    createdAt: new Date(item.createdAt).toISOString(),
    inboundReceiptId: item.inboundReceipt?.id ?? 0,
    unit: item.productUnit.unit?.name || '',
    unitId: item.productUnit.unit?.id || 0,
    image: item.productUnit.image,
    supplierName: item.inboundReceipt?.supplier?.name || '',
    productSampleId: item.productUnit.productSample?.id || 0,
    productSample: item.productUnit.productSample?.name || '',
    uniqueUnitKey: `${item.productUnit.productSample?.id}_${item.productUnit.unit?.name}`,
  }));
}

function getWarehouseValue(data: BatchGrouped[]) {
  return data.reduce(
    (total, item) => total + item.inboundPrice * item.inventQuantity,
    0,
  );
}
