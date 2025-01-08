'use client';
import { Modal, Button } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { toast } from 'react-toastify';
import ProductSampleUnitModal from '../productSampleUnitComponent/productSampleUnit.add';
import { fetchProductLines } from '@/services/productLineServices';
import { ProductSample } from '@/types/productSample';
import { ProductUnit, ProductUnitTransform } from '@/types/productUnit';
import { Input } from '../commonComponent/InputForm';
import SelectedProductSampleUnitTable from './selectedProductSample.table';
import {
  handleUpdateProductSampleAction,
  uploadImageToS3,
} from '@/services/productSampleServices';
import ProtectedComponent from '../commonComponent/ProtectedComponent';

const columns: Column<ProductUnitTransform>[] = [
  { title: 'Đơn vị tính', key: 'unitName' },
  // { title: 'Tỷ lệ chuyển đổi', key: 'conversionRate' },
  // { title: 'So với', key: 'compareUnitName' },
  { title: 'Giá bán', key: 'sellPrice' },
  { title: 'Khối lượng', key: 'volumne' },
];

type FormData = {
  id: number;
  name: string;
  productLineId: number;
  description: string;
};

function InfoProductSampleModal(props: UpdateModalProps<ProductUnitTransform>) {
  const {
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    data: productSampleData,
    setData,
    onMutate,
  } = props;

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isProductSampleUnitsModalOpen, setIsProductSampleUnitsModalOpen] =
    useState(false);

  const initalFormData = {
    id: 0,
    name: '',
    productLineId: 0,
    description: '',
  };

  const [formData, setFormData] = useState<FormData>(initalFormData);
  const [productUnits, setProductUnits] = useState<ProductUnitTransform[]>([]);
  const urlProductLines = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/product-lines`;
  const { data: productLinesData } = useSWR(
    [urlProductLines, current, pageSize],
    () => fetchProductLines(current, pageSize),
  );

  useEffect(() => {
    if (productSampleData) {
      // setFormData({
      //   id: productSampleData.id,
      //   name: productSampleData.name || '',
      //   productLineId: productSampleData.productLineId || 0,
      //   description: productSampleData.description || '',
      // });

      // const productUnits = productSampleData.productUnits.map(
      //   (productUnit: ProductUnit) => ({
      //     id: productUnit.id,
      //     unitName: productUnit?.unit?.name || '',
      //     unitId: productUnit?.unit?.id || 0,
      //     conversionRate: productUnit.conversionRate,
      //     compareUnitId: productUnit?.compareUnit?.id,
      //     compareUnitName: productUnit?.compareUnit?.name,
      //     volumne: productUnit.volumne,
      //     sellPrice: productUnit.sellPrice,
      //     image: productUnit.image,
      //   }),
      // );
      setProductUnits(productUnits);
    }
  }, [productSampleData]);

  const handleFormDataChange = (
    field: keyof typeof formData,
    value: number[] | string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCloseCreateModal = () => {
    setIsUpdateModalOpen(false);
    setFormData(initalFormData);
    setData?.(undefined);
  };

  const handleUpdateProductSample = async () => {
    const { id, ...rest } = formData;

    const productUnitsWithImageUrls = await Promise.all(
      productUnits.map(async (productUnit) => {
        if (productUnit.image instanceof File) {
          const formDataImage = new FormData();
          formDataImage.append('file', productUnit.image);
          const uploadedImageUrl = await uploadImageToS3(formDataImage);

          return {
            ...productUnit,
            image: uploadedImageUrl,
          };
        }

        return productUnit;
      }),
    );

    const productUnitsDto = productUnitsWithImageUrls.map?.((productUnit) => ({
      volumne: productUnit.volumne,
      sellPrice: productUnit.sellPrice,
      conversionRate: productUnit.conversionRate,
      compareUnitId: productUnit.compareUnitId,
      image: productUnit.image,
      productSampleId: formData.id,
      unitId: productUnit.unitId,
    }));
    const payload = { productSampleDto: rest, productUnitsDto };
    const res = await handleUpdateProductSampleAction({
      id: formData.id,
      ...payload,
    });

    if (res?.data) {
      handleCloseCreateModal();
      toast.success(res.message);
      onMutate();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <>
      <Modal
        backdrop={'static'}
        show={isUpdateModalOpen}
        onHide={handleCloseCreateModal}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Thông tin mẫu sản phẩm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container mb-4">
            <div className="row mb-3">
              <Input
                title="Tên mẫu sản phẩm"
                size={6}
                value={formData.name}
                onChange={(value) => handleFormDataChange('name', value)}
              />
              <Input
                title="Tên dòng sản phẩm"
                size={6}
                value={formData.productLineId}
                keyObj="id"
                showObj="name"
                placeholder="Chọn dòng sản phẩm"
                options={productLinesData?.results}
                onSelectedChange={(value) =>
                  handleFormDataChange('productLineId', value)
                }
              />
            </div>
            <div className="row mb-3">
              <Input
                title="Mô tả"
                size={12}
                value={formData.description}
                onChange={(value) => handleFormDataChange('description', value)}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCreateModal}>
            Thoát
          </Button>
          <ProtectedComponent requiredRoles={['u_pdsam']}>
            <Button variant="danger" onClick={handleUpdateProductSample}>
              Lưu
            </Button>
          </ProtectedComponent>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default InfoProductSampleModal;
