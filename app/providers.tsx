'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useEffect, useState } from 'react';
import PostHogPageView from './PostHogPageView';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    // Initialize PostHog only on the client side and only once
    if (typeof window !== 'undefined' && !isInitialized) {
      const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY || '';
      const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';
      
      if (apiKey) {
        try {
          posthog.init(apiKey, {
            api_host: apiHost,
            capture_pageview: false, // Disable automatic pageview capture
            capture_pageleave: true, // Enable pageleave capture
            persistence: 'localStorage',
            autocapture: true,
            loaded: (posthogInstance) => {
              if (process.env.NODE_ENV === 'development') {
                // In development, log that PostHog was loaded
                console.log('PostHog initialized');
              }
              setIsInitialized(true);
            },
          });
        } catch (error) {
          console.error('Failed to initialize PostHog:', error);
        }
      } else {
        console.warn('PostHog API key not provided. Feature flags will use default values.');
      }
    }
  }, [isInitialized]);

  // If PostHog is not initialized, still render children but without the provider
  if (!isInitialized && typeof window !== 'undefined') {
    return <>{children}</>;
  }

  return (
    <PHProvider client={posthog}>
      <PostHogPageView />
      {children}
    </PHProvider>
  );
} 