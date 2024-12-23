// import { getSession } from 'next-auth/react';
// import { useEffect } from 'react';
// import { NextPage } from 'next';
// import { useRouter } from 'next/navigation';

// export default function withRoleAuthorization<
//   P extends Record<string, unknown>,
// >(WrappedComponent: NextPage<P>, requiredRoles: string[] = []) {
//   const AuthorizedPage: React.FC<P> = (props) => {
//     const router = useRouter();

//     useEffect(() => {
//       const checkAuthorization = async () => {
//         const session = await getSession();

//         if (!session || !session.user) {
//           router.replace('/login'); // Redirect nếu chưa đăng nhập
//           return;
//         }

//         const userRoles = session.user.roles || [];
//         const hasPermission = requiredRoles.some((role) =>
//           userRoles.includes(role),
//         );

//         if (!hasPermission) {
//           router.replace('/403'); // Redirect đến trang lỗi 403
//         }
//       };

//       checkAuthorization();
//     }, [router]);

//     return <WrappedComponent {...props} />;
//   };

//   return AuthorizedPage;
// }

import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import React, { ComponentType } from 'react';

export default function withRoleAuthorization<P extends object>(
  WrappedComponent: ComponentType<P>,
  requiredRoles: string[] = [],
): React.FC<P> {
  const AuthorizedPage: React.FC<P> = (props) => {
    const router = useRouter();

    useEffect(() => {
      const checkAuthorization = async () => {
        const session = await getSession();

        if (!session || !session.user) {
          router.replace('/login'); // Redirect nếu chưa đăng nhập
          return;
        }

        const userRoles = session.user.roles || [];
        if (!requiredRoles.some((role) => userRoles.includes(role))) {
          router.replace('/403'); // Redirect đến trang lỗi 403
        }
      };

      checkAuthorization();
    }, [router]);

    return <WrappedComponent {...(props as P)} />;
  };

  return AuthorizedPage;
}
