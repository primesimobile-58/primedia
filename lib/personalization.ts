export interface UserBehavior {
  userId?: string;
  sessionId: string;
  pageViews: PageView[];
  clicks: ClickEvent[];
  scrollDepth: number;
  timeOnPage: number;
  formInteractions: FormInteraction[];
  utmSource?: string;
  utmCampaign?: string;
  utmMedium?: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  ipAddress?: string;
  timestamp: Date;
}

export interface PageView {
  url: string;
  title: string;
  timestamp: Date;
  referrer?: string;
  loadTime: number;
}

export interface ClickEvent {
  element: string;
  text?: string;
  url?: string;
  position: { x: number; y: number };
  timestamp: Date;
}

export interface FormInteraction {
  formId: string;
  formType: string;
  startedAt: Date;
  completedAt?: Date;
  fieldInteractions: FieldInteraction[];
  abandoned?: boolean;
}

export interface FieldInteraction {
  fieldName: string;
  fieldType: string;
  interactionCount: number;
  timeSpent: number;
  validationErrors: number;
}

export interface PersonalizationProfile {
  userId?: string;
  email?: string;
  company?: string;
  industry?: string;
  role?: string;
  companySize?: string;
  interests: string[];
  behaviorScore: number;
  engagementLevel: 'low' | 'medium' | 'high' | 'champion';
  preferredContent: string[];
  journeyStage: 'awareness' | 'consideration' | 'decision' | 'customer' | 'advocate';
  lastActivity: Date;
  totalEngagement: number;
}

class PersonalizationService {
  private userProfiles: Map<string, PersonalizationProfile> = new Map();
  private behaviorData: Map<string, UserBehavior> = new Map();

  // Track user behavior and update profile
  trackUserBehavior(userId: string, behavior: Partial<UserBehavior>): void {
    const existing = this.behaviorData.get(userId) || {
      userId,
      sessionId: this.generateSessionId(),
      pageViews: [],
      clicks: [],
      scrollDepth: 0,
      timeOnPage: 0,
      formInteractions: [],
      deviceType: this.detectDeviceType(),
      browser: this.detectBrowser(),
      os: this.detectOS(),
      timestamp: new Date(),
    };

    const updated = { ...existing, ...behavior } as UserBehavior;
    this.behaviorData.set(userId, updated);

    // Update personalization profile based on behavior
    this.updateUserProfile(userId, updated);
  }

  // Generate personalization profile based on behavior
  private updateUserProfile(userId: string, behavior: UserBehavior): void {
    const existing = this.userProfiles.get(userId) || {
      userId,
      interests: [],
      behaviorScore: 0,
      engagementLevel: 'low',
      preferredContent: [],
      journeyStage: 'awareness',
      lastActivity: new Date(),
      totalEngagement: 0,
    };

    // Calculate behavior score
    const behaviorScore = this.calculateBehaviorScore(behavior);
    
    // Determine engagement level
    const engagementLevel = this.determineEngagementLevel(behaviorScore, behavior);
    
    // Identify interests based on behavior
    const interests = this.identifyInterests(behavior);
    
    // Determine journey stage
    const journeyStage = this.determineJourneyStage(behavior, behaviorScore);

    // Identify preferred content types
    const preferredContent = this.identifyPreferredContent(behavior);

    const updated: PersonalizationProfile = {
      ...existing,
      behaviorScore,
      engagementLevel,
      interests: [...new Set([...existing.interests, ...interests])],
      preferredContent: [...new Set([...existing.preferredContent, ...preferredContent])],
      journeyStage,
      lastActivity: new Date(),
      totalEngagement: existing.totalEngagement + this.calculateEngagementIncrement(behavior),
    };

    this.userProfiles.set(userId, updated);
  }

  // Calculate behavior score based on various factors
  private calculateBehaviorScore(behavior: UserBehavior): number {
    let score = 0;

    // Page views (1 point per page, bonus for product pages)
    score += behavior.pageViews.length;
    behavior.pageViews.forEach(pageView => {
      if (this.isProductPage(pageView.url)) score += 2;
      if (this.isPricingPage(pageView.url)) score += 3;
    });

    // Clicks (0.5 points per click, bonus for CTAs)
    score += behavior.clicks.length * 0.5;
    behavior.clicks.forEach(click => {
      if (this.isCTA(click.element)) score += 1;
    });

    // Scroll depth (up to 5 points)
    score += Math.min(behavior.scrollDepth / 20, 5);

    // Time on page (up to 10 points)
    score += Math.min(behavior.timeOnPage / 60, 10);

    // Form interactions (5 points per form started, 15 points per form completed)
    behavior.formInteractions.forEach(form => {
      score += 5;
      if (form.completedAt) score += 15;
    });

    return Math.round(score);
  }

  // Determine engagement level based on behavior score
  private determineEngagementLevel(score: number, behavior: UserBehavior): 'low' | 'medium' | 'high' | 'champion' {
    if (score >= 50 || behavior.formInteractions.some(f => f.completedAt)) return 'champion';
    if (score >= 30) return 'high';
    if (score >= 15) return 'medium';
    return 'low';
  }

  // Identify user interests based on behavior
  private identifyInterests(behavior: UserBehavior): string[] {
    const interests: string[] = [];

    // Analyze page views for interests
    behavior.pageViews.forEach(pageView => {
      const pageInterests = this.extractPageInterests(pageView.url, pageView.title);
      interests.push(...pageInterests);
    });

    // Analyze clicks for interests
    behavior.clicks.forEach(click => {
      const clickInterests = this.extractClickInterests(click.element, click.text);
      interests.push(...clickInterests);
    });

    // Analyze form interactions for interests
    behavior.formInteractions.forEach(form => {
      const formInterests = this.extractFormInterests(form.formType);
      interests.push(...formInterests);
    });

    return [...new Set(interests)];
  }

  // Determine journey stage based on behavior
  private determineJourneyStage(behavior: UserBehavior, score: number): 'awareness' | 'consideration' | 'decision' | 'customer' | 'advocate' {
    if (behavior.formInteractions.some(f => f.completedAt && f.formType === 'demo_request')) {
      return 'decision';
    }

    if (behavior.formInteractions.some(f => f.completedAt && f.formType === 'newsletter')) {
      return 'consideration';
    }

    if (score >= 20 || behavior.pageViews.some(p => this.isPricingPage(p.url))) {
      return 'consideration';
    }

    if (score >= 5) {
      return 'awareness';
    }

    return 'awareness';
  }

  // Identify preferred content types
  private identifyPreferredContent(behavior: UserBehavior): string[] {
    const preferences: string[] = [];

    // Analyze time spent on different content types
    const contentTypes = this.categorizeContent(behavior.pageViews);
    const contentTime = this.calculateContentTime(behavior.pageViews);

    // Sort by time spent and identify top preferences
    const sortedContent = Object.entries(contentTime)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([contentType]) => contentType);

    preferences.push(...sortedContent);

    return [...new Set(preferences)];
  }

  // Get personalized content recommendations
  getPersonalizedContent(userId: string): Array<{
    type: string;
    title: string;
    description: string;
    url: string;
    priority: number;
  }> {
    const profile = this.userProfiles.get(userId);
    if (!profile) return [];

    const recommendations = this.generateContentRecommendations(profile);
    return recommendations.sort((a, b) => b.priority - a.priority);
  }

  // Generate personalized messaging
  getPersonalizedMessage(userId: string, context: string): string {
    const profile = this.userProfiles.get(userId);
    if (!profile) return this.getDefaultMessage(context);

    return this.generateMessageForProfile(profile, context);
  }

  // Get user profile for personalization
  getUserProfile(userId: string): PersonalizationProfile | undefined {
    return this.userProfiles.get(userId);
  }

  // Helper methods
  private generateSessionId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private detectDeviceType(): 'desktop' | 'mobile' | 'tablet' {
    if (typeof window === 'undefined') return 'desktop';
    
    const width = window.innerWidth;
    if (width <= 768) return 'mobile';
    if (width <= 1024) return 'tablet';
    return 'desktop';
  }

  private detectBrowser(): string {
    if (typeof window === 'undefined') return 'Unknown';
    
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Other';
  }

  private detectOS(): string {
    if (typeof window === 'undefined') return 'Unknown';
    
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Other';
  }

  private isProductPage(url: string): boolean {
    return url.includes('/product') || url.includes('/features') || url.includes('/capabilities');
  }

  private isPricingPage(url: string): boolean {
    return url.includes('/pricing') || url.includes('/plans');
  }

  private isCTA(element: string): boolean {
    const ctaKeywords = ['button', 'cta', 'demo', 'trial', 'signup', 'get-started'];
    return ctaKeywords.some(keyword => element.toLowerCase().includes(keyword));
  }

  private calculateEngagementIncrement(behavior: UserBehavior): number {
    let increment = 0;
    increment += behavior.pageViews.length;
    increment += behavior.clicks.length * 0.5;
    increment += behavior.formInteractions.length * 2;
    return increment;
  }

  private extractPageInterests(url: string, title: string): string[] {
    const interests: string[] = [];
    
    if (url.includes('ai') || title.toLowerCase().includes('ai')) interests.push('AI');
    if (url.includes('analytics') || title.toLowerCase().includes('analytics')) interests.push('Analytics');
    if (url.includes('personalization') || title.toLowerCase().includes('personalization')) interests.push('Personalization');
    if (url.includes('cdp') || title.toLowerCase().includes('customer data')) interests.push('Customer Data');
    if (url.includes('automation') || title.toLowerCase().includes('automation')) interests.push('Automation');
    
    return interests;
  }

  private extractClickInterests(element: string, text?: string): string[] {
    const interests: string[] = [];
    const content = (element + ' ' + (text || '')).toLowerCase();
    
    if (content.includes('demo')) interests.push('Demo');
    if (content.includes('pricing')) interests.push('Pricing');
    if (content.includes('features')) interests.push('Features');
    if (content.includes('case study')) interests.push('Case Studies');
    
    return interests;
  }

  private extractFormInterests(formType: string): string[] {
    const interests: string[] = [];
    
    if (formType.includes('demo')) interests.push('Demo Request');
    if (formType.includes('newsletter')) interests.push('Newsletter');
    if (formType.includes('contact')) interests.push('Contact');
    
    return interests;
  }

  private categorizeContent(pageViews: PageView[]): Record<string, number> {
    const categories: Record<string, number> = {};
    
    pageViews.forEach(pageView => {
      const category = this.categorizePage(pageView.url);
      categories[category] = (categories[category] || 0) + 1;
    });
    
    return categories;
  }

  private categorizePage(url: string): string {
    if (url.includes('/product')) return 'Product';
    if (url.includes('/pricing')) return 'Pricing';
    if (url.includes('/resources')) return 'Resources';
    if (url.includes('/blog')) return 'Blog';
    if (url.includes('/demo')) return 'Demo';
    return 'Other';
  }

  private calculateContentTime(pageViews: PageView[]): Record<string, number> {
    const contentTime: Record<string, number> = {};
    
    pageViews.forEach(pageView => {
      const category = this.categorizePage(pageView.url);
      contentTime[category] = (contentTime[category] || 0) + pageView.loadTime;
    });
    
    return contentTime;
  }

  private generateContentRecommendations(profile: PersonalizationProfile): Array<{
    type: string;
    title: string;
    description: string;
    url: string;
    priority: number;
  }> {
    const recommendations = [];

    // Generate recommendations based on interests
    if (profile.interests.includes('AI')) {
      recommendations.push({
        type: 'Guide',
        title: 'AI-Powered Customer Engagement Guide',
        description: 'Learn how to leverage AI for personalized customer experiences',
        url: '/resources/ai-customer-engagement-guide',
        priority: profile.interests.indexOf('AI') + 1,
      });
    }

    if (profile.interests.includes('Analytics')) {
      recommendations.push({
        type: 'Webinar',
        title: 'Advanced Analytics for Customer Insights',
        description: 'Deep dive into customer behavior analytics',
        url: '/webinars/advanced-analytics',
        priority: profile.interests.indexOf('Analytics') + 1,
      });
    }

    if (profile.journeyStage === 'decision') {
      recommendations.push({
        type: 'Demo',
        title: 'Personalized Platform Demo',
        description: 'See how our platform can solve your specific challenges',
        url: '/demo/personalized',
        priority: 10,
      });
    }

    return recommendations;
  }

  private generateMessageForProfile(profile: PersonalizationProfile, context: string): string {
    const baseMessage = this.getDefaultMessage(context);
    
    if (profile.engagementLevel === 'champion') {
      return `${baseMessage} As one of our most engaged users, we'd love to show you advanced features that can take your customer engagement to the next level.`;
    }
    
    if (profile.journeyStage === 'decision') {
      return `${baseMessage} Based on your interest in our platform, let's discuss how we can help you achieve your specific goals.`;
    }
    
    if (profile.interests.length > 0) {
      return `${baseMessage} We noticed you're interested in ${profile.interests.slice(0, 2).join(' and ')}. Here's content tailored to your interests.`;
    }
    
    return baseMessage;
  }

  private getDefaultMessage(context: string): string {
    const messages: Record<string, string> = {
      'welcome': 'Welcome to Alya! Discover how our platform can transform your customer engagement.',
      'demo': 'Ready to see our platform in action? Book a personalized demo with our team.',
      'trial': 'Start your free trial and experience the power of unified customer engagement.',
      'newsletter': 'Stay updated with the latest customer engagement trends and insights.',
    };
    
    return messages[context] || 'Discover how Alya can help you achieve your customer engagement goals.';
  }
}

export const personalizationService = new PersonalizationService();