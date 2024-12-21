'use client';

import ProtectedComponent from '@/components/commonComponent/ProtectedComponent';

function StaticPage() {
  return (
    <>
      <ProtectedComponent requiredRoles={['create_batch']}>
        <button>Tạo sản phẩm</button>
      </ProtectedComponent>
      <p>StaticPage</p>
    </>
  );
}

export default StaticPage;
