'use client';
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
  const [parameter, setParameter] = useState<Parameter | null>(null);

  useEffect(() => {
    if (data && data.results && data.results[0]) {
      setParameter(data.results[0]);
    }
  }, [data]);

  if (error)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div>Failed to load data: {error.message}</div>
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

  const handleSave = async () => {
    const res = await handleUpdateParameterAction(parameter);
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
      <div className="container d-flex flex-column align-items-center pt-5">
        <div className="d-flex align-items-center mb-3">
          <div className="me-3">
            <label className="form-label">Điểm</label>
            <input
              type="number"
              value={parameter?.value || ''} // Ensure point is displayed once fetched
              onChange={(e) =>
                setParameter((prev) =>
                  prev ? { ...prev, value: +e.target.value } : null,
                )
              }
              className="form-control"
              placeholder="Nhập điểm"
            />
          </div>
          <span className="mx-4 ">
            <FaArrowRightLong size={24} />
          </span>
          <div className="ms-3">
            <label className="form-label">VND</label>
            <input
              type="number"
              value={1}
              disabled
              className="form-control"
              placeholder="Nhập VND"
            />
          </div>
        </div>
        <button className="btn btn-danger" onClick={handleSave}>
          Lưu
        </button>
      </div>
    </>
  );
}

export default PointConvertPage;
