'use client';

import { useEffect, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { analytics } from '@/lib/analytics';

export function useAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize analytics on mount
  useEffect(() => {
    analytics.initialize();
  }, []);

  // Track page views on route changes
  useEffect(() => {
    if (pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      analytics.trackPageView(url, document.title);
    }
  }, [pathname, searchParams]);

  // Track scroll depth
  useEffect(() => {
    let maxScroll = 0;
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = Math.round((scrollTop / docHeight) * 100);

        if (scrollPercent > maxScroll) {
          maxScroll = scrollPercent;
          
          // Track major scroll milestones
          if (scrollPercent === 25 || scrollPercent === 50 || scrollPercent === 75 || scrollPercent === 100) {
            analytics.trackScrollDepth(scrollPercent, pathname);
          }
        }
      }, 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [pathname]);

  // Track time on page
  useEffect(() => {
    const startTime = Date.now();
    
    return () => {
      const duration = Math.round((Date.now() - startTime) / 1000);
      analytics.trackTimeOnPage(duration, pathname);
    };
  }, [pathname]);

  const trackEvent = useCallback((eventName: string, properties?: Record<string, any>) => {
    analytics.track({ name: eventName, properties });
  }, []);

  const trackButtonClick = useCallback((buttonName: string, properties?: Record<string, any>) => {
    analytics.trackButtonClick(buttonName, properties);
  }, []);

  const trackFormSubmission = useCallback((formType: string, data: Record<string, any>) => {
    analytics.trackFormSubmission(formType, data);
  }, []);

  const trackDemoRequest = useCallback((data: Record<string, any>) => {
    analytics.trackDemoRequest(data);
  }, []);

  const trackNewsletterSignup = useCallback((email: string, source?: string) => {
    analytics.trackNewsletterSignup(email, source);
  }, []);

  const identifyUser = useCallback((userId: string, profile?: any) => {
    analytics.identify(userId, profile);
  }, []);

  return {
    trackEvent,
    trackButtonClick,
    trackFormSubmission,
    trackDemoRequest,
    trackNewsletterSignup,
    identifyUser,
  };
}

export function useScrollAnimation(ref: React.RefObject<HTMLElement>, animationName: string) {
  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            analytics.track({
              name: 'Animation Triggered',
              properties: {
                animation_name: animationName,
                element_type: entry.target.tagName.toLowerCase(),
              }
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(ref.current);

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, animationName]);
}