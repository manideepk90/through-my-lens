import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/auth'

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('auth-token')?.value

    // Check if the request is for an admin route
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Allow access to the login page
        if (request.nextUrl.pathname === '/admin/login') {
            // If user is already logged in, redirect to dashboard
            if (token && await verifyToken(token)) {
                return NextResponse.redirect(new URL('/admin/dashboard', request.url))
            }
            return NextResponse.next()
        }

        console.log("token", token, await verifyToken(token))
        // Check if user is authenticated
        if (!token || !(await verifyToken(token))) {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/admin',
        '/admin/:path*',
        '/admin/login'
    ]
} 