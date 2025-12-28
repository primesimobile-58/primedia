'use client';

import { useState, useEffect, useCallback } from 'react';
import { userSegmentationService } from '../lib/user-segmentation';
import { trackEvent } from '../lib/analytics';

export interface AudienceTarget {
  id: string;
  name: string;
  description: string;
  segments: string[];
  conditions: {
    demographics?: {
      location?: string[];
      companySize?: string[];
      industry?: string[];
      role?: string[];
    };
    behavior?: {
      minEngagementScore?: number;
      minBehaviorScore?: number;
      conversionProbability?: { min: number; max: number };
      lastActivity?: { withinHours: number };
    };
    technology?: {
      deviceType?: string[];
      browser?: string[];
      operatingSystem?: string[];
    };
    time?: {
      timezone?: string[];
      dayOfWeek?: number[];
      hourOfDay?: { start: number; end: number };
    };
  };
  size: number;
  estimatedReach: number;
  conversionRate: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CampaignAudience {
  campaignId: string;
  audienceId: string;
  targeting: {
    segments: string[];
    conditions: any;
    exclusions: string[];
  };
  performance: {
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
    conversionRate: number;
    costPerClick: number;
    costPerConversion: number;
  };
  status: 'active' | 'paused' | 'completed';
  startDate: Date;
  endDate?: Date;
}

export interface RealTimeAudience {
  audienceId: string;
  currentUsers: number;
  activeUsers: number;
  engagedUsers: number;
  conversionProbability: number;
  averageEngagement: number;
  topSegments: string[];
  geographicDistribution: Record<string, number>;
  deviceDistribution: Record<string, number>;
  lastUpdated: Date;
}

export interface UseRealTimeAudienceTargetingOptions {
  userId?: string;
  campaignId?: string;
  trackEvents?: boolean;
  refreshInterval?: number;
  autoTarget?: boolean;
}

export interface UseRealTimeAudienceTargetingReturn {
  audiences: AudienceTarget[];
  activeAudiences: AudienceTarget[];
  realTimeData: Record<string, RealTimeAudience>;
  isLoading: boolean;
  error: string | null;
  createAudience: (audience: Omit<AudienceTarget, 'id' | 'createdAt' | 'updatedAt'>) => Promise<AudienceTarget>;
  updateAudience: (id: string, updates: Partial<AudienceTarget>) => Promise<AudienceTarget | null>;
  deleteAudience: (id: string) => Promise<boolean>;
  getAudienceById: (id: string) => AudienceTarget | undefined;
  getRealTimeAudienceData: (audienceId: string) => RealTimeAudience | null;
  calculateAudienceSize: (audienceId: string) => Promise<number>;
  targetCampaignAudience: (campaignId: string, audienceId: string) => Promise<CampaignAudience>;
  getCampaignPerformance: (campaignId: string) => Promise<any>;
}

class RealTimeAudienceTargetingService {
  private audiences: Map<string, AudienceTarget> = new Map();
  private realTimeData: Map<string, RealTimeAudience> = new Map();
  private campaignAudiences: Map<string, CampaignAudience[]> = new Map();

  constructor() {
    this.initializeDefaultAudiences();
    this.startRealTimeUpdates();
  }

  private initializeDefaultAudiences() {
    const defaultAudiences: AudienceTarget[] = [
      {
        id: 'high-value-enterprise',
        name: 'High-Value Enterprise Prospects',
        description: 'Enterprise prospects with high conversion probability',
        segments: ['enterprise-prospects', 'high-intent-visitors'],
        conditions: {
          demographics: {
            companySize: ['enterprise', 'large'],
            role: ['cto', 'vp-engineering', 'director']
          },
          behavior: {
            minEngagementScore: 0.7,
            minBehaviorScore: 0.8,
            conversionProbability: { min: 0.6, max: 1.0 },
            lastActivity: { withinHours: 24 }
          },
          technology: {
            deviceType: ['desktop']
          },
          time: {
            timezone: ['America/New_York', 'America/Los_Angeles', 'Europe/London'],
            dayOfWeek: [1, 2, 3, 4, 5],
            hourOfDay: { start: 9, end: 17 }
          }
        },
        size: 0,
        estimatedReach: 15000,
        conversionRate: 0.15,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'startup-growth-seekers',
        name: 'Startup Growth Seekers',
        description: 'Startup founders and teams looking for growth solutions',
        segments: ['startup-enthusiasts', 'content-consumers'],
        conditions: {
          demographics: {
            companySize: ['startup', 'small'],
            role: ['founder', 'ceo', 'cto']
          },
          behavior: {
            minEngagementScore: 0.5,
            minBehaviorScore: 0.6,
            conversionProbability: { min: 0.3, max: 0.8 },
            lastActivity: { withinHours: 72 }
          },
          technology: {
            deviceType: ['desktop', 'mobile']
          },
          time: {
            dayOfWeek: [0, 1, 2, 3, 4, 5, 6],
            hourOfDay: { start: 6, end: 22 }
          }
        },
        size: 0,
        estimatedReach: 25000,
        conversionRate: 0.08,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'mobile-power-users',
        name: 'Mobile Power Users',
        description: 'Highly engaged users accessing via mobile devices',
        segments: ['mobile-first-users', 'power-users'],
        conditions: {
          behavior: {
            minEngagementScore: 0.6,
            minBehaviorScore: 0.7,
            lastActivity: { withinHours: 12 }
          },
          technology: {
            deviceType: ['mobile', 'tablet'],
            operatingSystem: ['iOS', 'Android']
          }
        },
        size: 0,
        estimatedReach: 35000,
        conversionRate: 0.06,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 're-engagement-winback',
        name: 'Re-engagement Winback',
        description: 'Users who showed interest but need re-engagement',
        segments: ['high-intent-visitors'],
        conditions: {
          behavior: {
            minEngagementScore: 0.3,
            conversionProbability: { min: 0.2, max: 0.6 },
            lastActivity: { withinHours: 168 }
          }
        },
        size: 0,
        estimatedReach: 20000,
        conversionRate: 0.12,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    defaultAudiences.forEach(audience => {
      this.audiences.set(audience.id, audience);
    });
  }

  private startRealTimeUpdates(): void {
    setInterval(() => {
      this.updateRealTimeData();
    }, 30000);
  }

  private updateRealTimeData(): void {
    for (const [audienceId, audience] of this.audiences.entries()) {
      if (audience.isActive) {
        const realTimeData = this.generateRealTimeData(audienceId);
        this.realTimeData.set(audienceId, realTimeData);
      }
    }
  }

  private generateRealTimeData(audienceId: string): RealTimeAudience {
    const baseData = this.realTimeData.get(audienceId);
    const audience = this.audiences.get(audienceId);
    
    if (!audience) {
      return {
        audienceId,
        currentUsers: 0,
        activeUsers: 0,
        engagedUsers: 0,
        conversionProbability: 0,
        averageEngagement: 0,
        topSegments: [],
        geographicDistribution: {},
        deviceDistribution: {},
        lastUpdated: new Date()
      };
    }

    const baseUsers = baseData?.currentUsers || Math.floor(Math.random() * 1000) + 100;
    const variation = (Math.random() - 0.5) * 0.2;
    const currentUsers = Math.max(0, Math.floor(baseUsers * (1 + variation)));
    
    const activeUsers = Math.floor(currentUsers * (0.3 + Math.random() * 0.4));
    const engagedUsers = Math.floor(activeUsers * (0.4 + Math.random() * 0.3));
    
    const conversionProbability = audience.conversionRate + (Math.random() - 0.5) * 0.02;
    const averageEngagement = 0.4 + Math.random() * 0.4;

    return {
      audienceId,
      currentUsers,
      activeUsers,
      engagedUsers,
      conversionProbability: Math.max(0, Math.min(1, conversionProbability)),
      averageEngagement: Math.max(0, Math.min(1, averageEngagement)),
      topSegments: audience.segments.slice(0, 3),
      geographicDistribution: {
        'US': Math.floor(currentUsers * 0.6),
        'EU': Math.floor(currentUsers * 0.25),
        'APAC': Math.floor(currentUsers * 0.15)
      },
      deviceDistribution: {
        'desktop': Math.floor(currentUsers * 0.7),
        'mobile': Math.floor(currentUsers * 0.25),
        'tablet': Math.floor(currentUsers * 0.05)
      },
      lastUpdated: new Date()
    };
  }

  async createAudience(audience: Omit<AudienceTarget, 'id' | 'createdAt' | 'updatedAt'>): Promise<AudienceTarget> {
    const newAudience: AudienceTarget = {
      ...audience,
      id: `audience-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      size: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.audiences.set(newAudience.id, newAudience);
    
    await trackEvent('audience_created', {
      audience_id: newAudience.id,
      audience_name: newAudience.name,
      segment_count: newAudience.segments.length,
      estimated_reach: newAudience.estimatedReach
    });

    return newAudience;
  }

  async updateAudience(id: string, updates: Partial<AudienceTarget>): Promise<AudienceTarget | null> {
    const audience = this.audiences.get(id);
    if (!audience) return null;

    const updatedAudience = {
      ...audience,
      ...updates,
      updatedAt: new Date()
    };

    this.audiences.set(id, updatedAudience);
    
    await trackEvent('audience_updated', {
      audience_id: id,
      updates: Object.keys(updates)
    });

    return updatedAudience;
  }

  async deleteAudience(id: string): Promise<boolean> {
    const deleted = this.audiences.delete(id);
    this.realTimeData.delete(id);
    
    if (deleted) {
      await trackEvent('audience_deleted', { audience_id: id });
    }

    return deleted;
  }

  getAudienceById(id: string): AudienceTarget | undefined {
    return this.audiences.get(id);
  }

  getAllAudiences(): AudienceTarget[] {
    return Array.from(this.audiences.values()).filter(audience => audience.isActive);
  }

  getActiveAudiences(): AudienceTarget[] {
    return this.getAllAudiences().filter(audience => audience.isActive);
  }

  getRealTimeAudienceData(audienceId: string): RealTimeAudience | null {
    return this.realTimeData.get(audienceId) || null;
  }

  async calculateAudienceSize(audienceId: string): Promise<number> {
    const audience = this.audiences.get(audienceId);
    if (!audience) return 0;

    let totalSize = 0;
    
    for (const segmentId of audience.segments) {
      const segmentUsers = await userSegmentationService.getSegmentUsers(segmentId);
      totalSize += segmentUsers.length;
    }

    const updatedAudience = { ...audience, size: totalSize };
    this.audiences.set(audienceId, updatedAudience);

    return totalSize;
  }

  async targetCampaignAudience(campaignId: string, audienceId: string): Promise<CampaignAudience> {
    const audience = this.audiences.get(audienceId);
    if (!audience) {
      throw new Error(`Audience ${audienceId} not found`);
    }

    const campaignAudience: CampaignAudience = {
      campaignId,
      audienceId,
      targeting: {
        segments: audience.segments,
        conditions: audience.conditions,
        exclusions: []
      },
      performance: {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        ctr: 0,
        conversionRate: 0,
        costPerClick: 0,
        costPerConversion: 0
      },
      status: 'active',
      startDate: new Date()
    };

    const campaignAudiences = this.campaignAudiences.get(campaignId) || [];
    campaignAudiences.push(campaignAudience);
    this.campaignAudiences.set(campaignId, campaignAudiences);

    await trackEvent('campaign_audience_targeted', {
      campaign_id: campaignId,
      audience_id: audienceId,
      segment_count: audience.segments.length
    });

    return campaignAudience;
  }

  async getCampaignPerformance(campaignId: string): Promise<any> {
    const campaignAudiences = this.campaignAudiences.get(campaignId) || [];
    
    let totalImpressions = 0;
    let totalClicks = 0;
    let totalConversions = 0;
    let totalCost = 0;

    campaignAudiences.forEach(ca => {
      totalImpressions += ca.performance.impressions;
      totalClicks += ca.performance.clicks;
      totalConversions += ca.performance.conversions;
      totalCost += (ca.performance.clicks * ca.performance.costPerClick) + 
                   (ca.performance.conversions * ca.performance.costPerConversion);
    });

    return {
      campaignId,
      totalAudiences: campaignAudiences.length,
      totalImpressions,
      totalClicks,
      totalConversions,
      overallCtr: totalImpressions > 0 ? totalClicks / totalImpressions : 0,
      overallConversionRate: totalClicks > 0 ? totalConversions / totalClicks : 0,
      totalCost,
      costPerAcquisition: totalConversions > 0 ? totalCost / totalConversions : 0,
      audiences: campaignAudiences.map(ca => ({
        audienceId: ca.audienceId,
        status: ca.status,
        performance: ca.performance
      }))
    };
  }

  async updateCampaignPerformance(campaignId: string, audienceId: string, metrics: any): Promise<void> {
    const campaignAudiences = this.campaignAudiences.get(campaignId) || [];
    const campaignAudience = campaignAudiences.find(ca => ca.audienceId === audienceId);
    
    if (campaignAudience) {
      campaignAudience.performance = {
        ...campaignAudience.performance,
        ...metrics,
        ctr: metrics.impressions > 0 ? metrics.clicks / metrics.impressions : 0,
        conversionRate: metrics.clicks > 0 ? metrics.conversions / metrics.clicks : 0
      };
      
      this.campaignAudiences.set(campaignId, campaignAudiences);
    }
  }
}

export const realTimeAudienceTargetingService = new RealTimeAudienceTargetingService();

export function useRealTimeAudienceTargeting(options: UseRealTimeAudienceTargetingOptions = {}): UseRealTimeAudienceTargetingReturn {
  const { userId = 'anonymous', campaignId, trackEvents = true, refreshInterval = 30000, autoTarget = true } = options;
  
  const [audiences, setAudiences] = useState<AudienceTarget[]>([]);
  const [activeAudiences, setActiveAudiences] = useState<AudienceTarget[]>([]);
  const [realTimeData, setRealTimeData] = useState<Record<string, RealTimeAudience>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAudience = useCallback(async (audience: Omit<AudienceTarget, 'id' | 'createdAt' | 'updatedAt'>): Promise<AudienceTarget> => {
    try {
      const newAudience = await realTimeAudienceTargetingService.createAudience(audience);
      
      setAudiences(prev => [...prev, newAudience]);
      setActiveAudiences(prev => [...prev, newAudience]);
      
      if (trackEvents) {
        await trackEvent('audience_created', {
          user_id: userId,
          audience_id: newAudience.id,
          audience_name: newAudience.name
        });
      }
      
      return newAudience;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create audience';
      setError(errorMessage);
      
      if (trackEvents) {
        await trackEvent('audience_creation_error', {
          user_id: userId,
          error: errorMessage
        });
      }
      
      throw err;
    }
  }, [userId, trackEvents]);

  const updateAudience = useCallback(async (id: string, updates: Partial<AudienceTarget>): Promise<AudienceTarget | null> => {
    try {
      const updatedAudience = await realTimeAudienceTargetingService.updateAudience(id, updates);
      
      if (updatedAudience) {
        setAudiences(prev => prev.map(a => a.id === id ? updatedAudience : a));
        setActiveAudiences(prev => prev.map(a => a.id === id ? updatedAudience : a));
        
        if (trackEvents) {
          await trackEvent('audience_updated', {
            user_id: userId,
            audience_id: id,
            updates: Object.keys(updates)
          });
        }
      }
      
      return updatedAudience;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update audience';
      setError(errorMessage);
      
      if (trackEvents) {
        await trackEvent('audience_update_error', {
          user_id: userId,
          audience_id: id,
          error: errorMessage
        });
      }
      
      return null;
    }
  }, [userId, trackEvents]);

  const deleteAudience = useCallback(async (id: string): Promise<boolean> => {
    try {
      const deleted = await realTimeAudienceTargetingService.deleteAudience(id);
      
      if (deleted) {
        setAudiences(prev => prev.filter(a => a.id !== id));
        setActiveAudiences(prev => prev.filter(a => a.id !== id));
        setRealTimeData(prev => {
          const newData = { ...prev };
          delete newData[id];
          return newData;
        });
        
        if (trackEvents) {
          await trackEvent('audience_deleted', {
            user_id: userId,
            audience_id: id
          });
        }
      }
      
      return deleted;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete audience';
      setError(errorMessage);
      
      if (trackEvents) {
        await trackEvent('audience_deletion_error', {
          user_id: userId,
          audience_id: id,
          error: errorMessage
        });
      }
      
      return false;
    }
  }, [userId, trackEvents]);

  const getAudienceById = useCallback((id: string): AudienceTarget | undefined => {
    return realTimeAudienceTargetingService.getAudienceById(id);
  }, []);

  const getRealTimeAudienceData = useCallback((audienceId: string): RealTimeAudience | null => {
    return realTimeAudienceTargetingService.getRealTimeAudienceData(audienceId);
  }, []);

  const calculateAudienceSize = useCallback(async (audienceId: string): Promise<number> => {
    try {
      const size = await realTimeAudienceTargetingService.calculateAudienceSize(audienceId);
      
      if (trackEvents) {
        await trackEvent('audience_size_calculated', {
          user_id: userId,
          audience_id: audienceId,
          size: size
        });
      }
      
      return size;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to calculate audience size';
      setError(errorMessage);
      
      if (trackEvents) {
        await trackEvent('audience_size_calculation_error', {
          user_id: userId,
          audience_id: audienceId,
          error: errorMessage
        });
      }
      
      return 0;
    }
  }, [userId, trackEvents]);

  const targetCampaignAudience = useCallback(async (campaignId: string, audienceId: string): Promise<CampaignAudience> => {
    try {
      const campaignAudience = await realTimeAudienceTargetingService.targetCampaignAudience(campaignId, audienceId);
      
      if (trackEvents) {
        await trackEvent('campaign_audience_targeted', {
          user_id: userId,
          campaign_id: campaignId,
          audience_id: audienceId
        });
      }
      
      return campaignAudience;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to target campaign audience';
      setError(errorMessage);
      
      if (trackEvents) {
        await trackEvent('campaign_audience_targeting_error', {
          user_id: userId,
          campaign_id: campaignId,
          audience_id: audienceId,
          error: errorMessage
        });
      }
      
      throw err;
    }
  }, [userId, trackEvents]);

  const getCampaignPerformance = useCallback(async (campaignId: string): Promise<any> => {
    try {
      const performance = await realTimeAudienceTargetingService.getCampaignPerformance(campaignId);
      
      if (trackEvents) {
        await trackEvent('campaign_performance_requested', {
          user_id: userId,
          campaign_id: campaignId
        });
      }
      
      return performance;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get campaign performance';
      setError(errorMessage);
      
      if (trackEvents) {
        await trackEvent('campaign_performance_error', {
          user_id: userId,
          campaign_id: campaignId,
          error: errorMessage
        });
      }
      
      return null;
    }
  }, [userId, trackEvents]);

  useEffect(() => {
    const loadAudiences = async () => {
      setIsLoading(true);
      try {
        const allAudiences = realTimeAudienceTargetingService.getAllAudiences();
        const activeAudiences = realTimeAudienceTargetingService.getActiveAudiences();
        
        setAudiences(allAudiences);
        setActiveAudiences(activeAudiences);
        
        if (autoTarget) {
          const realTimeDataMap: Record<string, RealTimeAudience> = {};
          
          for (const audience of activeAudiences) {
            const data = getRealTimeAudienceData(audience.id);
            if (data) {
              realTimeDataMap[audience.id] = data;
            }
          }
          
          setRealTimeData(realTimeDataMap);
        }
        
        if (trackEvents) {
          await trackEvent('audiences_loaded', {
            user_id: userId,
            total_audiences: allAudiences.length,
            active_audiences: activeAudiences.length
          });
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load audiences';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadAudiences();

    if (autoTarget && refreshInterval > 0) {
      const interval = setInterval(() => {
        const realTimeDataMap: Record<string, RealTimeAudience> = {};
        
        for (const audience of activeAudiences) {
          const data = getRealTimeAudienceData(audience.id);
          if (data) {
            realTimeDataMap[audience.id] = data;
          }
        }
        
        setRealTimeData(realTimeDataMap);
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [userId, autoTarget, refreshInterval, trackEvents, getRealTimeAudienceData, activeAudiences]);

  return {
    audiences,
    activeAudiences,
    realTimeData,
    isLoading,
    error,
    createAudience,
    updateAudience,
    deleteAudience,
    getAudienceById,
    getRealTimeAudienceData,
    calculateAudienceSize,
    targetCampaignAudience,
    getCampaignPerformance
  };
}

export default useRealTimeAudienceTargeting;