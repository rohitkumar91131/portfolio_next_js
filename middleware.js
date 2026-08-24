import { NextResponse } from 'next/server';

export function middleware(request) {
    const path = request.nextUrl.pathname;

    // Protect Admin Dashboard and Edit Routes
    if (
        path.startsWith('/admin/dashboard') ||
        path.startsWith('/admin/edit') ||
        path.startsWith('/admin/experience')
    ) {
        const adminToken = request.cookies.get('admin_token');

        if (!adminToken) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/dashboard/:path*',
        '/admin/edit/:path*',
        '/admin/experience/:path*',
    ],
};
