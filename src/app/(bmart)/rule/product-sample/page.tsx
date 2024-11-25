'use client';

import { Input } from '@/components/commonComponent/InputForm';
import ProductSampleHeader from '@/components/productSampleComponent/productSample.header';
import ProductSampleTable from '@/components/productSampleComponent/productSample.table';
import { fetchProductSamples, fetchProductSamplesByProductType } from '@/services/productSampleServices';
import { ProductLine } from '@/types/productLine';
import { ProductSample, ProductSampleTransform } from '@/types/productSample';
import { ProductType } from '@/types/productType';
import { sendRequest } from '@/utils/api';
import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { FaFilter, FaPlus } from 'react-icons/fa6';
import useSWR, { mutate } from 'swr';

const columns: Column<ProductSampleTransform>[] = [
  { title: '#', key: 'id' },
  { title: 'Tên sản phẩm', key: 'name' },
  { title: 'Đơn vị', key: 'unitName' },
  { title: 'Khối lượng', key: 'volumne' },
];

function ProductSamplePage() {

  const [current, setCurrent] = useState(1);
  const [searchName, setSearchName] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchProductLine, setSearchProductLine] = useState('');
  const [searchProductType, setSearchProductType] = useState('');
  
  const [searchParams, setSearchParams] = useState({ 
    name: '',
    productLineId: null as number | null,
    productTypeId: null as number | null
  });

  const [currentTypeIndex, setCurrentTypeIndex] = useState(0);

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const fetchProductSamplesUrl = `${baseUrl}/v1/api/product-samples/by-type`;
  const fetchProductTypesUrl = `${baseUrl}/v1/api/product-types`;
  const fetchProductLinesUrl = `${baseUrl}/v1/api/product-lines`;

  const { data: productTypesData, error: productTypesError } = useSWR(
    fetchProductTypesUrl,
    async (url) => {
      const res = await sendRequest<IBackendRes<{ meta: object; results: ProductType[] }>>({
        url,
        method: 'GET',
      });
      return res?.data?.results;
    }
  );

  const { data: productLinesData, error: productLinesError } = useSWR(
    fetchProductLinesUrl,
    async (url) => {
      const res = await sendRequest<IBackendRes<{ meta: object; results: ProductLine[] }>>({
        url,
        method: 'GET',
      });
      return res?.data?.results;
    }
  );

  const currentProductType = productTypesData?.[currentTypeIndex];
  const currentProductTypeId = currentProductType?.id;

  // Fetch Product Samples based on selected Product Type
  const { data: productSamplesData, error: productSamplesError } = useSWR(
    currentProductTypeId 
      ? [fetchProductSamplesUrl, searchParams.name, searchParams.productLineId, searchParams.productTypeId, currentProductTypeId]
      : null,
    () => fetchProductSamplesByProductType(
      fetchProductSamplesUrl,
      currentProductTypeId!,
      searchParams.name,
      searchParams.productLineId,
      searchParams.productTypeId
    ),
  );

  const productSamples = productSamplesData?.results?.map((productSample: ProductSample) => {
    const primaryUnit = productSample.productUnits?.find(unit => unit.conversion_rate === 1);
  
    return {
      id: productSample.id,
      name: productSample.name,
      volumne: primaryUnit?.volumne || "",
      unitName: primaryUnit?.unit?.name || "",
      productLineName: productSample.productLine?.name || "",
      productSampleUnits: productSample.productUnits?.map(unit => unit.id) || []
    };
  });
  
  if (productTypesError || productSamplesError) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div>
          Failed to load data: {productTypesError?.message || productSamplesError?.message}
        </div>
      </div>
    );
  }

  if (!productTypesData) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-grow text-success" role="status"></div>
        <span className="sr-only text-success">Loading...</span>
      </div>
    );
  }


  // Handlers for changing pages within each productType
  const handlePreviousType = () => {
    if (currentTypeIndex > 0) {
      setCurrentTypeIndex(currentTypeIndex - 1);
    }
  };

  const handleNextType = () => {
    if (currentTypeIndex < productTypesData.length - 1) {
      setCurrentTypeIndex(currentTypeIndex + 1);
    }
  };
  
  const handleSearchClick = () => {
    setSearchParams({ 
      name: searchName,
      productLineId: searchProductLine ? parseInt(searchProductLine) : null,
      productTypeId: searchProductType ? parseInt(searchProductType) : null
    });
    setCurrent(1);
  };

  // Transform data for dropdowns
  const productLineOptions = productLinesData?.map(line => line.name) || [];
  const productTypeOptions = productTypesData?.map(type => type.name) || [];

  console.log("productLineOptions:::", productLineOptions);
  const onMutate = () => mutate([fetchProductSamplesUrl, current, searchParams.name]);

  return (
    <>
      <h3>Danh sách sản phẩm</h3>
      {/* button search */}
      <div className="row">
      <Input
          title="Tìm kiếm"
          size={4}
          value={searchName}
          placeholder="Nhập tên sản phẩm"
          onChange={(value) => setSearchName(value)}
          onClickIcon={handleSearchClick}
          icon={<FaSearch />}
        />

        {/* Product Line Search */}
        <Input
          title="Dòng sản phẩm"
          size={4}
          value={searchProductLine}
          onChange={(value) => setSearchProductLine(value)}
          onClickIcon={handleSearchClick}
          icon={<FaFilter />}
          options={productLineOptions}
          placeholder='Chọn tên dòng sản phẩm'
        />

        {/* Product Type Search */}
        <Input
          title="Loại sản phẩm"
          size={4}
          value={searchProductType}
          onChange={(value) => setSearchProductType(value)}
          onClickIcon={handleSearchClick}
          icon={<FaFilter />}
          options={productTypeOptions}
          placeholder='Chọn tên loại sản phẩm'
        />
      </div>


      {/* Header for selected product type */}
      {currentProductType && (
        <ProductSampleHeader 
          productTypeName={currentProductType.name}
        />
      )}

      {/* Table */}
      <ProductSampleTable 
        productSamples={productSamples}
        columns={columns}
        onMutate={onMutate}
      />

      {/* Navigate control */}
      <nav aria-label="Page navigation example">
      <ul className="pagination justify-content-center">
        <li className={`page-item ${currentTypeIndex === 0 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={handlePreviousType}>
            Previous
          </button>
        </li>
        {productTypesData.map((type, index) => (
            <li
              key={type.id}
              className={`page-item ${currentTypeIndex === index ? 'active' : ''}`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentTypeIndex(index)}
              >
                {index + 1}
              </button>
            </li>
          ))}
        <li className={`page-item ${currentTypeIndex === productTypesData.length - 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={handleNextType}>
            Next
          </button>
        </li>
      </ul>
    </nav>
    </>
  );
}

export default ProductSamplePage;
