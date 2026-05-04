// POST /api/communities/submit — public endpoint for community submissions
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { saveSubmission } from '@/lib/redis-community-submissions';
import type { CommunitySubmission } from '@/types/community-submission';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const required = ['name', 'address', 'city', 'country', 'description', 'organizer_name', 'organizer_email'];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const maxLengths: Record<string, number> = {
      name: 200, address: 500, city: 100, country: 100,
      description: 2000, organizer_name: 200, organizer_email: 254,
      meetup_url: 500, website: 500,
    };
    for (const [field, max] of Object.entries(maxLengths)) {
      if (typeof body[field] === 'string' && body[field].length > max) {
        return NextResponse.json(
          { success: false, error: `${field} exceeds ${max} characters` },
          { status: 400 }
        );
      }
    }

    const now = new Date().toISOString();
    const submission: CommunitySubmission = {
      id: `submission-${crypto.randomUUID()}`,
      name: body.name,
      address: body.address,
      city: body.city,
      country: body.country,
      description: body.description,
      meetup_url: body.meetup_url,
      website: body.website,
      member_count: body.member_count || 0,
      organizer_name: body.organizer_name,
      organizer_email: body.organizer_email,
      submitted_by: session.user.email,
      verification_status: 'pending',
      geocoded: false,
      submitted_at: now,
      created_at: now,
      updated_at: now,
    };

    await saveSubmission(submission);

    return NextResponse.json({
      success: true,
      message: 'Community submitted successfully. We will review and add it soon!',
    });

  } catch (error: unknown) {
    console.error('Community submission failed:', error);
    return NextResponse.json(
      { success: false, error: 'Submission failed' },
      { status: 500 }
    );
  }
}
