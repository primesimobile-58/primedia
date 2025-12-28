import { useState, useEffect, useCallback } from 'react';
import ABTestingService, { ABTest, ABTestVariant, UserAssignment } from '@/lib/ab-testing';
import { useAnalytics } from './use-analytics';

const abTestingService = new ABTestingService();

export interface UseABTestingOptions {
  userId?: string;
  sessionId?: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  country?: string;
  referrer?: string;
  autoTrackConversions?: boolean;
}

export interface ABTestAssignment {
  test: ABTest;
  variant: ABTestVariant;
  assignment: UserAssignment;
}

export function useABTesting(options: UseABTestingOptions) {
  const [activeTests, setActiveTests] = useState<ABTest[]>([]);
  const [assignments, setAssignments] = useState<Record<string, ABTestAssignment>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { trackEvent } = useAnalytics();

  const {
    userId = `anonymous_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    deviceType,
    country,
    referrer,
    autoTrackConversions = true
  } = options;

  // Load active tests on mount
  useEffect(() => {
    loadActiveTests();
  }, [userId, sessionId]);

  const loadActiveTests = async () => {
    try {
      setIsLoading(true);
      const tests = await abTestingService.getActiveTests(userId, sessionId);
      setActiveTests(tests);

      // Assign user to tests
      for (const test of tests) {
        await assignToTest(test);
      }
    } catch (error) {
      console.error('Error loading active tests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const assignToTest = async (test: ABTest) => {
    try {
      const variantId = await abTestingService.assignUserToTest(
        test.id,
        userId,
        sessionId,
        deviceType,
        country,
        referrer
      );

      if (variantId) {
        const variant = test.variants.find(v => v.id === variantId);
        if (variant) {
          const assignment: UserAssignment = {
            userId,
            testId: test.id,
            variantId,
            assignedAt: new Date(),
            sessionId,
            deviceType,
            country,
            referrer
          };

          setAssignments(prev => ({
            ...prev,
            [test.id]: {
              test,
              variant,
              assignment
            }
          }));

          // Track assignment
          trackEvent('ab_test_assignment', {
            test_id: test.id,
            variant_id: variantId,
            test_name: test.name,
            variant_name: variant.name
          });
        }
      }
    } catch (error) {
      console.error(`Error assigning to test ${test.id}:`, error);
    }
  };

  const getVariantContent = useCallback((testId: string, contentKey: string): any => {
    const assignment = assignments[testId];
    if (!assignment) return null;

    return assignment.variant.content[contentKey];
  }, [assignments]);

  const trackConversion = useCallback(async (
    testId: string,
    eventName: string,
    value?: number,
    metadata?: Record<string, any>
  ) => {
    const assignment = assignments[testId];
    if (!assignment) {
      console.warn(`No assignment found for test ${testId}`);
      return;
    }

    try {
      await abTestingService.trackConversion(
        testId,
        userId,
        assignment.variant.id,
        eventName,
        value,
        metadata
      );

      // Track conversion in analytics
      trackEvent('ab_test_conversion', {
        test_id: testId,
        variant_id: assignment.variant.id,
        event_name: eventName,
        value: value || 1,
        test_name: assignment.test.name,
        variant_name: assignment.variant.name
      });

      console.log(`Conversion tracked for test ${testId}: ${eventName}`);
    } catch (error) {
      console.error(`Error tracking conversion for test ${testId}:`, error);
    }
  }, [assignments, userId, trackEvent]);

  const getTestResults = useCallback(async (testId: string) => {
    try {
      const results = await abTestingService.getTestResults(testId);
      return results;
    } catch (error) {
      console.error(`Error getting results for test ${testId}:`, error);
      return [];
    }
  }, []);

  const isUserAssignedToTest = useCallback((testId: string): boolean => {
    return !!assignments[testId];
  }, [assignments]);

  const getUserVariant = useCallback((testId: string): ABTestVariant | null => {
    return assignments[testId]?.variant || null;
  }, [assignments]);

  // Auto-track common conversions
  useEffect(() => {
    if (!autoTrackConversions) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Track CTA clicks
      if (target.closest('[data-ab-test-cta]')) {
        const testId = target.closest('[data-ab-test-cta]')?.getAttribute('data-ab-test-cta');
        if (testId && assignments[testId]) {
          trackConversion(testId, 'cta_click', 1, {
            element: target.tagName,
            text: target.textContent?.trim()
          });
        }
      }

      // Track form submissions
      if (target.closest('[data-ab-test-form]')) {
        const testId = target.closest('[data-ab-test-form]')?.getAttribute('data-ab-test-form');
        if (testId && assignments[testId]) {
          trackConversion(testId, 'form_submit', 1, {
            form_type: target.closest('form')?.getAttribute('data-form-type')
          });
        }
      }
    };

    const handleScroll = () => {
      const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      
      // Track scroll depth for all assigned tests
      Object.keys(assignments).forEach(testId => {
        if (scrollPercentage >= 75) {
          trackConversion(testId, 'scroll_depth_75', 1, {
            scroll_percentage: Math.round(scrollPercentage)
          });
        }
      });
    };

    document.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [assignments, trackConversion, autoTrackConversions]);

  return {
    activeTests,
    assignments,
    isLoading,
    getVariantContent,
    trackConversion,
    getTestResults,
    isUserAssignedToTest,
    getUserVariant,
    refreshTests: loadActiveTests
  };
}

// Hook for specific A/B test
export function useABTest(testId: string, options: UseABTestingOptions) {
  const { assignments, getVariantContent, trackConversion, isUserAssignedToTest, getUserVariant } = useABTesting(options);
  
  const assignment = assignments[testId];
  const variant = assignment?.variant;
  const isAssigned = isUserAssignedToTest(testId);

  return {
    variant,
    assignment,
    isAssigned,
    getContent: (contentKey: string) => getVariantContent(testId, contentKey),
    trackConversion: (eventName: string, value?: number, metadata?: Record<string, any>) => 
      trackConversion(testId, eventName, value, metadata),
    getUserVariant: () => getUserVariant(testId)
  };
}

// Pre-defined A/B test configurations for common homepage elements
export const HOMEPAGE_AB_TESTS = {
  HERO_TITLE: {
    id: 'homepage_hero_title',
    name: 'Hero Title Optimization',
    description: 'Test different hero title variations for maximum engagement',
    variants: [
      {
        id: 'control',
        name: 'Control',
        trafficWeight: 0.5,
        isControl: true,
        content: {
          heroTitle: "Transform Your Marketing with AI Intelligence",
          heroSubtitle: "Predict customer behavior, optimize campaigns, and drive unprecedented growth with Alya's advanced AI platform"
        }
      },
      {
        id: 'variant_b',
        name: 'Variant B - Benefit Focus',
        trafficWeight: 0.5,
        isControl: false,
        content: {
          heroTitle: "2x Your Marketing ROI with AI",
          heroSubtitle: "Enterprise brands increase revenue by 200% using predictive analytics. See results in 30 days or less."
        }
      }
    ]
  },

  CTA_BUTTON: {
    id: 'homepage_cta_button',
    name: 'CTA Button Optimization',
    description: 'Test different CTA button texts and colors',
    variants: [
      {
        id: 'control',
        name: 'Control',
        trafficWeight: 0.33,
        isControl: true,
        content: {
          ctaText: "Start Free Trial",
          ctaColor: "bg-blue-600 hover:bg-blue-700"
        }
      },
      {
        id: 'variant_b',
        name: 'Variant B - Urgency',
        trafficWeight: 0.33,
        isControl: false,
        content: {
          ctaText: "Get Started Now",
          ctaColor: "bg-green-600 hover:bg-green-700"
        }
      },
      {
        id: 'variant_c',
        name: 'Variant C - Value',
        trafficWeight: 0.34,
        isControl: false,
        content: {
          ctaText: "See AI in Action",
          ctaColor: "bg-purple-600 hover:bg-purple-700"
        }
      }
    ]
  },

  SOCIAL_PROOF: {
    id: 'homepage_social_proof',
    name: 'Social Proof Optimization',
    description: 'Test different social proof elements',
    variants: [
      {
        id: 'control',
        name: 'Control - Customer Count',
        trafficWeight: 0.5,
        isControl: true,
        content: {
          socialProofText: "Trusted by 10,000+ companies worldwide"
        }
      },
      {
        id: 'variant_b',
        name: 'Variant B - Revenue Impact',
        trafficWeight: 0.5,
        isControl: false,
        content: {
          socialProofText: "Generated $500M+ in additional revenue for our customers"
        }
      }
    ]
  },

  PRICING_HIGHLIGHT: {
    id: 'homepage_pricing_highlight',
    name: 'Pricing Highlight Optimization',
    description: 'Test different pricing presentation strategies',
    variants: [
      {
        id: 'control',
        name: 'Control - Monthly',
        trafficWeight: 0.25,
        isControl: true,
        content: {
          pricingHighlight: "Starting at $299/month"
        }
      },
      {
        id: 'variant_b',
        name: 'Variant B - Annual Savings',
        trafficWeight: 0.25,
        isControl: false,
        content: {
          pricingHighlight: "Save 20% with annual billing - $239/month"
        }
      },
      {
        id: 'variant_c',
        name: 'Variant C - ROI Focus',
        trafficWeight: 0.25,
        isControl: false,
        content: {
          pricingHighlight: "ROI in 30 days or your money back"
        }
      },
      {
        id: 'variant_d',
        name: 'Variant D - Enterprise',
        trafficWeight: 0.25,
        isControl: false,
        content: {
          pricingHighlight: "Custom pricing for enterprise needs"
        }
      }
    ]
  }
};

export default useABTesting;