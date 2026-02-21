/**
 * Check Access API Route
 * Server-side allowlist check (doesn't expose emails to client)
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserManagementService } from '@/lib/admin/user-management-service';

const BYPASS_COOKIE = '_rf_bypass';

export async function GET() {
  try {
    // Bypass token check — grants access without login
    const bypassToken = process.env.BYPASS_AUTH_TOKEN;
    if (bypassToken) {
      const cookieStore = await cookies();
      const bypassCookie = cookieStore.get(BYPASS_COOKIE);
      if (bypassCookie?.value === bypassToken) {
        return NextResponse.json({ isAllowed: true, isAdmin: false, reason: 'allowed' });
      }
    }

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({
        isAllowed: false,
        isAdmin: false,
        reason: 'not-authenticated',
      });
    }

    // Check access in Redis
    const hasAccess = await UserManagementService.hasAccess(session.user.email);
    const isAdmin = await UserManagementService.isAdmin(session.user.email);

    return NextResponse.json({
      isAllowed: hasAccess,
      isAdmin,
      reason: hasAccess ? 'allowed' : 'not-on-allowlist',
    });
  } catch (error) {
    console.error('Access check error:', error);

    return NextResponse.json(
      {
        isAllowed: false,
        isAdmin: false,
        reason: 'error',
      },
      { status: 500 }
    );
  }
}
