/**
 * Pending Community Submissions Table
 * Shows submissions awaiting admin review with approve/reject actions
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RFDS } from '@/components/rfds';
import type { CommunitySubmission } from '@/types/community-submission';

interface PendingSubmissionsTableProps {
  submissions: CommunitySubmission[];
}

export function PendingSubmissionsTable({ submissions }: PendingSubmissionsTableProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  async function handleApprove(id: string) {
    setLoadingId(id);
    try {
      const res = await fetch('/api/admin/community-submissions/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Failed to approve');
      router.refresh();
    } catch (err) {
      console.error('Approve failed:', err);
    } finally {
      setLoadingId(null);
    }
  }

  async function handleReject(id: string) {
    setLoadingId(id);
    try {
      const res = await fetch('/api/admin/community-submissions/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, reason: rejectReason }),
      });
      if (!res.ok) throw new Error('Failed to reject');
      setRejectingId(null);
      setRejectReason('');
      router.refresh();
    } catch (err) {
      console.error('Reject failed:', err);
    } finally {
      setLoadingId(null);
    }
  }

  if (submissions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No pending submissions.</p>
    );
  }

  return (
    <div className="space-y-4">
      {submissions.map((s) => (
        <div
          key={s.id}
          className="border border-border rounded-lg p-4 bg-muted/30 space-y-3"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="font-semibold text-foreground">{s.name}</h4>
              <p className="text-sm text-muted-foreground">
                {s.city}, {s.country}
              </p>
            </div>
            <RFDS.SemanticBadge variant={
              s.verification_status === 'pending' ? 'warning' :
              s.verification_status === 'rejected' ? 'destructive' : 'success'
            }>
              {s.verification_status}
            </RFDS.SemanticBadge>
          </div>

          <p className="text-sm text-foreground">{s.description}</p>

          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div>Organizer: {s.organizer_name} ({s.organizer_email})</div>
            <div>Submitted by: {s.submitted_by}</div>
            {s.website && <div>Website: {s.website}</div>}
            {s.meetup_url && <div>Meetup: {s.meetup_url}</div>}
            {s.member_count ? <div>Members: {s.member_count}</div> : null}
            <div>Submitted: {new Date(s.submitted_at).toLocaleDateString()}</div>
          </div>

          {s.verification_status === 'pending' && (
            <div className="flex items-center gap-2 pt-2 border-t border-border">
              {rejectingId === s.id ? (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="text"
                    placeholder="Reason (optional)"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-sm border border-border rounded-lg bg-background text-foreground"
                  />
                  <RFDS.SemanticButton
                    variant="destructive"
                    size="sm"
                    onClick={() => handleReject(s.id)}
                    disabled={loadingId === s.id}
                  >
                    {loadingId === s.id ? 'Rejecting...' : 'Confirm'}
                  </RFDS.SemanticButton>
                  <RFDS.SemanticButton
                    variant="secondary"
                    size="sm"
                    onClick={() => { setRejectingId(null); setRejectReason(''); }}
                  >
                    Cancel
                  </RFDS.SemanticButton>
                </div>
              ) : (
                <>
                  <RFDS.SemanticButton
                    variant="primary"
                    size="sm"
                    onClick={() => handleApprove(s.id)}
                    disabled={loadingId === s.id}
                  >
                    {loadingId === s.id ? 'Approving...' : 'Approve'}
                  </RFDS.SemanticButton>
                  <RFDS.SemanticButton
                    variant="destructive"
                    size="sm"
                    onClick={() => setRejectingId(s.id)}
                    disabled={loadingId === s.id}
                  >
                    Reject
                  </RFDS.SemanticButton>
                </>
              )}
            </div>
          )}

          {s.verification_status === 'rejected' && s.rejection_reason && (
            <p className="text-sm text-destructive pt-2 border-t border-border">
              Rejected: {s.rejection_reason}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
