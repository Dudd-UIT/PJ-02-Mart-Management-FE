'use client';
import { Input } from '@/components/commonComponent/InputForm';
import withRoleAuthorization from '@/hoc/withRoleAuthorization';
import {
  fetchParameters,
  handleUpdateParameterAction,
} from '@/services/parameterServices';
import { Parameter } from '@/types/parameter';
import React, { useEffect, useState } from 'react';
import { FaArrowRightLong } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import useSWR, { mutate } from 'swr';

function PointConvertPage() {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/api/parameters`;

  const { data, error } = useSWR([url], () => fetchParameters());
  const [point, setPoint] = useState<number>();
  const [money, setMoney] = useState<number>();

  useEffect(() => {
    if (data && data.results) {
      if (data.results[0]) {
        setPoint(data.results[0].value);
      }
      if (data.results[1]) {
        setMoney(data.results[1].value);
      }
    }
  }, [data]);

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

  const onMutate = () => mutate([url]);

  const handleSave = async (id: number, value?: number) => {
    if (!value) {
      return;
    }
    const res = await handleUpdateParameterAction({ id, value });
    if (res?.data) {
      toast.success(res.message);
      onMutate();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <>
      <h2>Quản lý tỷ lệ quy đổi điểm</h2>
      <h4>Bao nhiêu điểm được 1 VND?</h4>

      <div className="container d-flex flex-column align-items-center pt-5">
        <div className="d-flex align-items-center mb-3">
          <div className="me-3">
            <Input
              title="Điểm"
              size={12}
              type="number"
              value={point}
              onChange={(value) => setPoint(+value)}
            />
          </div>
          <span className="mx-4 ">
            <FaArrowRightLong size={24} />
          </span>
          <div className="ms-3">
            <Input title="VND" size={12} value={1} readOnly type="number" />
          </div>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => handleSave(1, point)}
        >
          Lưu
        </button>
      </div>

      <h2>Quản lý tỷ lệ quy đổi điểm</h2>
      <h4>Bao nhiêu VND được 1 điểm?</h4>

      <div className="container d-flex flex-column align-items-center pt-5">
        <div className="d-flex align-items-center mb-3">
          <div className="me-3">
            <Input
              title="VND"
              size={12}
              type="number"
              value={money}
              onChange={(value) => setMoney(+value)}
            />
          </div>
          <span className="mx-4 ">
            <FaArrowRightLong size={24} />
          </span>
          <div className="ms-3">
            <Input title="Điểm" size={12} value={1} readOnly type="number" />
          </div>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => handleSave(2, money)}
        >
          Lưu
        </button>
      </div>
    </>
  );
}

export default withRoleAuthorization(PointConvertPage, ['u_param']);