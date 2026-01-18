import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
    const isAuthRoute = req.nextUrl.pathname.startsWith('/login') ||
                        req.nextUrl.pathname.startsWith('/register')

    // If user is logged in and trying to access auth routes, redirect to home
    if (token && isAuthRoute) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    // Check admin routes
    if (isAdminRoute && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isProtectedRoute =
          req.nextUrl.pathname.startsWith('/submit') ||
          req.nextUrl.pathname.startsWith('/admin')

        // Allow public routes
        if (!isProtectedRoute) {
          return true
        }

        // Require authentication for protected routes
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    '/submit/:path*',
    '/admin/:path*',
    '/login',
    '/register',
  ],
}
