/**
 * Redis Community Submission Storage
 * Stores pending community submissions for admin review
 *
 * Storage:
 * - Individual submissions: community_submissions:{id} (JSON)
 * - Index set: community_submissions:index (Redis SET of all IDs)
 */

import type { CommunitySubmission } from '@/types/community-submission';

const SUBMISSIONS_INDEX_KEY = 'community_submissions:index';
const SUBMISSION_KEY_PREFIX = 'community_submissions:';

function getSubmissionKey(id: string): string {
  return `${SUBMISSION_KEY_PREFIX}${id}`;
}

async function getRedis() {
  try {
    const { getRedisClient } = await import('./redis');
    return getRedisClient();
  } catch (error) {
    console.error('Redis unavailable for community submissions:', error);
    return null;
  }
}

export async function saveSubmission(submission: CommunitySubmission): Promise<void> {
  const redis = await getRedis();
  if (!redis) throw new Error('Redis not available');

  const pipeline = redis.pipeline();
  pipeline.set(getSubmissionKey(submission.id), JSON.stringify(submission));
  pipeline.sadd(SUBMISSIONS_INDEX_KEY, submission.id);
  await pipeline.exec();
}

export async function getSubmissions(): Promise<CommunitySubmission[]> {
  const redis = await getRedis();
  if (!redis) return [];

  const ids = await redis.smembers(SUBMISSIONS_INDEX_KEY);
  if (ids.length === 0) return [];

  const keys = ids.map(id => getSubmissionKey(id));
  const values = await redis.mget(...keys);

  return values
    .filter((v): v is string => v !== null)
    .map(v => JSON.parse(v) as CommunitySubmission)
    .sort((a, b) => b.submitted_at.localeCompare(a.submitted_at));
}

export async function getSubmissionById(id: string): Promise<CommunitySubmission | null> {
  const redis = await getRedis();
  if (!redis) return null;

  const data = await redis.get(getSubmissionKey(id));
  if (!data) return null;

  return JSON.parse(data) as CommunitySubmission;
}

export async function updateSubmission(
  id: string,
  updates: Partial<CommunitySubmission>
): Promise<CommunitySubmission> {
  const redis = await getRedis();
  if (!redis) throw new Error('Redis not available');

  const existing = await redis.get(getSubmissionKey(id));
  if (!existing) throw new Error(`Submission ${id} not found`);

  const submission = JSON.parse(existing) as CommunitySubmission;
  const updated: CommunitySubmission = {
    ...submission,
    ...updates,
    id, // prevent ID changes
    updated_at: new Date().toISOString(),
  };

  await redis.set(getSubmissionKey(id), JSON.stringify(updated));
  return updated;
}

/**
 * Atomically: add community to Redis + remove submission from queue.
 * Single pipeline ensures no partial state if one op fails.
 */
export async function approveSubmissionAtomic(
  submissionId: string,
  community: import('@/types/community').Community
): Promise<void> {
  const redis = await getRedis();
  if (!redis) throw new Error('Redis not available');

  const pipeline = redis.pipeline();
  // Add community
  pipeline.set(`communities:${community.id}`, JSON.stringify(community));
  pipeline.sadd('communities:index', community.id);
  // Remove submission
  pipeline.del(getSubmissionKey(submissionId));
  pipeline.srem(SUBMISSIONS_INDEX_KEY, submissionId);
  await pipeline.exec();
}

export async function deleteSubmission(id: string): Promise<void> {
  const redis = await getRedis();
  if (!redis) throw new Error('Redis not available');

  const pipeline = redis.pipeline();
  pipeline.del(getSubmissionKey(id));
  pipeline.srem(SUBMISSIONS_INDEX_KEY, id);
  await pipeline.exec();
}
