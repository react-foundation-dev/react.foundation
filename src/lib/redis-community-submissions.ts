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
  } catch {
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

  const values = await Promise.all(
    ids.map(id => redis.get(getSubmissionKey(id)))
  );

  return values
    .filter((v): v is string => v !== null)
    .map(v => JSON.parse(v) as CommunitySubmission);
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

export async function deleteSubmission(id: string): Promise<void> {
  const redis = await getRedis();
  if (!redis) throw new Error('Redis not available');

  const pipeline = redis.pipeline();
  pipeline.del(getSubmissionKey(id));
  pipeline.srem(SUBMISSIONS_INDEX_KEY, id);
  await pipeline.exec();
}
