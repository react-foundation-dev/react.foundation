/**
 * Coming Soon Page
 * Blocks access to site unless user is on allowlist
 */

'use client';

import { useState, useEffect, type FormEvent } from 'react';
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
          <div className="w-full space-y-3">
            <div className="flex items-center justify-between text-xs text-foreground/50">
              <span>Launch progress</span>
              <span>90%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full w-[90%] rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600" />
            </div>
            <div className="flex items-center justify-between pt-1">
              <StatusDot label="Backend" status="online" />
              <StatusDot label="API" status="online" />
              <StatusDot label="Launch" status="pending" />
            </div>
          </div>

          {/* Auth/Request Section */}
          <div className="w-full space-y-4">
            {!isAuthenticated && (
              <div className="space-y-4 rounded-3xl border border-border/10 bg-muted/60 p-8">
                <p className="text-sm text-foreground/70">
                  Sign in with GitHub to request early access
                </p>
                <Button
                  variant="secondary"
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

function StatusDot({ label, status }: { label: string; status: 'online' | 'pending' | 'offline' }) {
  const colors = {
    online: 'bg-success',
    pending: 'bg-warning animate-pulse',
    offline: 'bg-destructive',
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`h-2 w-2 rounded-full ${colors[status]}`} />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
