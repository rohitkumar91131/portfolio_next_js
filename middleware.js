import { NextResponse } from 'next/server';

export function middleware(request) {
    const path = request.nextUrl.pathname;

    // Protect Admin Dashboard and Management Routes
    if (
        path.startsWith('/admin/dashboard') ||
        path.startsWith('/admin/projects') ||
        path.startsWith('/admin/experience') ||
        path.startsWith('/admin/education') ||
        path.startsWith('/admin/resumes') ||
        path.startsWith('/admin/versions')
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
        '/admin/projects/:path*',
        '/admin/experience/:path*',
        '/admin/education/:path*',
        '/admin/resumes/:path*',
        '/admin/versions/:path*',
    ],
};
