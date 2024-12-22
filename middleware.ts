import { auth } from '@/auth'
import { NextResponse } from 'next/server'
 
export default auth((req: any) => {
  const isLoggedIn = !!req.auth
  const isOnLoginPage = req.nextUrl.pathname === '/login'
  const isOnPublicPage = ['/register', '/forgot-password'].includes(req.nextUrl.pathname)

  // Nếu đã login và cố truy cập trang login -> redirect về trang chính
  if (isLoggedIn && isOnLoginPage) {
    return NextResponse.redirect(new URL('/order/sale', req.nextUrl.origin))
  }

  // Nếu đã login và đang ở trang chủ (/) -> redirect về trang chính
  if (isLoggedIn && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/order/sale', req.nextUrl.origin))
  }

  // Nếu chưa login và cố truy cập trang được bảo vệ
  if (!isLoggedIn && !isOnLoginPage && !isOnPublicPage) {
    return NextResponse.redirect(new URL('/login', req.nextUrl.origin))
  }

  return NextResponse.next()
})

// Cấu hình những route cần check
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}