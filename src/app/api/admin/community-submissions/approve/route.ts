/**
 * Approve Community Submission API
 * POST /api/admin/community-submissions/approve
 *
 * Converts a pending submission into a full Community in Redis.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserManagementService } from '@/lib/admin/user-management-service';
import { getSubmissionById, approveSubmissionAtomic } from '@/lib/redis-community-submissions';
import type { Community } from '@/types/community';

function slugify(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  if (!slug) throw new Error(`Could not generate slug from name: "${name}"`);
  return slug;
}

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

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Submission ID required' }, { status: 400 });
    }

    const submission = await getSubmissionById(id);
    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    const now = new Date().toISOString();
    const communityId = `community-${crypto.randomUUID()}`;
    const community: Community = {
      id: communityId,
      name: submission.name,
      slug: slugify(submission.name),
      city: submission.city,
      country: submission.country,
      region: submission.region,
      timezone: submission.timezone ?? 'UTC',
      coordinates: submission.coordinates,
      organizers: [
        {
          id: `org-${crypto.randomUUID()}`,
          name: submission.organizer_name,
          role: 'Lead Organizer',
        },
      ],
      founded_date: now,
      event_types: ['meetup'],
      website: submission.website,
      meetup_url: submission.meetup_url,
      description: submission.description,
      member_count: submission.member_count ?? 0,
      typical_attendance: 0,
      meeting_frequency: 'monthly',
      primary_language: 'English',
      status: 'new',
      invite_only: false,
      verified: true,
      verification_status: 'verified',
      cois_tier: 'none',
      created_at: now,
      updated_at: now,
    };

    await approveSubmissionAtomic(id, community);

    return NextResponse.json({ success: true, communityId });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to approve';
    const status = message.includes('Concurrent') || message.includes('already processed') ? 409 : 500;
    console.error('Error approving submission:', error);
    return NextResponse.json({ error: message }, { status });
  }
}
