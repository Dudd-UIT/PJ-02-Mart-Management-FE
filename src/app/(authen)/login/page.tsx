'use client';
import { Input } from '@/components/commonComponent/InputForm';
import { authenticate } from '@/services/authService';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Image from 'next/image';

type FormDataLogin = {
  email: string;
  password: string;
};

function LoginPage() {
  const router = useRouter();
  const initialFormLogin = {
    email: '',
    password: '',
  };
  const [formLogin, setFormLogin] = useState<FormDataLogin>(initialFormLogin);

  const handleLoginFormChange = (
    field: keyof typeof formLogin,
    value: string,
  ) => {
    setFormLogin((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = async () => {
    console.log(
      '${process.env.NEXT_PUBLIC_BACKEND_URL}',
      `${process.env.NEXT_PUBLIC_BACKEND_URL}`,
    );
    try {
      const res = await authenticate(formLogin);
      if (res?.message) {
        // if (res?.code === 2) {
        //   return;
        // }
        toast.error(res.message);
      } else {
        router.replace('/statistics');
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  return (
    <div className="vh-100 position-relative d-flex align-items-center justify-content-center">
      {/* Fullscreen Background Image */}
      <div className="position-absolute top-0 start-0 w-100 h-100">
        <Image
          src="https://png.pngtree.com/thumb_back/fw800/background/20240119/pngtree-composition-of-fruits-and-vegetables-image_15612745.jpg"
          alt="Background"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          priority
        />
      </div>
      {/* Semi-transparent Login Form */}
      <div
        className="position-relative ms-auto z-1 p-5 shadow"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent background
          backdropFilter: 'blur(4px)', // Adds a frosted glass effect
          maxWidth: '500px',
          width: '100%',
          height: '100%',
        }}
      >
        {/* Logo */}
        <div className="mb-4">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={140}
            height={140}
            priority
            className="mb-2"
          />
        </div>
        <h1 className="fw-bold mb-4 pe-5">Đăng Nhập Vào Tài Khoản </h1>

        {/* Login Form */}
        <form className="w-100">
          <div className="mb-3">
            <Input
              title="Email"
              size={12}
              required
              value={formLogin.email}
              placeholder="Nhập email"
              onChange={(value) => handleLoginFormChange('email', value)}
            />
          </div>
          <div className="mb-3">
            <Input
              title="Mật khẩu"
              size={12}
              type="password"
              value={formLogin.password}
              placeholder="Nhập mật khẩu"
              onChange={(value) => handleLoginFormChange('password', value)}
            />
          </div>
          <button
            type="button"
            className="btn btn-primary w-100 mt-3"
            onClick={handleLogin}
          >
            Đăng nhập
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-3 text-center">
          <span>
            Chưa có tài khoản?{' '}
            <a href="#" className="text-primary fw-bold">
              Đăng ký ngay!
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
