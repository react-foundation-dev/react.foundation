// Redis storage for pending community submissions (admin review queue)
import type { CommunitySubmission } from '@/types/community-submission';
import type { Community } from '@/types/community';

const SUBMISSIONS_INDEX_KEY = 'community_submissions:index';
const SUBMISSION_KEY_PREFIX = 'community_submissions:';
type RedisExecResult = Array<[Error | null, unknown]>;

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

function assertRedisExecSucceeded(results: RedisExecResult | null, operation: string): RedisExecResult {
  if (!results) {
    throw new Error(`Redis transaction aborted while trying to ${operation}`);
  }

  const failed = results.find(([error]) => error !== null);
  if (failed?.[0]) {
    throw failed[0];
  }

  return results;
}

export async function saveSubmission(submission: CommunitySubmission): Promise<void> {
  const redis = await getRedis();
  if (!redis) throw new Error('Redis not available');

  const pipeline = redis.pipeline();
  pipeline.set(getSubmissionKey(submission.id), JSON.stringify(submission));
  pipeline.sadd(SUBMISSIONS_INDEX_KEY, submission.id);
  assertRedisExecSucceeded(await pipeline.exec(), 'save submission');
}

export async function getSubmissions(): Promise<CommunitySubmission[]> {
  const redis = await getRedis();
  if (!redis) return [];

  const ids = await redis.smembers(SUBMISSIONS_INDEX_KEY);
  if (ids.length === 0) return [];

  const keys = ids.map(id => getSubmissionKey(id));
  const pipeline = redis.pipeline();
  keys.forEach(k => pipeline.get(k));
  const results = assertRedisExecSucceeded(await pipeline.exec(), 'load submissions');
  const values = results.map(([, v]) => v as string | null);

  return values
    .filter((v): v is string => v !== null)
    .reduce<CommunitySubmission[]>((acc, v) => {
      try {
        acc.push(JSON.parse(v) as CommunitySubmission);
      } catch {
        console.error('Skipping malformed submission record in Redis');
      }
      return acc;
    }, [])
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

  const key = getSubmissionKey(id);

  // WATCH key for optimistic locking — if another request modifies
  // the key between GET and EXEC, the transaction aborts.
  await redis.watch(key);

  const existing = await redis.get(key);
  if (!existing) {
    await redis.unwatch();
    throw new Error(`Submission ${id} not found`);
  }

  const submission = JSON.parse(existing) as CommunitySubmission;
  const updated: CommunitySubmission = {
    ...submission,
    ...updates,
    id,
    updated_at: new Date().toISOString(),
  };

  assertRedisExecSucceeded(
    await redis.multi().set(key, JSON.stringify(updated)).exec(),
    `update submission ${id}`
  );

  return updated;
}

// Atomically add community to Redis + remove submission from queue
export async function approveSubmissionAtomic(
  submissionId: string,
  community: Community
): Promise<void> {
  const redis = await getRedis();
  if (!redis) throw new Error('Redis not available');

  const submissionKey = getSubmissionKey(submissionId);
  await redis.watch(submissionKey);

  const existing = await redis.get(submissionKey);
  if (!existing) {
    await redis.unwatch();
    throw new Error('Submission already processed');
  }

  assertRedisExecSucceeded(
    await redis.multi()
      .set(`communities:${community.id}`, JSON.stringify(community))
      .sadd('communities:index', community.id)
      .del(submissionKey)
      .srem(SUBMISSIONS_INDEX_KEY, submissionId)
      .exec(),
    `approve submission ${submissionId}`
  );
}

export async function deleteSubmission(id: string): Promise<void> {
  const redis = await getRedis();
  if (!redis) throw new Error('Redis not available');

  const pipeline = redis.pipeline();
  pipeline.del(getSubmissionKey(id));
  pipeline.srem(SUBMISSIONS_INDEX_KEY, id);
  assertRedisExecSucceeded(await pipeline.exec(), `delete submission ${id}`);
}
