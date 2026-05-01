/**
 * Reject Community Submission API
 * POST /api/admin/community-submissions/reject
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserManagementService } from '@/lib/admin/user-management-service';
import { getSubmissionById, updateSubmission } from '@/lib/redis-community-submissions';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const isAdmin = await UserManagementService.isAdmin(session.user.email);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { id, reason } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Submission ID required' }, { status: 400 });
    }

    const submission = await getSubmissionById(id);
    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    await updateSubmission(id, {
      verification_status: 'rejected',
      reviewed_by: session.user.email,
      reviewed_at: new Date().toISOString(),
      rejection_reason: reason || undefined,
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Error rejecting submission:', error);
    return NextResponse.json({ error: 'Failed to reject' }, { status: 500 });
  }
}
