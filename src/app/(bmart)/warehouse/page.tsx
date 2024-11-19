'use client';
import { fetchBatchs } from '@/services/batchServices';
import { useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import WarehouseTable from '@/components/warehouseComponent/warehouse.table';
import { Batch, BatchGrouped } from '@/types/batch';
import { fetchProductUnit } from '@/services/productUnitServices';
import { Product } from '@/types/productUnit';
import { GroupedProductData } from '@/types/commonType';
import { Input } from '@/components/commonComponent/InputForm';
import { FaSearch, FaEye, FaEyeDropper } from 'react-icons/fa';
import './style.css';
import { RiEyeCloseLine, RiEyeFill } from 'react-icons/ri';

function WarehousePage() {
  const current = 1;
  const pageSize = 10;
  const [level, setLevel] = useState('type');
  const [showOption, setShowOption] = useState(1);

  const columnsBatch: Column<BatchGrouped>[] = [
    { title: '#', key: 'id' },
    { title: 'Mã đơn nhập', key: 'inboundReceiptId' },
    { title: 'Giá nhập', key: 'inbound_price' },
    { title: 'Giá bán', key: 'sell_price' },
    { title: 'Giảm giá', key: 'discount' },
    { title: 'Tồn', key: 'quantity' },
    { title: 'Nhập', key: 'inbound_quantity' },
    { title: 'HSD', key: 'expiredAt' },
    { title: 'Đơn vị', key: 'unit' },
  ];

  const [data, setData] = useState<{
    product: GroupedProductData;
    batches: BatchGrouped[];
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [batches, productUnit] = await Promise.all([
          fetchBatchs(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/batchs`,
            current,
            pageSize,
          ),
          fetchProductUnit(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/product-units`,
            current,
            pageSize,
          ),
        ]);

        const groupedProductData = groupProductData(productUnit.results);
        const groupedBatchData = groupBatch(batches.results);

        // console.log('groupedProductData:', groupedProductData);
        // console.log('groupedBatchData:', groupedBatchData);

        setData({ product: groupedProductData, batches: groupedBatchData });
      } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
      }
    };
    fetchData();
  }, []);

  const handleSearchClick = () => {
    // setSearchParams({ name: searchName, phone: searchPhone });
    // setCurrent(1);
  };

  const onMutate = () => mutate(['', current, pageSize]);

  return (
    <>
      <div className="col col-md-9">
        <div className="row mb-3">
          <Input
            title="Mẫu sản phẩm"
            size={6}
            value={''}
            placeholder="Nhập mẫu sản phẩm"
            onChange={(value) => value}
            onClickIcon={handleSearchClick}
            icon={<FaSearch />}
          />
          <Input
            title="Số điện thoại"
            value={''}
            size={6}
            placeholder="Nhập số điện thoại"
            onChange={(value) => value}
            onClickIcon={handleSearchClick}
            icon={<FaSearch />}
          />
        </div>
        <div className="row mb-3">
          <div className="col col-md-8">
            <div className="row mb-3">
              <Input
                title="Loại sản phẩm"
                size={6}
                value={''}
                placeholder="Chọn"
                onChange={(value) => value}
                onClickIcon={handleSearchClick}
                icon={<FaSearch />}
                options={['1', '2']}
              />
              <Input
                title="Dòng sản phẩm"
                value={''}
                size={6}
                placeholder="Chọn"
                onChange={(value) => value}
                onClickIcon={handleSearchClick}
                icon={<FaSearch />}
                options={['1', '2']}
              />
            </div>
            <div className="row mb-3">
              <Input
                title="Số lượng tồn"
                size={6}
                value={''}
                placeholder="Chọn"
                onChange={(value) => value}
                onClickIcon={handleSearchClick}
                icon={<FaSearch />}
                options={['1', '2']}
              />
              <Input
                title="Hạn sử dụng"
                value={''}
                size={6}
                placeholder="Chọn"
                onChange={(value) => value}
                onClickIcon={handleSearchClick}
                icon={<FaSearch />}
                options={['1', '2']}
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

      {data && (
        <WarehouseTable
          level={level}
          product={data.product}
          batches={data.batches}
          columnsBatch={columnsBatch}
        />
      )}
    </>
  );
}

export default WarehousePage;

function groupProductData(data: Product[]) {
  const result: GroupedProductData = {};

  data.forEach((item) => {
    const typeName = item.productSample.productLine.productType.name;
    const lineName = item.productSample.productLine.name;
    const sampleData = {
      id: item.productSample.id,
      name: item.productSample.name,
      description: item.productSample.description,
      sell_price: item.sell_price,
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
    inbound_price: item.inbound_price,
    sell_price: item.sell_price,
    discount: item.discount,
    quantity: item.quantity,
    inbound_quantity: item.inbound_quantity,
    expiredAt: new Date(item.expiredAt).getTime(),
    inboundReceiptId: item.inboundReceipt.id,
    unit: item.productUnit.unit?.name || '',
    productSample: item.productUnit.productSample?.name || '',
  }));
}
