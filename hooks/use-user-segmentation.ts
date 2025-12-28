'use client';

import { useState, useEffect, useCallback } from 'react';
import { userSegmentationService, UserSegment, SegmentMatch } from '../lib/user-segmentation';
import { trackEvent } from '../lib/analytics';

export interface UseUserSegmentationOptions {
  userId?: string;
  userData?: any;
  autoEvaluate?: boolean;
  trackEvents?: boolean;
}

export interface UseUserSegmentationReturn {
  segments: UserSegment[];
  userSegments: string[];
  segmentMatches: SegmentMatch[];
  isLoading: boolean;
  error: string | null;
  evaluateSegments: (userData?: any) => Promise<SegmentMatch[]>;
  getSegmentById: (id: string) => UserSegment | undefined;
  getSegmentAnalytics: (segmentId: string) => Promise<any>;
  createCustomSegment: (segment: Omit<UserSegment, 'id' | 'createdAt' | 'updatedAt'>) => Promise<UserSegment>;
}

export function useUserSegmentation(options: UseUserSegmentationOptions = {}): UseUserSegmentationReturn {
  const { userId = 'anonymous', userData, autoEvaluate = true, trackEvents = true } = options;
  
  const [segments, setSegments] = useState<UserSegment[]>([]);
  const [userSegments, setUserSegments] = useState<string[]>([]);
  const [segmentMatches, setSegmentMatches] = useState<SegmentMatch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const evaluateSegments = useCallback(async (customUserData?: any): Promise<SegmentMatch[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = customUserData ?? (userData ?? {});
      const matches = await userSegmentationService.evaluateUserSegments(userId, data);
      
      setSegmentMatches(matches);
      setUserSegments(matches.map(match => match.segmentId));
      
      if (trackEvents) {
        await trackEvent('user_segmentation_evaluated', {
          user_id: userId,
          segment_count: matches.length,
          top_segment: matches[0]?.segmentId,
          confidence_scores: matches.map(m => ({ segment: m.segmentId, score: m.score, confidence: m.confidence }))
        });
      }
      
      return matches;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to evaluate segments';
      setError(errorMessage);
      
      if (trackEvents) {
        await trackEvent('user_segmentation_error', {
          user_id: userId,
          error: errorMessage
        });
      }
      
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [userId, trackEvents]);

  const getSegmentById = useCallback((id: string): UserSegment | undefined => {
    return userSegmentationService.getSegmentById(id);
  }, []);

  const getSegmentAnalytics = useCallback(async (segmentId: string): Promise<any> => {
    try {
      const analytics = await userSegmentationService.getSegmentAnalytics(segmentId);
      
      if (trackEvents) {
        await trackEvent('segment_analytics_requested', {
          segment_id: segmentId,
          user_count: analytics?.userCount || 0
        });
      }
      
      return analytics;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get segment analytics';
      setError(errorMessage);
      
      if (trackEvents) {
        await trackEvent('segment_analytics_error', {
          segment_id: segmentId,
          error: errorMessage
        });
      }
      
      return null;
    }
  }, [trackEvents]);

  const createCustomSegment = useCallback(async (segment: Omit<UserSegment, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserSegment> => {
    try {
      const newSegment = await userSegmentationService.createSegment(segment);
      
      setSegments(prev => [...prev, newSegment]);
      
      if (trackEvents) {
        await trackEvent('custom_segment_created', {
          segment_id: newSegment.id,
          segment_name: newSegment.name,
          criteria_types: Object.keys(newSegment.criteria)
        });
      }
      
      return newSegment;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create custom segment';
      setError(errorMessage);
      
      if (trackEvents) {
        await trackEvent('custom_segment_error', {
          error: errorMessage
        });
      }
      
      throw err;
    }
  }, [trackEvents]);

  useEffect(() => {
    const loadSegments = async () => {
      setIsLoading(true);
      try {
        const allSegments = userSegmentationService.getAllSegments();
        setSegments(allSegments);
        
        if (autoEvaluate && userId) {
          await evaluateSegments();
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load segments';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadSegments();
  }, [userId, autoEvaluate, evaluateSegments]);

  return {
    segments,
    userSegments,
    segmentMatches,
    isLoading,
    error,
    evaluateSegments,
    getSegmentById,
    getSegmentAnalytics,
    createCustomSegment
  };
}
