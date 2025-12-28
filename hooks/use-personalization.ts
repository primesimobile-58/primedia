'use client';

import { useEffect, useCallback } from 'react';
import { personalizationService, UserBehavior, PageView, ClickEvent } from '@/lib/personalization';
import { useAnalytics } from './use-analytics';

export function usePersonalization(userId?: string) {
  const { trackEvent } = useAnalytics();
  const sessionId = useCallback(() => {
    let session = sessionStorage.getItem('personalization_session_id');
    if (!session) {
      session = Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('personalization_session_id', session);
    }
    return session;
  }, []);

  // Track page view
  const trackPageView = useCallback((url: string, title: string, loadTime: number, referrer?: string) => {
    const pageView: PageView = {
      url,
      title,
      timestamp: new Date(),
      referrer,
      loadTime,
    };

    const behavior: Partial<UserBehavior> = {
      userId,
      sessionId: sessionId(),
      pageViews: [pageView],
      timestamp: new Date(),
    };

    personalizationService.trackUserBehavior(userId || 'anonymous', behavior);
    
    trackEvent('Page View Tracked', {
      url,
      title,
      loadTime,
      userId: userId || 'anonymous',
    });
  }, [userId, sessionId, trackEvent]);

  // Track click event
  const trackClick = useCallback((element: string, text?: string, url?: string, position?: { x: number; y: number }) => {
    const clickEvent: ClickEvent = {
      element,
      text,
      url,
      position: position || { x: 0, y: 0 },
      timestamp: new Date(),
    };

    const behavior: Partial<UserBehavior> = {
      userId,
      sessionId: sessionId(),
      clicks: [clickEvent],
      timestamp: new Date(),
    };

    personalizationService.trackUserBehavior(userId || 'anonymous', behavior);
    
    trackEvent('Click Tracked', {
      element,
      text,
      url,
      userId: userId || 'anonymous',
    });
  }, [userId, sessionId, trackEvent]);

  // Track scroll depth
  const trackScrollDepth = useCallback((depth: number) => {
    const behavior: Partial<UserBehavior> = {
      userId,
      sessionId: sessionId(),
      scrollDepth: depth,
      timestamp: new Date(),
    };

    personalizationService.trackUserBehavior(userId || 'anonymous', behavior);
    
    trackEvent('Scroll Depth Tracked', {
      depth,
      userId: userId || 'anonymous',
    });
  }, [userId, sessionId, trackEvent]);

  // Track time on page
  const trackTimeOnPage = useCallback((duration: number) => {
    const behavior: Partial<UserBehavior> = {
      userId,
      sessionId: sessionId(),
      timeOnPage: duration,
      timestamp: new Date(),
    };

    personalizationService.trackUserBehavior(userId || 'anonymous', behavior);
    
    trackEvent('Time on Page Tracked', {
      duration,
      userId: userId || 'anonymous',
    });
  }, [userId, sessionId, trackEvent]);

  // Track form interaction
  const trackFormInteraction = useCallback((formId: string, formType: string, completed: boolean = false) => {
    const behavior: Partial<UserBehavior> = {
      userId,
      sessionId: sessionId(),
      formInteractions: [{
        formId,
        formType,
        startedAt: new Date(),
        completedAt: completed ? new Date() : undefined,
        fieldInteractions: [],
        abandoned: !completed,
      }],
      timestamp: new Date(),
    };

    personalizationService.trackUserBehavior(userId || 'anonymous', behavior);
    
    trackEvent('Form Interaction Tracked', {
      formId,
      formType,
      completed,
      userId: userId || 'anonymous',
    });
  }, [userId, sessionId, trackEvent]);

  // Get personalized content recommendations
  const getPersonalizedContent = useCallback(() => {
    if (!userId) return [];
    return personalizationService.getPersonalizedContent(userId);
  }, [userId]);

  // Get personalized message
  const getPersonalizedMessage = useCallback((context: string) => {
    if (!userId) return personalizationService.getPersonalizedMessage('anonymous', context);
    return personalizationService.getPersonalizedMessage(userId, context);
  }, [userId]);

  // Get user profile
  const getUserProfile = useCallback(() => {
    if (!userId) return undefined;
    return personalizationService.getUserProfile(userId);
  }, [userId]);

  // Initialize personalization on mount
  useEffect(() => {
    if (userId) {
      trackEvent('Personalization Initialized', { userId });
    }
  }, [userId, trackEvent]);

  return {
    trackPageView,
    trackClick,
    trackScrollDepth,
    trackTimeOnPage,
    trackFormInteraction,
    getPersonalizedContent,
    getPersonalizedMessage,
    getUserProfile,
  };
}