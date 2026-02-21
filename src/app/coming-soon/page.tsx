/**
 * Coming Soon Page
 * Blocks access to site unless user is on allowlist
 */

'use client';

import { memo, useState, useEffect, useRef, type FormEvent, type RefObject } from 'react';
import { signIn } from 'next-auth/react';
import { SiGithub } from '@icons-pack/react-simple-icons';
import Link from 'next/link';
import { Pill } from '@/components/ui/pill';
import { Button } from '@/components/ui/button';
import { RFDS } from '@/components/rfds';
import {
  useAccessControl,
  useComingSoonRedirect,
  useAccessRequest,
} from '@/lib/access-control/use-access-control';

const MILESTONES: { label: string; position: number; status: 'online' | 'pending' }[] = [
  { label: 'Seeds Planted', position: 5, status: 'online' },
  { label: 'First Charter Created', position: 20, status: 'online' },
  { label: 'Internal Working Model', position: 34, status: 'online' },
  { label: 'Community Changes', position: 50, status: 'online' },
  { label: 'Fundraising', position: 64, status: 'online' },
  { label: 'Governance', position: 78, status: 'online' },
  { label: 'Launch', position: 100, status: 'pending' },
];

const ANIM_START_DELAY_MS = 500;

function useComingSoonPageState(
  isAuthenticated: boolean,
  userEmail: string | null | undefined,
) {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isAuthenticated && userEmail) {
      setShowRequestForm(true);
    }
  }, [isAuthenticated, userEmail]);

  return { showRequestForm, isLoaded };
}

// Solves for y given normalized x input on a CSS cubic-bezier curve.
// Avoids reading the DOM so the RAF loop never forces a reflow.
function cubicBezierY(x1: number, y1: number, x2: number, y2: number, xInput: number): number {
  if (xInput <= 0) return 0;
  if (xInput >= 1) return 1;
  // Binary search for parameter t where Bx(t) ≈ xInput
  let lo = 0, hi = 1, t = xInput;
  for (let i = 0; i < 20; i++) {
    const bx = 3 * x1 * t * (1 - t) ** 2 + 3 * x2 * t ** 2 * (1 - t) + t ** 3;
    if (Math.abs(bx - xInput) < 1e-6) break;
    if (bx < xInput) lo = t; else hi = t;
    t = (lo + hi) / 2;
  }
  return 3 * y1 * t * (1 - t) ** 2 + 3 * y2 * t ** 2 * (1 - t) + t ** 3;
}

const ANIM_DURATION_MS = 20_000;
const EASING = [0.2, 0.7, 0.0, 1.0] as const;

// 4-year journey: Feb 24 2022 → Feb 24 2026, 12:30pm ET (17:30 UTC)
const LAUNCH_DATE_MS = new Date('2026-02-24T17:30:00Z').getTime();
const START_DATE_MS = new Date('2022-02-24T17:30:00Z').getTime();

function getRealProgress(): number {
  const elapsed = Date.now() - START_DATE_MS;
  const total = LAUNCH_DATE_MS - START_DATE_MS;
  return Math.min(Math.max((elapsed / total) * 100, 0), 100);
}

function useProgressAnimation(
  barRef: RefObject<HTMLDivElement | null>,
  displayRef: RefObject<HTMLSpanElement | null>,
  playheadRef: RefObject<HTMLDivElement | null>,
) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const realProgress = getRealProgress();
    const targetPct = Math.floor(realProgress);

    // Fire bar + playhead CSS transitions once.
    const barId = setTimeout(() => {
      const easing = `${ANIM_DURATION_MS / 1000}s cubic-bezier(${EASING.join(',')})`;
      if (barRef.current) {
        barRef.current.style.transition = `transform ${easing}`;
        barRef.current.style.transform = `scaleX(${realProgress / 100})`;
      }
      if (playheadRef.current) {
        playheadRef.current.style.transition = `left ${easing}`;
        playheadRef.current.style.left = `${realProgress}%`;
      }
    }, ANIM_START_DELAY_MS);

    // RAF loop: derives progress from elapsed time using the same cubic-bezier —
    // no getComputedStyle reads, no reflows, CSS transition stays silky smooth.
    let lastVisible = 0;
    let lastCount = -1;
    let startTime: number | null = null;
    let animFrame: number;

    const watch = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = Math.min(timestamp - startTime, ANIM_DURATION_MS);
      const [x1, y1, x2, y2] = EASING;
      const easedProgress = cubicBezierY(x1, y1, x2, y2, elapsed / ANIM_DURATION_MS) * realProgress;

      const count = Math.min(Math.floor(easedProgress), targetPct);
      if (count !== lastCount) {
        lastCount = count;
        if (displayRef.current) displayRef.current.textContent = `${count}%`;
      }

      const newVisible = MILESTONES.filter(
        (m) => easedProgress >= (m.position === 100 ? LAUNCH_REVEAL_THRESHOLD : m.position),
      ).length;
      if (newVisible !== lastVisible) {
        lastVisible = newVisible;
        setVisibleCount(newVisible);
      }

      if (elapsed < ANIM_DURATION_MS) {
        animFrame = requestAnimationFrame(watch);
      }
    };

    const watchId = setTimeout(() => { animFrame = requestAnimationFrame(watch); }, ANIM_START_DELAY_MS);

    return () => {
      clearTimeout(barId);
      clearTimeout(watchId);
      cancelAnimationFrame(animFrame);
    };
  }, [barRef, displayRef, playheadRef]);

  return { visibleCount };
}

export default function ComingSoonPage() {
  const { isAuthenticated, userEmail } = useAccessControl();
  useComingSoonRedirect();

  const {
    setEmail,
    message,
    setMessage,
    isSubmitting,
    submitted,
    error,
    submitRequest,
  } = useAccessRequest();

  const { showRequestForm, isLoaded } = useComingSoonPageState(isAuthenticated, userEmail);

  const handleRequestAccess = async (e: FormEvent) => {
    e.preventDefault();
    if (userEmail) {
      setEmail(userEmail);
    }
    await submitRequest();
  };

  return (
    <div
      className={`bg-background flex min-h-screen flex-col transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* Top blur gradient */}
      <div className="absolute inset-x-0 top-[-6rem] -z-10 flex justify-center overflow-hidden blur-3xl">
        <div className="h-[24rem] w-full max-w-[60rem] bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 opacity-30" />
      </div>

      <div className="mx-auto flex max-w-3xl grow items-center px-6 py-16 sm:px-8">
        <div className="flex flex-col items-center space-y-8 text-center">
          <Pill>Early Access</Pill>

          <div className="space-y-4">
            <h1 className="text-5xl font-semibold leading-tight text-foreground sm:text-6xl">
              React Foundation
            </h1>
            <p className="text-lg text-foreground/70">
              We&apos;re building something revolutionary for the React ecosystem.
              Support open source maintainers, earn exclusive access, and shape
              the future of React together.
            </p>
          </div>

          {/* Progress */}
          <LaunchProgress />

          {/* Auth/Request Section */}
          <div className="w-full space-y-4">
            {!isAuthenticated && (
              <div className="space-y-4 rounded-3xl border border-border/10 bg-muted/60 p-8">
                <p className="text-sm text-foreground/70">
                  Sign in with GitHub to request early access
                </p>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => signIn('github', { callbackUrl: '/' })}
                  className="w-full"
                >
                  <SiGithub className="h-5 w-5" />
                  Sign in with GitHub
                </Button>
              </div>
            )}

            {isAuthenticated && !showRequestForm && (
              <div className="space-y-2 rounded-3xl border border-destructive/20 bg-destructive/5 p-8">
                <p className="font-semibold text-foreground">Access Restricted</p>
                <p className="text-sm text-foreground/70">
                  You&apos;re signed in as{' '}
                  <span className="font-mono text-foreground">{userEmail}</span>{' '}
                  but you&apos;re not on the allowlist yet.
                </p>
              </div>
            )}

            {showRequestForm && isAuthenticated && userEmail && (
              <div className="rounded-3xl border border-border/10 bg-muted/60 p-8">
                {!submitted ? (
                  <form onSubmit={handleRequestAccess} className="space-y-5 text-left">
                    {error && (
                      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4">
                        <p className="text-sm font-semibold text-destructive">{error}</p>
                      </div>
                    )}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-foreground">
                        GitHub Account
                      </label>
                      <RFDS.Input
                        type="email"
                        required
                        value={userEmail}
                        disabled
                        className="w-full opacity-60"
                      />
                      <p className="mt-1 text-xs text-foreground/50">
                        Using your authenticated GitHub email
                      </p>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-foreground">
                        Why do you want access?{' '}
                        <span className="text-xs font-normal text-foreground/50">
                          (minimum 10 characters)
                        </span>
                      </label>
                      <RFDS.Textarea
                        required
                        minLength={10}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={4}
                        className="w-full"
                        placeholder="Tell us about your involvement in the React ecosystem..."
                      />
                      <p className="mt-1 text-xs text-foreground/50">
                        {message.trim().length}/10 characters minimum
                      </p>
                    </div>
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? 'Sending...' : 'Request Access'}
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-3 py-4 text-center">
                    <div className="text-4xl">✓</div>
                    <p className="font-semibold text-foreground">Request Sent!</p>
                    <p className="text-sm text-foreground/70">
                      We&apos;ll review your request and get back to you soon.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>

      <footer className="border-t border-border/10 py-10 text-sm text-foreground/50">
        <div className="mx-auto max-w-3xl px-6 sm:px-8">
          <div className="flex flex-wrap gap-6 sm:justify-end">
            <Link className="transition hover:text-foreground" href="/privacy">Privacy</Link>
            <Link className="transition hover:text-foreground" href="/terms">Terms</Link>
          </div>
          <p className="mt-4 leading-relaxed">
            Copyright © The Linux Foundation®. All rights reserved. The Linux Foundation has
            registered trademarks and uses trademarks. For more information, including terms
            of use, privacy policy, and trademark usage, please see our{' '}
            <Link
              className="underline hover:text-foreground"
              href="https://www.linuxfoundation.org/legal/policies?__hstc=262006610.e1a66f67cd0c0baa5c7b042e4f9911ce.1768952497248.1771462813100.1771610134177.3&__hssc=262006610.1.1771610134177&__hsfp=360811d5cbd407fc58d506f8b0aa3133"
            >
              Policies page
            </Link>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}

// Launch (position 100) reveals when bar is close — threshold at 90%
const LAUNCH_REVEAL_THRESHOLD = 90;

const LaunchProgress = memo(function LaunchProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const displayRef = useRef<HTMLSpanElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);
  const { visibleCount } = useProgressAnimation(barRef, displayRef, playheadRef);

  return (
    <div className="w-full">
      <div className="mb-4 text-xs text-foreground/50">
        <span>Launch progress</span>
      </div>

      {/* Bar + milestones — tall enough for vertical labels */}
      <div className="relative w-full" style={{ height: '220px' }}>

        {/* Track */}
        <div className="absolute left-0 right-0 top-0 h-0.5 rounded-full bg-muted/60">
          {/* Fill */}
          <div
            ref={barRef}
            className="h-full w-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600"
            style={{ transform: 'scaleX(0)', transformOrigin: 'left', willChange: 'transform' }}
          />

          {/* Playhead — tracks the fill's right edge */}
          <div
            ref={playheadRef}
            className="absolute top-0"
            style={{ left: '0%', transform: 'translateX(-50%)', willChange: 'left' }}
          >
            {/* Current % label above bar */}
            <span
              ref={displayRef}
              className="absolute left-1/2 -translate-x-1/2 w-8 text-center tabular-nums text-xs font-medium text-foreground/70"
              style={{ bottom: '6px' }}
            >
              0%
            </span>
            {/* Tick through the bar */}
            <div
              className="mx-auto w-px bg-foreground/50"
              style={{ height: '10px', marginTop: '-4px' }}
            />
          </div>

          {/* Milestone markers */}
          {MILESTONES.map((m, i) => {
            const isVisible = i < visibleCount;
            const isPending = m.status === 'pending';
            const labelColor = isPending ? 'text-warning/80' : 'text-muted-foreground';

            return (
              <div
                key={m.label}
                className="absolute top-0"
                style={{ left: `${m.position}%` }}
              >
                {/* Dot — pending milestone (Launch) always visible as a destination marker */}
                <div
                  className="absolute h-2.5 w-2.5"
                  style={{
                    top: '-4px',
                    transform: `translateX(-50%) scale(${isVisible || isPending ? 1 : 0})`,
                    opacity: isVisible || isPending ? 1 : 0,
                    transition: 'transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 500ms cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <div
                    className={`h-full w-full rounded-full ${
                      isPending
                        ? 'animate-pulse border-2 border-warning bg-transparent shadow-warning/60 shadow-[0_0_10px_3px]'
                        : 'bg-gradient-to-br from-cyan-400 to-blue-500 shadow-blue-500/30 shadow-[0_0_8px_2px]'
                    }`}
                  />
                </div>

                {/* Staff + label */}
                <div
                  className="absolute flex flex-col items-center"
                  style={{
                    top: '7px',
                    transform: isVisible ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(-6px)',
                    opacity: isVisible ? 1 : 0,
                    transition: 'opacity 400ms cubic-bezier(0.16, 1, 0.3, 1), transform 400ms cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <div className="w-px bg-border/40" style={{ height: '32px' }} />
                  {/* Label: per-char spans, typing top→bottom (last char first) */}
                  <span
                    className={`mt-0.5 whitespace-nowrap text-xs leading-none ${labelColor}`}
                    style={{ writingMode: 'vertical-rl', transform: 'rotate(195deg) translateX(11px)' }}
                  >
                    {m.label.split('').map((char, ci) => (
                      <span
                        key={ci}
                        style={{
                          opacity: isVisible ? 1 : 0,
                          transition: 'opacity 60ms',
                          // last char (visual top) first, first char (visual bottom) last
                          transitionDelay: isVisible
                            ? `${300 + (m.label.length - 1 - ci) * 35}ms`
                            : '0ms',
                        }}
                      >
                        {char}
                      </span>
                    ))}
                  </span>
                </div>
              </div>
            );
          })}
        </div>{/* end track */}
      </div>
    </div>
  );
});
