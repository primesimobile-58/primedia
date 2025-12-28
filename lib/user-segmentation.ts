import { supabase } from './supabase';
import { trackEvent } from './analytics';

export interface UserSegment {
  id: string;
  name: string;
  description: string;
  criteria: SegmentCriteria;
  priority: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SegmentCriteria {
  demographics?: {
    ageRange?: { min: number; max: number };
    location?: string[];
    companySize?: string[];
    industry?: string[];
    role?: string[];
  };
  behavior?: {
    pageViews?: { min: number; max?: number };
    sessionDuration?: { min: number; max?: number };
    bounceRate?: { max: number };
    returnVisits?: { min: number };
    conversionEvents?: string[];
    formInteractions?: string[];
  };
  engagement?: {
    emailOpenRate?: { min: number };
    clickThroughRate?: { min: number };
    socialShares?: { min: number };
    videoViews?: { min: number };
  };
  technology?: {
    deviceType?: string[];
    browser?: string[];
    operatingSystem?: string[];
    screenResolution?: string[];
  };
  customAttributes?: Record<string, any>;
}

export interface UserProfile {
  id: string;
  email?: string;
  segments: string[];
  segmentScores: Record<string, number>;
  behaviorScore: number;
  engagementScore: number;
  conversionProbability: number;
  churnRisk: number;
  lifetimeValue: number;
  lastActivity: Date;
  attributes: Record<string, any>;
}

export interface SegmentMatch {
  segmentId: string;
  score: number;
  matchedCriteria: string[];
  confidence: number;
}

class UserSegmentationService {
  private segments: Map<string, UserSegment> = new Map();
  private userProfiles: Map<string, UserProfile> = new Map();

  constructor() {
    this.initializeDefaultSegments();
  }

  private initializeDefaultSegments() {
    const defaultSegments: UserSegment[] = [
      {
        id: 'enterprise-prospects',
        name: 'Enterprise Prospects',
        description: 'High-value enterprise leads with strong engagement',
        criteria: {
          demographics: {
            companySize: ['enterprise', 'large'],
            role: ['cto', 'vp-engineering', 'director', 'manager']
          },
          behavior: {
            pageViews: { min: 5 },
            sessionDuration: { min: 180 },
            conversionEvents: ['demo-request', 'pricing-view', 'enterprise-contact']
          },
          engagement: {
            emailOpenRate: { min: 0.3 },
            clickThroughRate: { min: 0.1 }
          }
        },
        priority: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'startup-enthusiasts',
        name: 'Startup Enthusiasts',
        description: 'Startup founders and early-stage teams',
        criteria: {
          demographics: {
            companySize: ['startup', 'small'],
            role: ['founder', 'ceo', 'cto']
          },
          behavior: {
            pageViews: { min: 3 },
            conversionEvents: ['free-trial', 'startup-resources', 'pricing-view']
          },
          technology: {
            deviceType: ['desktop', 'mobile'],
            browser: ['chrome', 'safari', 'firefox']
          }
        },
        priority: 2,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'power-users',
        name: 'Power Users',
        description: 'Highly engaged users with multiple interactions',
        criteria: {
          behavior: {
            pageViews: { min: 10 },
            sessionDuration: { min: 300 },
            returnVisits: { min: 3 },
            formInteractions: ['demo-request', 'newsletter-signup', 'contact-form']
          },
          engagement: {
            emailOpenRate: { min: 0.4 },
            clickThroughRate: { min: 0.15 }
          }
        },
        priority: 3,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'mobile-first-users',
        name: 'Mobile-First Users',
        description: 'Users primarily accessing via mobile devices',
        criteria: {
          technology: {
            deviceType: ['mobile', 'tablet'],
            screenResolution: ['360x640', '375x667', '414x896', '390x844']
          },
          behavior: {
            pageViews: { min: 2 },
            bounceRate: { max: 0.7 }
          }
        },
        priority: 4,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'high-intent-visitors',
        name: 'High Intent Visitors',
        description: 'Visitors showing strong purchase intent',
        criteria: {
          behavior: {
            conversionEvents: ['demo-request', 'pricing-view', 'contact-sales'],
            pageViews: { min: 4 },
            sessionDuration: { min: 120 }
          },
          engagement: {
            clickThroughRate: { min: 0.2 }
          }
        },
        priority: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'content-consumers',
        name: 'Content Consumers',
        description: 'Users who consume educational content',
        criteria: {
          behavior: {
            pageViews: { min: 6 },
            conversionEvents: ['blog-read', 'whitepaper-download', 'webinar-attend']
          },
          engagement: {
            videoViews: { min: 2 },
            socialShares: { min: 1 }
          }
        },
        priority: 5,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    defaultSegments.forEach(segment => {
      this.segments.set(segment.id, segment);
    });
  }

  async createSegment(segment: Omit<UserSegment, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserSegment> {
    const newSegment: UserSegment = {
      ...segment,
      id: `segment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.segments.set(newSegment.id, newSegment);
    
    await trackEvent('segment_created', {
      segment_id: newSegment.id,
      segment_name: newSegment.name,
      criteria_count: Object.keys(newSegment.criteria).length
    });

    return newSegment;
  }

  async updateSegment(id: string, updates: Partial<UserSegment>): Promise<UserSegment | null> {
    const segment = this.segments.get(id);
    if (!segment) return null;

    const updatedSegment = {
      ...segment,
      ...updates,
      updatedAt: new Date()
    };

    this.segments.set(id, updatedSegment);
    
    await trackEvent('segment_updated', {
      segment_id: id,
      updates: Object.keys(updates)
    });

    return updatedSegment;
  }

  async deleteSegment(id: string): Promise<boolean> {
    const deleted = this.segments.delete(id);
    
    if (deleted) {
      await trackEvent('segment_deleted', { segment_id: id });
    }

    return deleted;
  }

  getAllSegments(): UserSegment[] {
    return Array.from(this.segments.values()).filter(segment => segment.isActive);
  }

  getSegmentById(id: string): UserSegment | undefined {
    return this.segments.get(id);
  }

  async evaluateUserSegments(userId: string, userData: any): Promise<SegmentMatch[]> {
    const matches: SegmentMatch[] = [];
    const userProfile = await this.getOrCreateUserProfile(userId, userData);

    for (const segment of this.getAllSegments()) {
      const match = this.evaluateSegmentMatch(userProfile, segment);
      if (match.score > 0.5) {
        matches.push(match);
      }
    }

    matches.sort((a, b) => b.score - a.score);

    await this.updateUserSegments(userId, matches);
    
    await trackEvent('user_segments_evaluated', {
      user_id: userId,
      segment_matches: matches.length,
      top_segment: matches[0]?.segmentId
    });

    return matches;
  }

  private evaluateSegmentMatch(userProfile: UserProfile, segment: UserSegment): SegmentMatch {
    let totalScore = 0;
    let maxScore = 0;
    const matchedCriteria: string[] = [];

    const criteria = segment.criteria;

    if (criteria.demographics) {
      maxScore += 25;
      const demoScore = this.evaluateDemographics(userProfile, criteria.demographics);
      if (demoScore > 0) {
        totalScore += demoScore;
        matchedCriteria.push('demographics');
      }
    }

    if (criteria.behavior) {
      maxScore += 30;
      const behaviorScore = this.evaluateBehavior(userProfile, criteria.behavior);
      if (behaviorScore > 0) {
        totalScore += behaviorScore;
        matchedCriteria.push('behavior');
      }
    }

    if (criteria.engagement) {
      maxScore += 25;
      const engagementScore = this.evaluateEngagement(userProfile, criteria.engagement);
      if (engagementScore > 0) {
        totalScore += engagementScore;
        matchedCriteria.push('engagement');
      }
    }

    if (criteria.technology) {
      maxScore += 20;
      const techScore = this.evaluateTechnology(userProfile, criteria.technology);
      if (techScore > 0) {
        totalScore += techScore;
        matchedCriteria.push('technology');
      }
    }

    const finalScore = maxScore > 0 ? totalScore / maxScore : 0;
    const confidence = this.calculateConfidence(matchedCriteria.length, Object.keys(criteria).length);

    return {
      segmentId: segment.id,
      score: finalScore,
      matchedCriteria,
      confidence
    };
  }

  private evaluateDemographics(userProfile: UserProfile, demographics: NonNullable<SegmentCriteria['demographics']>): number {
    let score = 0;
    let checks = 0;

    if (demographics.companySize && userProfile.attributes.companySize) {
      checks++;
      if (demographics.companySize.includes(userProfile.attributes.companySize)) {
        score += 1;
      }
    }

    if (demographics.role && userProfile.attributes.role) {
      checks++;
      if (demographics.role.includes(userProfile.attributes.role)) {
        score += 1;
      }
    }

    if (demographics.industry && userProfile.attributes.industry) {
      checks++;
      if (demographics.industry.includes(userProfile.attributes.industry)) {
        score += 1;
      }
    }

    return checks > 0 ? score / checks : 0;
  }

  private evaluateBehavior(userProfile: UserProfile, behavior: NonNullable<SegmentCriteria['behavior']>): number {
    let score = 0;
    let checks = 0;

    if (behavior.pageViews && userProfile.attributes.pageViews) {
      checks++;
      if (userProfile.attributes.pageViews >= behavior.pageViews.min && 
          (!behavior.pageViews.max || userProfile.attributes.pageViews <= behavior.pageViews.max)) {
        score += 1;
      }
    }

    if (behavior.sessionDuration && userProfile.attributes.avgSessionDuration) {
      checks++;
      if (userProfile.attributes.avgSessionDuration >= behavior.sessionDuration.min && 
          (!behavior.sessionDuration.max || userProfile.attributes.avgSessionDuration <= behavior.sessionDuration.max)) {
        score += 1;
      }
    }

    if (behavior.conversionEvents && userProfile.attributes.conversionEvents) {
      checks++;
      const hasEvents = behavior.conversionEvents.some(event => 
        userProfile.attributes.conversionEvents.includes(event)
      );
      if (hasEvents) score += 1;
    }

    return checks > 0 ? score / checks : 0;
  }

  private evaluateEngagement(userProfile: UserProfile, engagement: NonNullable<SegmentCriteria['engagement']>): number {
    let score = 0;
    let checks = 0;

    if (engagement.emailOpenRate && userProfile.engagementScore) {
      checks++;
      if (userProfile.engagementScore >= engagement.emailOpenRate.min) {
        score += 1;
      }
    }

    if (engagement.clickThroughRate && userProfile.behaviorScore) {
      checks++;
      if (userProfile.behaviorScore >= engagement.clickThroughRate.min) {
        score += 1;
      }
    }

    return checks > 0 ? score / checks : 0;
  }

  private evaluateTechnology(userProfile: UserProfile, technology: NonNullable<SegmentCriteria['technology']>): number {
    let score = 0;
    let checks = 0;

    if (technology.deviceType && userProfile.attributes.deviceType) {
      checks++;
      if (technology.deviceType.includes(userProfile.attributes.deviceType)) {
        score += 1;
      }
    }

    if (technology.browser && userProfile.attributes.browser) {
      checks++;
      if (technology.browser.includes(userProfile.attributes.browser)) {
        score += 1;
      }
    }

    return checks > 0 ? score / checks : 0;
  }

  private calculateConfidence(matchedCriteria: number, totalCriteria: number): number {
    return totalCriteria > 0 ? matchedCriteria / totalCriteria : 0;
  }

  async getOrCreateUserProfile(userId: string, userData: any): Promise<UserProfile> {
    let profile = this.userProfiles.get(userId);
    
    if (!profile) {
      profile = {
        id: userId,
        segments: [],
        segmentScores: {},
        behaviorScore: 0,
        engagementScore: 0,
        conversionProbability: 0,
        churnRisk: 0,
        lifetimeValue: 0,
        lastActivity: new Date(),
        attributes: userData
      };
      this.userProfiles.set(userId, profile);
    }

    return profile;
  }

  private async updateUserSegments(userId: string, matches: SegmentMatch[]): Promise<void> {
    const profile = this.userProfiles.get(userId);
    if (!profile) return;

    profile.segments = matches.map(match => match.segmentId);
    profile.segmentScores = {};
    
    matches.forEach(match => {
      profile.segmentScores[match.segmentId] = match.score;
    });

    await this.saveUserProfileToDatabase(userId, profile);
  }

  private async saveUserProfileToDatabase(userId: string, profile: UserProfile): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: userId,
          segments: profile.segments,
          segment_scores: profile.segmentScores,
          behavior_score: profile.behaviorScore,
          engagement_score: profile.engagementScore,
          conversion_probability: profile.conversionProbability,
          churn_risk: profile.churnRisk,
          lifetime_value: profile.lifetimeValue,
          last_activity: profile.lastActivity,
          attributes: profile.attributes,
          updated_at: new Date()
        });

      if (error) {
        /* noop */
      }
    } catch (error) {
      /* noop */
    }
  }

  async getUserSegments(userId: string): Promise<string[]> {
    const profile = this.userProfiles.get(userId);
    return profile?.segments || [];
  }

  async getSegmentUsers(segmentId: string): Promise<string[]> {
    const users: string[] = [];
    
    for (const [userId, profile] of this.userProfiles.entries()) {
      if (profile.segments.includes(segmentId)) {
        users.push(userId);
      }
    }

    return users;
  }

  async getSegmentAnalytics(segmentId: string): Promise<any> {
    const users = await this.getSegmentUsers(segmentId);
    const segment = this.segments.get(segmentId);
    
    if (!segment) return null;

    let totalBehaviorScore = 0;
    let totalEngagementScore = 0;
    let totalConversionProbability = 0;
    let totalLifetimeValue = 0;

    for (const userId of users) {
      const profile = this.userProfiles.get(userId);
      if (profile) {
        totalBehaviorScore += profile.behaviorScore;
        totalEngagementScore += profile.engagementScore;
        totalConversionProbability += profile.conversionProbability;
        totalLifetimeValue += profile.lifetimeValue;
      }
    }

    return {
      segmentId,
      segmentName: segment.name,
      userCount: users.length,
      avgBehaviorScore: users.length > 0 ? totalBehaviorScore / users.length : 0,
      avgEngagementScore: users.length > 0 ? totalEngagementScore / users.length : 0,
      avgConversionProbability: users.length > 0 ? totalConversionProbability / users.length : 0,
      avgLifetimeValue: users.length > 0 ? totalLifetimeValue / users.length : 0,
      lastUpdated: new Date()
    };
  }
}

export const userSegmentationService = new UserSegmentationService();
export default userSegmentationService;
