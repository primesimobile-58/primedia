'use client';

import { useState, useEffect, useCallback } from 'react';
import { userSegmentationService, UserSegment } from '../lib/user-segmentation';
import { trackEvent } from '../lib/analytics';

export interface ContentVariant {
  id: string;
  name: string;
  content: {
    headline?: string;
    subheadline?: string;
    description?: string;
    ctaText?: string;
    ctaUrl?: string;
    imageUrl?: string;
    features?: Array<{
      icon: any;
      title: string;
      description: string;
      metric: string;
    }>;
    testimonials?: any[];
    pricing?: any;
  };
  targeting: {
    segments: string[];
    priority: number;
    conditions?: {
      timeOfDay?: { start: number; end: number };
      dayOfWeek?: number[];
      location?: string[];
      deviceType?: string[];
    };
  };
  isActive: boolean;
}

export interface DynamicContentTarget {
  elementId: string;
  variants: ContentVariant[];
  defaultVariant?: string;
  fallbackContent?: any;
}

export interface UseDynamicContentTargetingOptions {
  userId?: string;
  userSegments?: string[];
  location?: string;
  deviceType?: string;
  trackEvents?: boolean;
  autoTarget?: boolean;
}

export interface UseDynamicContentTargetingReturn {
  contentVariants: ContentVariant[];
  targetedContent: Record<string, any>;
  isLoading: boolean;
  error: string | null;
  getContentForElement: (elementId: string) => any;
  createContentVariant: (variant: Omit<ContentVariant, 'id'>) => ContentVariant;
  updateContentTargeting: (elementId: string, variants: ContentVariant[]) => void;
  trackContentView: (elementId: string, variantId: string) => void;
  trackContentClick: (elementId: string, variantId: string, action: string) => void;
}

const defaultContentVariants: Record<string, ContentVariant[]> = {
  'hero-section': [
    {
      id: 'hero-enterprise',
      name: 'Enterprise Hero',
      content: {
        headline: 'Enterprise AI Intelligence Platform',
        subheadline: 'Transform Your Business with Advanced AI Analytics',
        description: 'Scale your enterprise operations with our comprehensive AI-powered platform designed for large organizations.',
        ctaText: 'Schedule Enterprise Demo',
        ctaUrl: '/enterprise-demo',
        features: [
          { icon: 'ChartBar', title: 'Advanced Analytics', description: 'Deep insights into your business performance', metric: '99.9% Accuracy' },
          { icon: 'Plug', title: 'Custom Integrations', description: 'Seamlessly connect with your existing tools', metric: '500+ Integrations' },
          { icon: 'Headphones', title: '24/7 Support', description: 'Round-the-clock expert assistance', metric: '5min Response' },
          { icon: 'Shield', title: 'SLA Guarantee', description: 'Enterprise-grade reliability promise', metric: '99.99% Uptime' }
        ]
      },
      targeting: {
        segments: ['enterprise-prospects', 'high-intent-visitors'],
        priority: 1
      },
      isActive: true
    },
    {
      id: 'hero-startup',
      name: 'Startup Hero',
      content: {
        headline: 'AI Intelligence for Growing Startups',
        subheadline: 'Accelerate Your Startup Journey with Smart Analytics',
        description: 'Get enterprise-level AI capabilities at startup-friendly prices. Perfect for growing teams.',
        ctaText: 'Start Free Trial',
        ctaUrl: '/free-trial',
        features: [
          { icon: 'Rocket', title: 'Quick Setup', description: 'Get started in minutes, not days', metric: '5min Setup' },
          { icon: 'DollarSign', title: 'Affordable Pricing', description: 'Startup-friendly pricing plans', metric: 'Save 70%' },
          { icon: 'TrendingUp', title: 'Scalable Plans', description: 'Grow without platform limitations', metric: 'Unlimited Growth' },
          { icon: 'BookOpen', title: 'Startup Resources', description: 'Exclusive startup guides and templates', metric: '100+ Resources' }
        ]
      },
      targeting: {
        segments: ['startup-enthusiasts'],
        priority: 2
      },
      isActive: true
    },
    {
      id: 'hero-default',
      name: 'Default Hero',
      content: {
        headline: 'Alya Intelligence Platform',
        subheadline: 'Next-Generation AI Analytics for Modern Businesses',
        description: 'Harness the power of artificial intelligence to transform your data into actionable insights.',
        ctaText: 'Get Started',
        ctaUrl: '/get-started',
        features: [
          { icon: 'Brain', title: 'AI-Powered Analytics', description: 'Advanced machine learning insights', metric: '95% Accuracy' },
          { icon: 'Zap', title: 'Real-time Insights', description: 'Get instant actionable intelligence', metric: 'Sub-second' },
          { icon: 'Plug', title: 'Easy Integration', description: 'Connect with your favorite tools', metric: '50+ Platforms' },
          { icon: 'TrendingUp', title: 'Scalable Platform', description: 'Grow from startup to enterprise', metric: 'Unlimited Scale' }
        ]
      },
      targeting: {
        segments: [],
        priority: 10
      },
      isActive: true
    }
  ],
  'features-section': [
    {
      id: 'features-enterprise',
      name: 'Enterprise Features',
      content: {
        headline: 'Enterprise-Grade Features',
        description: 'Built for scale, security, and performance',
        features: [
          { icon: 'Shield', title: 'Advanced Security & Compliance', description: 'Enterprise-grade security with SOC 2 compliance', metric: '100% Secure' },
          { icon: 'Code', title: 'Custom API Integrations', description: 'Seamless integration with your existing systems', metric: '500+ APIs' },
          { icon: 'UserCheck', title: 'Dedicated Account Manager', description: 'Personalized support from day one', metric: '24/7 Support' },
          { icon: 'Activity', title: '99.9% Uptime SLA', description: 'Guaranteed reliability for mission-critical operations', metric: '99.99% Uptime' },
          { icon: 'BarChart3', title: 'Advanced Reporting & Analytics', description: 'Deep insights into your business performance', metric: 'Real-time Data' },
          { icon: 'Palette', title: 'White-label Solutions', description: 'Fully branded experience for your customers', metric: '100% Customizable' }
        ]
      },
      targeting: {
        segments: ['enterprise-prospects'],
        priority: 1
      },
      isActive: true
    },
    {
      id: 'features-startup',
      name: 'Startup Features',
      content: {
        headline: 'Startup-Friendly Features',
        description: 'Powerful tools that grow with your business',
        features: [
          { icon: 'Clock', title: 'Easy 5-Minute Setup', description: 'Get up and running in minutes', metric: '5min Setup' },
          { icon: 'DollarSign', title: 'Affordable Pricing Plans', description: 'Budget-friendly pricing for startups', metric: 'Save 80%' },
          { icon: 'MousePointer', title: 'No-Code Integration', description: 'Simple drag-and-drop setup process', metric: 'Zero Code' },
          { icon: 'Smartphone', title: 'Mobile-First Design', description: 'Optimized for mobile experiences', metric: '100% Responsive' },
          { icon: 'TrendingUp', title: 'Growth Analytics', description: 'Track your startup growth metrics', metric: 'Real-time KPIs' },
          { icon: 'Users', title: 'Community Support', description: 'Join our vibrant startup community', metric: '10k+ Members' }
        ]
      },
      targeting: {
        segments: ['startup-enthusiasts'],
        priority: 1
      },
      isActive: true
    },
    {
      id: 'features-default',
      name: 'Default Features',
      content: {
        headline: 'Powerful Features',
        description: 'Everything you need to succeed',
        features: [
          { icon: 'Brain', title: 'AI-Powered Analytics', description: 'Advanced machine learning analytics', metric: '95% Accuracy' },
          { icon: 'LayoutDashboard', title: 'Real-time Dashboards', description: 'Live data visualization and insights', metric: 'Sub-second Updates' },
          { icon: 'FileBarChart', title: 'Custom Reports', description: 'Tailored reporting for your needs', metric: 'Unlimited Reports' },
          { icon: 'Users', title: 'Team Collaboration', description: 'Work together seamlessly across teams', metric: 'Unlimited Users' },
          { icon: 'Code', title: 'API Access', description: 'Full programmatic access to all features', metric: 'REST & GraphQL' },
          { icon: 'Smartphone', title: 'Mobile App', description: 'Access your data anywhere, anytime', metric: 'iOS & Android' }
        ]
      },
      targeting: {
        segments: [],
        priority: 10
      },
      isActive: true
    }
  ],
  'pricing-section': [
    {
      id: 'pricing-enterprise',
      name: 'Enterprise Pricing',
      content: {
        headline: 'Enterprise Plans',
        description: 'Custom pricing for enterprise needs',
        pricing: {
          type: 'custom',
          startingPrice: 'Contact Sales',
          features: [
            'Unlimited Users',
            'Custom Integrations',
            'Advanced Analytics',
            'Dedicated Support',
            'SLA Guarantee',
            'Custom Training'
          ]
        }
      },
      targeting: {
        segments: ['enterprise-prospects', 'high-intent-visitors'],
        priority: 1
      },
      isActive: true
    },
    {
      id: 'pricing-startup',
      name: 'Startup Pricing',
      content: {
        headline: 'Startup Plans',
        description: 'Affordable plans for growing teams',
        pricing: {
          type: 'tiered',
          plans: [
            {
              name: 'Starter',
              price: '$29/month',
              features: ['Up to 5 users', 'Basic analytics', 'Email support']
            },
            {
              name: 'Growth',
              price: '$99/month',
              features: ['Up to 25 users', 'Advanced analytics', 'Priority support']
            },
            {
              name: 'Pro',
              price: '$299/month',
              features: ['Unlimited users', 'All features', 'Dedicated support']
            }
          ]
        }
      },
      targeting: {
        segments: ['startup-enthusiasts'],
        priority: 1
      },
      isActive: true
    }
  ]
};

class DynamicContentTargetingService {
  private contentTargets: Map<string, DynamicContentTarget> = new Map();
  private contentViews: Map<string, number> = new Map();
  private contentClicks: Map<string, number> = new Map();

  constructor() {
    this.initializeDefaultContent();
  }

  private initializeDefaultContent() {
    Object.entries(defaultContentVariants).forEach(([elementId, variants]) => {
      this.contentTargets.set(elementId, {
        elementId,
        variants,
        defaultVariant: variants.find(v => v.targeting.priority === 10)?.id
      });
    });
  }

  getTargetedContent(elementId: string, userSegments: string[] = [], options: any = {}): any {
    const target = this.contentTargets.get(elementId);
    if (!target) return null;

    const eligibleVariants = target.variants.filter(variant => {
      if (!variant.isActive) return false;
      
      if (variant.targeting.segments.length === 0) return true;
      
      return variant.targeting.segments.some(segment => userSegments.includes(segment));
    });

    if (eligibleVariants.length === 0) {
      const defaultVariant = target.variants.find(v => v.id === target.defaultVariant);
      return defaultVariant?.content || target.fallbackContent;
    }

    eligibleVariants.sort((a, b) => a.targeting.priority - b.targeting.priority);
    
    const selectedVariant = eligibleVariants[0];
    
    this.trackContentView(elementId, selectedVariant.id);
    
    return selectedVariant.content;
  }

  trackContentView(elementId: string, variantId: string): void {
    const key = `${elementId}:${variantId}:views`;
    const currentViews = this.contentViews.get(key) || 0;
    this.contentViews.set(key, currentViews + 1);
    
    trackEvent('content_view', {
      element_id: elementId,
      variant_id: variantId,
      view_count: currentViews + 1
    });
  }

  trackContentClick(elementId: string, variantId: string, action: string): void {
    const key = `${elementId}:${variantId}:${action}:clicks`;
    const currentClicks = this.contentClicks.get(key) || 0;
    this.contentClicks.set(key, currentClicks + 1);
    
    trackEvent('content_click', {
      element_id: elementId,
      variant_id: variantId,
      action: action,
      click_count: currentClicks + 1
    });
  }

  getContentAnalytics(elementId: string): any {
    const target = this.contentTargets.get(elementId);
    if (!target) return null;

    const analytics = {
      elementId,
      variants: target.variants.map(variant => {
        const viewKey = `${elementId}:${variant.id}:views`;
        const clickKey = `${elementId}:${variant.id}:cta:clicks`;
        
        const views = this.contentViews.get(viewKey) || 0;
        const clicks = this.contentClicks.get(clickKey) || 0;
        
        return {
          variantId: variant.id,
          variantName: variant.name,
          views,
          clicks,
          ctr: views > 0 ? clicks / views : 0,
          isActive: variant.isActive,
          targeting: variant.targeting
        };
      }),
      totalViews: 0,
      totalClicks: 0,
      avgCtr: 0
    };

    analytics.variants.forEach(variant => {
      analytics.totalViews += variant.views;
      analytics.totalClicks += variant.clicks;
    });

    analytics.avgCtr = analytics.totalViews > 0 ? analytics.totalClicks / analytics.totalViews : 0;

    return analytics;
  }

  addContentTarget(target: DynamicContentTarget): void {
    this.contentTargets.set(target.elementId, target);
  }

  updateContentTarget(elementId: string, updates: Partial<DynamicContentTarget>): void {
    const target = this.contentTargets.get(elementId);
    if (target) {
      this.contentTargets.set(elementId, { ...target, ...updates });
    }
  }

  createContentVariant(elementId: string, variant: Omit<ContentVariant, 'id'>): ContentVariant {
    const newVariant: ContentVariant = {
      ...variant,
      id: `variant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    const target = this.contentTargets.get(elementId);
    if (target) {
      target.variants.push(newVariant);
      this.contentTargets.set(elementId, target);
    }

    return newVariant;
  }
}

const dynamicContentTargetingService = new DynamicContentTargetingService();

export function useDynamicContentTargeting(options: UseDynamicContentTargetingOptions = {}): UseDynamicContentTargetingReturn {
  const { userId = 'anonymous', userSegments = [], location, deviceType, trackEvents = true, autoTarget = true } = options;
  
  const [contentVariants, setContentVariants] = useState<ContentVariant[]>([]);
  const [targetedContent, setTargetedContent] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getContentForElement = useCallback((elementId: string): any => {
    try {
      const content = dynamicContentTargetingService.getTargetedContent(
        elementId,
        userSegments,
        { location, deviceType }
      );
      
      if (trackEvents && content) {
        trackEvent('content_targeted', {
          element_id: elementId,
          user_id: userId,
          user_segments: userSegments,
          content_variant: content.id
        });
      }
      
      return content;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get targeted content';
      setError(errorMessage);
      
      if (trackEvents) {
        trackEvent('content_targeting_error', {
          element_id: elementId,
          error: errorMessage
        });
      }
      
      return null;
    }
  }, [userSegments, location, deviceType, userId, trackEvents]);

  const createContentVariant = useCallback((variant: Omit<ContentVariant, 'id'>): ContentVariant => {
    try {
      const newVariant = dynamicContentTargetingService.createContentVariant('custom', variant);
      
      if (trackEvents) {
        trackEvent('content_variant_created', {
          variant_id: newVariant.id,
          variant_name: newVariant.name,
          targeting_segments: newVariant.targeting.segments
        });
      }
      
      return newVariant;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create content variant';
      setError(errorMessage);
      
      if (trackEvents) {
        trackEvent('content_variant_error', {
          error: errorMessage
        });
      }
      
      throw err;
    }
  }, [trackEvents]);

  const updateContentTargeting = useCallback((elementId: string, variants: ContentVariant[]): void => {
    try {
      dynamicContentTargetingService.updateContentTarget(elementId, { variants });
      
      if (trackEvents) {
        trackEvent('content_targeting_updated', {
          element_id: elementId,
          variant_count: variants.length
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update content targeting';
      setError(errorMessage);
      
      if (trackEvents) {
        trackEvent('content_targeting_update_error', {
          element_id: elementId,
          error: errorMessage
        });
      }
    }
  }, [trackEvents]);

  const trackContentView = useCallback((elementId: string, variantId: string): void => {
    dynamicContentTargetingService.trackContentView(elementId, variantId);
  }, []);

  const trackContentClick = useCallback((elementId: string, variantId: string, action: string): void => {
    dynamicContentTargetingService.trackContentClick(elementId, variantId, action);
  }, []);

  useEffect(() => {
    if (autoTarget) {
      setIsLoading(true);
      try {
        const heroContent = getContentForElement('hero-section');
        const featuresContent = getContentForElement('features-section');
        const pricingContent = getContentForElement('pricing-section');
        
        setTargetedContent({
          'hero-section': heroContent,
          'features-section': featuresContent,
          'pricing-section': pricingContent
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to auto-target content';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  }, [autoTarget, getContentForElement]);

  return {
    contentVariants,
    targetedContent,
    isLoading,
    error,
    getContentForElement,
    createContentVariant,
    updateContentTargeting,
    trackContentView,
    trackContentClick
  };
}

export { dynamicContentTargetingService };
export default useDynamicContentTargeting;