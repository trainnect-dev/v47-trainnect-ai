'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { usePostHog } from 'posthog-js/react';

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();

  useEffect(() => {
    if (!pathname || !posthog) {
      return;
    }

    try {
      let url = window.origin + pathname;
      if (searchParams && searchParams.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      
      posthog.capture('$pageview', { 
        $current_url: url,
        path: pathname,
        search: searchParams ? searchParams.toString() : '',
        referrer: document.referrer || '',
        title: document.title || '',
      });

      if (process.env.NODE_ENV === 'development') {
        console.log(`PostHog pageview captured: ${url}`);
      }
    } catch (error) {
      console.warn('Failed to capture PostHog pageview:', error);
    }
  }, [pathname, searchParams, posthog]);

  return null;
}

export default PostHogPageView; 