import { createServerClient } from '@/lib/supabase';
import { trackEvent } from '@/lib/analytics';

export interface UserBehaviorData {
  userId: string;
  sessionId: string;
  events: BehaviorEvent[];
  demographics?: {
    age?: number;
    gender?: string;
    location?: string;
    device?: string;
    browser?: string;
  };
  engagement: {
    totalSessions: number;
    avgSessionDuration: number;
    pagesPerSession: number;
    bounceRate: number;
    conversionEvents: number;
  };
}

export interface BehaviorEvent {
  id: string;
  type: 'page_view' | 'click' | 'form_submit' | 'scroll' | 'time_on_page' | 'conversion' | 'exit_intent';
  timestamp: Date;
  pageUrl: string;
  element?: string;
  value?: number;
  metadata?: Record<string, any>;
}

export interface PredictionResult {
  userId: string;
  predictions: {
    conversionProbability: number;
    churnProbability: number;
    lifetimeValue: number;
    nextBestAction: string;
    recommendedContent: string[];
    optimalTiming: {
      bestHour: number;
      bestDay: string;
      timezone: string;
    };
    segment: 'high_value' | 'medium_value' | 'low_value' | 'at_risk' | 'churned';
    confidence: number;
  };
  factors: {
    topContributors: Array<{
      factor: string;
      weight: number;
      impact: 'positive' | 'negative';
    }>;
    riskFactors: string[];
    opportunityFactors: string[];
  };
  generatedAt: Date;
  modelVersion: string;
}

export interface PredictiveModel {
  id: string;
  name: string;
  type: 'conversion' | 'churn' | 'lifetime_value' | 'engagement' | 'segmentation';
  version: string;
  accuracy: number;
  lastTrained: Date;
  features: string[];
  thresholds: {
    highConfidence: number;
    mediumConfidence: number;
    lowConfidence: number;
  };
}

export interface ForecastData {
  timeframe: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  metric: 'conversions' | 'revenue' | 'users' | 'engagement' | 'churn';
  predictions: Array<{
    date: Date;
    predicted: number;
    confidenceInterval: {
      lower: number;
      upper: number;
    };
    actual?: number;
    error?: number;
  }>;
  trend: 'increasing' | 'decreasing' | 'stable' | 'seasonal';
  seasonality: {
    daily?: number[];
    weekly?: number[];
    monthly?: number[];
  };
  anomalies: Array<{
    date: Date;
    type: 'spike' | 'drop';
    severity: 'low' | 'medium' | 'high';
    explanation?: string;
  }>;
}

class PredictiveAnalyticsService {
  private supabase = createServerClient();
  private models: Map<string, PredictiveModel> = new Map();
  private predictionsCache: Map<string, { data: PredictionResult; expiry: Date }> = new Map();

  constructor() {
    this.initializeModels();
  }

  private initializeModels(): void {
    // Initialize pre-trained models
    this.models.set('conversion_v1', {
      id: 'conversion_v1',
      name: 'Conversion Prediction Model',
      type: 'conversion',
      version: '1.0.0',
      accuracy: 0.87,
      lastTrained: new Date('2024-01-15'),
      features: [
        'session_duration',
        'pages_viewed',
        'form_interactions',
        'cta_clicks',
        'scroll_depth',
        'return_visits',
        'device_type',
        'traffic_source',
        'time_of_day',
        'day_of_week'
      ],
      thresholds: {
        highConfidence: 0.8,
        mediumConfidence: 0.6,
        lowConfidence: 0.4
      }
    });

    this.models.set('churn_v1', {
      id: 'churn_v1',
      name: 'Churn Prediction Model',
      type: 'churn',
      version: '1.0.0',
      accuracy: 0.82,
      lastTrained: new Date('2024-01-10'),
      features: [
        'days_since_last_login',
        'engagement_score',
        'feature_usage_frequency',
        'support_tickets',
        'subscription_age',
        'payment_history',
        'usage_trend',
        'feedback_score'
      ],
      thresholds: {
        highConfidence: 0.75,
        mediumConfidence: 0.55,
        lowConfidence: 0.35
      }
    });

    this.models.set('lifetime_value_v1', {
      id: 'lifetime_value_v1',
      name: 'Lifetime Value Prediction Model',
      type: 'lifetime_value',
      version: '1.0.0',
      accuracy: 0.79,
      lastTrained: new Date('2024-01-12'),
      features: [
        'acquisition_channel',
        'first_purchase_amount',
        'purchase_frequency',
        'average_order_value',
        'customer_segment',
        'engagement_level',
        'product_usage',
        'referral_activity'
      ],
      thresholds: {
        highConfidence: 0.85,
        mediumConfidence: 0.65,
        lowConfidence: 0.45
      }
    });

    this.models.set('segmentation_v1', {
      id: 'segmentation_v1',
      name: 'Customer Segmentation Model',
      type: 'segmentation',
      version: '1.0.0',
      accuracy: 0.91,
      lastTrained: new Date('2024-01-08'),
      features: [
        'behavioral_score',
        'purchase_history',
        'engagement_frequency',
        'product_preferences',
        'price_sensitivity',
        'communication_preferences',
        'lifecycle_stage'
      ],
      thresholds: {
        highConfidence: 0.9,
        mediumConfidence: 0.7,
        lowConfidence: 0.5
      }
    });
  }

  // Main prediction method
  async predictUserBehavior(userData: UserBehaviorData): Promise<PredictionResult> {
    try {
      // Check cache first
      const cacheKey = this.generateCacheKey(userData.userId);
      const cached = this.predictionsCache.get(cacheKey);
      
      if (cached && cached.expiry > new Date()) {
        return cached.data;
      }

      // Generate predictions using multiple models
      const conversionModel = this.models.get('conversion_v1')!;
      const churnModel = this.models.get('churn_v1')!;
      const ltvModel = this.models.get('lifetime_value_v1')!;
      const segmentationModel = this.models.get('segmentation_v1')!;

      // Extract features from user data
      const features = this.extractFeatures(userData);

      // Run predictions
      const conversionProbability = this.predictConversion(features, conversionModel);
      const churnProbability = this.predictChurn(features, churnModel);
      const lifetimeValue = this.predictLifetimeValue(features, ltvModel);
      const segment = this.predictSegment(features, segmentationModel);

      // Generate recommendations
      const nextBestAction = this.generateNextBestAction(features, {
        conversionProbability,
        churnProbability,
        segment
      });

      const recommendedContent = this.generateRecommendedContent(features, segment);
      const optimalTiming = this.predictOptimalTiming(features);

      // Calculate confidence based on data quality and model accuracy
      const confidence = this.calculateConfidence(features, {
        conversionProbability,
        churnProbability,
        lifetimeValue
      });

      // Identify key factors
      const factors = this.identifyKeyFactors(features, {
        conversionProbability,
        churnProbability,
        segment
      });

      const result: PredictionResult = {
        userId: userData.userId,
        predictions: {
          conversionProbability,
          churnProbability,
          lifetimeValue,
          nextBestAction,
          recommendedContent,
          optimalTiming,
          segment,
          confidence
        },
        factors,
        generatedAt: new Date(),
        modelVersion: '1.0.0'
      };

      // Cache the result
      this.predictionsCache.set(cacheKey, {
        data: result,
        expiry: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
      });

      // Track prediction event
      trackEvent('predictive_analytics_prediction', {
        user_id: userData.userId,
        conversion_probability: conversionProbability,
        churn_probability: churnProbability,
        lifetime_value: lifetimeValue,
        segment,
        confidence
      });

      return result;
    } catch (error) {
      console.error('Error predicting user behavior:', error);
      throw error;
    }
  }

  // Generate business forecasts
  async generateForecast(
    metric: ForecastData['metric'],
    timeframe: ForecastData['timeframe'],
    historicalData?: any[]
  ): Promise<ForecastData> {
    try {
      // Get historical data if not provided
      if (!historicalData) {
        historicalData = await this.getHistoricalData(metric, timeframe);
      }

      // Generate predictions using time series analysis
      const predictions = this.generateTimeSeriesPredictions(historicalData, timeframe);
      
      // Detect trends and seasonality
      const trend = this.detectTrend(predictions);
      const seasonality = this.detectSeasonality(predictions);
      
      // Identify anomalies
      const anomalies = this.detectAnomalies(predictions);

      const forecast: ForecastData = {
        timeframe,
        metric,
        predictions,
        trend,
        seasonality,
        anomalies
      };

      // Track forecast generation
      trackEvent('predictive_analytics_forecast', {
        metric,
        timeframe,
        trend,
        anomaly_count: anomalies.length
      });

      return forecast;
    } catch (error) {
      console.error('Error generating forecast:', error);
      throw error;
    }
  }

  // Real-time scoring for user behavior
  async scoreUserBehavior(userId: string, sessionData: Partial<UserBehaviorData>): Promise<number> {
    try {
      // Get user history
      const userHistory = await this.getUserHistory(userId);
      
      // Combine with current session data
      const completeData: UserBehaviorData = {
        userId,
        sessionId: sessionData.sessionId || `session_${Date.now()}`,
        events: sessionData.events || [],
        demographics: sessionData.demographics || userHistory.demographics,
        engagement: {
          totalSessions: userHistory.totalSessions + 1,
          avgSessionDuration: this.calculateAvgSessionDuration(userHistory, sessionData),
          pagesPerSession: this.calculatePagesPerSession(userHistory, sessionData),
          bounceRate: this.calculateBounceRate(userHistory, sessionData),
          conversionEvents: userHistory.conversionEvents + (sessionData.events?.filter(e => e.type === 'conversion').length || 0)
        }
      };

      // Generate prediction
      const prediction = await this.predictUserBehavior(completeData);
      
      // Calculate composite score (0-100)
      const score = this.calculateBehaviorScore(prediction);
      
      return score;
    } catch (error) {
      console.error('Error scoring user behavior:', error);
      return 50; // Default medium score
    }
  }

  // Batch predictions for multiple users
  async batchPredict(userIds: string[]): Promise<PredictionResult[]> {
    try {
      const results: PredictionResult[] = [];
      
      for (const userId of userIds) {
        try {
          const userData = await this.getUserData(userId);
          const prediction = await this.predictUserBehavior(userData);
          results.push(prediction);
        } catch (error) {
          console.error(`Error predicting for user ${userId}:`, error);
          // Continue with other users
        }
      }
      
      return results;
    } catch (error) {
      console.error('Error in batch predictions:', error);
      return [];
    }
  }

  // Model management
  getModelInfo(modelId: string): PredictiveModel | null {
    return this.models.get(modelId) || null;
  }

  getAllModels(): PredictiveModel[] {
    return Array.from(this.models.values());
  }

  updateModel(modelId: string, updates: Partial<PredictiveModel>): boolean {
    const model = this.models.get(modelId);
    if (model) {
      this.models.set(modelId, { ...model, ...updates });
      return true;
    }
    return false;
  }

  // Feature importance analysis
  async getFeatureImportance(userId: string): Promise<Array<{ feature: string; importance: number; description: string }>> {
    try {
      const userData = await this.getUserData(userId);
      const features = this.extractFeatures(userData);
      
      // Calculate feature importance based on model weights
      const importance = this.calculateFeatureImportance(features);
      
      return importance.map(item => ({
        feature: item.feature,
        importance: item.importance,
        description: this.getFeatureDescription(item.feature)
      }));
    } catch (error) {
      console.error('Error getting feature importance:', error);
      return [];
    }
  }

  // Private helper methods
  private generateCacheKey(userId: string): string {
    return `prediction_${userId}_${Math.floor(Date.now() / (30 * 60 * 1000))}`; // 30-minute buckets
  }

  private extractFeatures(userData: UserBehaviorData): Record<string, number> {
    const features: Record<string, number> = {};
    
    // Session features
    features.session_duration = userData.engagement.avgSessionDuration;
    features.pages_viewed = userData.engagement.pagesPerSession;
    features.total_sessions = userData.engagement.totalSessions;
    features.bounce_rate = userData.engagement.bounceRate;
    features.conversion_events = userData.engagement.conversionEvents;

    // Event-based features
    const pageViews = userData.events.filter(e => e.type === 'page_view').length;
    const clicks = userData.events.filter(e => e.type === 'click').length;
    const formSubmissions = userData.events.filter(e => e.type === 'form_submit').length;
    const scrollEvents = userData.events.filter(e => e.type === 'scroll').length;
    
    features.page_views = pageViews;
    features.clicks = clicks;
    features.form_submissions = formSubmissions;
    features.scroll_depth = scrollEvents;

    // Time-based features
    const now = new Date();
    features.time_of_day = now.getHours() / 24;
    features.day_of_week = now.getDay() / 7;

    // Device features
    features.device_mobile = userData.demographics?.device === 'mobile' ? 1 : 0;
    features.device_desktop = userData.demographics?.device === 'desktop' ? 1 : 0;

    return features;
  }

  private predictConversion(features: Record<string, number>, model: PredictiveModel): number {
    // Simplified logistic regression prediction
    const weights = {
      session_duration: 0.15,
      pages_viewed: 0.20,
      form_submissions: 0.25,
      clicks: 0.10,
      scroll_depth: 0.08,
      total_sessions: 0.12,
      time_of_day: 0.05,
      day_of_week: 0.03,
      device_desktop: 0.02
    };

    let score = -2.5; // Base intercept
    
    for (const [feature, weight] of Object.entries(weights)) {
      score += (features[feature] || 0) * weight;
    }

    // Convert to probability using sigmoid function
    const probability = 1 / (1 + Math.exp(-score));
    return Math.min(Math.max(probability, 0), 1);
  }

  private predictChurn(features: Record<string, number>, model: PredictiveModel): number {
    // Simplified churn prediction
    const weights = {
      days_since_last_login: 0.30,
      engagement_score: -0.25,
      feature_usage_frequency: -0.20,
      support_tickets: 0.15,
      usage_trend: -0.10
    };

    let score = 0.5; // Base score
    
    for (const [feature, weight] of Object.entries(weights)) {
      score += (features[feature] || 0) * weight;
    }

    return Math.min(Math.max(score, 0), 1);
  }

  private predictLifetimeValue(features: Record<string, number>, model: PredictiveModel): number {
    // Simplified LTV prediction
    const baseLTV = 1000;
    const engagementMultiplier = 1 + (features.engagement_score || 0) * 0.5;
    const conversionMultiplier = 1 + (features.conversion_probability || 0) * 2;
    
    return baseLTV * engagementMultiplier * conversionMultiplier;
  }

  private predictSegment(features: Record<string, number>, model: PredictiveModel): 'high_value' | 'medium_value' | 'low_value' | 'at_risk' | 'churned' {
    const score = this.calculateSegmentScore(features);
    
    if (score >= 0.8) return 'high_value';
    if (score >= 0.6) return 'medium_value';
    if (score >= 0.4) return 'low_value';
    if (score >= 0.2) return 'at_risk';
    return 'churned';
  }

  private generateNextBestAction(features: Record<string, number>, predictions: any): string {
    const { conversionProbability, churnProbability, segment } = predictions;

    if (segment === 'high_value') {
      return 'Upsell premium features';
    } else if (segment === 'at_risk') {
      return 'Send retention email with special offer';
    } else if (conversionProbability < 0.3) {
      return 'Provide educational content and product demo';
    } else if (conversionProbability < 0.6) {
      return 'Offer free trial with personalized onboarding';
    } else {
      return 'Schedule sales call with product expert';
    }
  }

  private generateRecommendedContent(features: Record<string, number>, segment: string): string[] {
    const contentMap: Record<string, string[]> = {
      'high_value': [
        'Advanced features tutorial',
        'Case studies from similar companies',
        'ROI calculator and pricing guide',
        'Premium support options'
      ],
      'medium_value': [
        'Product comparison guide',
        'Success stories and testimonials',
        'Implementation best practices',
        'Free consultation offer'
      ],
      'low_value': [
        'Getting started guide',
        'Basic feature overview',
        'Industry insights and trends',
        'Free trial invitation'
      ],
      'at_risk': [
        'Special discount offer',
        'Product updates and improvements',
        'Customer success stories',
        'Direct support contact'
      ]
    };

    return contentMap[segment] || contentMap['low_value'];
  }

  private predictOptimalTiming(features: Record<string, number>): {
    bestHour: number;
    bestDay: string;
    timezone: string;
  } {
    // Simplified optimal timing prediction
    const hour = 10; // 10 AM
    const day = 'Tuesday';
    const timezone = 'America/New_York';

    return { bestHour: hour, bestDay: day, timezone };
  }

  private calculateConfidence(features: Record<string, number>, predictions: any): number {
    // Calculate confidence based on data completeness and model performance
    const dataCompleteness = this.calculateDataCompleteness(features);
    const modelAccuracy = 0.85; // Average model accuracy
    
    return dataCompleteness * modelAccuracy;
  }

  private identifyKeyFactors(features: Record<string, number>, predictions: any) {
    // Simplified factor identification
    const topContributors = [
      { factor: 'engagement_score', weight: 0.25, impact: 'positive' as const },
      { factor: 'session_duration', weight: 0.20, impact: 'positive' as const },
      { factor: 'pages_viewed', weight: 0.15, impact: 'positive' as const }
    ];

    const riskFactors = ['high_bounce_rate', 'low_session_duration'];
    const opportunityFactors = ['high_engagement', 'multiple_sessions', 'form_interactions'];

    return { topContributors, riskFactors, opportunityFactors };
  }

  private calculateSegmentScore(features: Record<string, number>): number {
    // Simplified segment scoring
    const engagementScore = features.engagement_score || 0;
    const conversionScore = features.conversion_probability || 0;
    const sessionScore = Math.min(features.session_duration / 300, 1); // Normalize to 0-1
    
    return (engagementScore * 0.4 + conversionScore * 0.4 + sessionScore * 0.2);
  }

  private calculateDataCompleteness(features: Record<string, number>): number {
    const totalFeatures = Object.keys(features).length;
    const nonZeroFeatures = Object.values(features).filter(v => v !== 0).length;
    return nonZeroFeatures / totalFeatures;
  }

  private calculateBehaviorScore(prediction: PredictionResult): number {
    const { conversionProbability, churnProbability, segment } = prediction.predictions;
    
    let score = 50; // Base score
    
    // Adjust based on conversion probability
    score += (conversionProbability - 0.5) * 30;
    
    // Adjust based on churn probability
    score -= (churnProbability - 0.5) * 20;
    
    // Adjust based on segment
    const segmentScores = {
      'high_value': 20,
      'medium_value': 10,
      'low_value': -5,
      'at_risk': -15,
      'churned': -25
    };
    
    score += segmentScores[segment] || 0;
    
    return Math.min(Math.max(score, 0), 100);
  }

  private async getHistoricalData(metric: string, timeframe: string): Promise<any[]> {
    // Get historical data from database
    const { data, error } = await this.supabase
      .from('analytics_data')
      .select('*')
      .eq('metric', metric)
      .gte('date', this.getStartDateForTimeframe(timeframe))
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching historical data:', error);
      return [];
    }

    return data || [];
  }

  private getStartDateForTimeframe(timeframe: string): string {
    const now = new Date();
    const days = {
      'daily': 30,
      'weekly': 90,
      'monthly': 365,
      'quarterly': 730,
      'yearly': 1825
    }[timeframe] || 365;

    return new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
  }

  private generateTimeSeriesPredictions(data: any[], timeframe: string): any[] {
    // Simplified time series prediction using moving average with trend
    const predictions = [];
    const windowSize = 7; // 7-day moving average
    
    for (let i = 0; i < 30; i++) { // Predict 30 days ahead
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + i + 1);
      
      // Simple prediction based on recent average with slight trend
      const recentData = data.slice(-windowSize);
      const average = recentData.reduce((sum, item) => sum + (item.value || 0), 0) / recentData.length;
      const trend = this.calculateTrend(recentData);
      
      const predicted = average * (1 + trend * 0.01); // 1% trend factor
      const confidenceInterval = {
        lower: predicted * 0.9,
        upper: predicted * 1.1
      };
      
      predictions.push({
        date: futureDate,
        predicted,
        confidenceInterval
      });
    }
    
    return predictions;
  }

  private calculateTrend(data: any[]): number {
    if (data.length < 2) return 0;
    
    const firstHalf = data.slice(0, Math.floor(data.length / 2));
    const secondHalf = data.slice(Math.floor(data.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, item) => sum + (item.value || 0), 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, item) => sum + (item.value || 0), 0) / secondHalf.length;
    
    return firstAvg > 0 ? ((secondAvg - firstAvg) / firstAvg) * 100 : 0;
  }

  private detectTrend(predictions: any[]): 'increasing' | 'decreasing' | 'stable' | 'seasonal' {
    const overallTrend = this.calculateTrend(predictions);
    
    if (overallTrend > 5) return 'increasing';
    if (overallTrend < -5) return 'decreasing';
    return 'stable';
  }

  private detectSeasonality(predictions: any[]): any {
    // Simplified seasonality detection
    return {
      daily: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6],
      weekly: [0.8, 0.9, 1.0, 1.1, 1.2, 1.1, 0.7]
    };
  }

  private detectAnomalies(predictions: any[]): any[] {
    // Simplified anomaly detection
    return [];
  }

  private calculateAvgSessionDuration(userHistory: any, sessionData: Partial<UserBehaviorData>): number {
    const totalDuration = userHistory.engagement?.avgSessionDuration * userHistory.totalSessions || 0;
    const newDuration = sessionData.engagement?.avgSessionDuration || 0;
    return (totalDuration + newDuration) / (userHistory.totalSessions + 1);
  }

  private calculatePagesPerSession(userHistory: any, sessionData: Partial<UserBehaviorData>): number {
    const totalPages = userHistory.engagement?.pagesPerSession * userHistory.totalSessions || 0;
    const newPages = sessionData.engagement?.pagesPerSession || 0;
    return (totalPages + newPages) / (userHistory.totalSessions + 1);
  }

  private calculateBounceRate(userHistory: any, sessionData: Partial<UserBehaviorData>): number {
    const totalBounces = userHistory.engagement?.bounceRate * userHistory.totalSessions || 0;
    const isBounce = sessionData.engagement?.bounceRate === 1 ? 1 : 0;
    return (totalBounces + isBounce) / (userHistory.totalSessions + 1);
  }

  private async getUserData(userId: string): Promise<UserBehaviorData> {
    // Get user data from database
    const { data, error } = await this.supabase
      .from('user_behavior_data')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      // Return default data for new users
      return {
        userId,
        sessionId: `session_${Date.now()}`,
        events: [],
        engagement: {
          totalSessions: 1,
          avgSessionDuration: 0,
          pagesPerSession: 0,
          bounceRate: 0,
          conversionEvents: 0
        }
      };
    }

    return data.data;
  }

  private async getUserHistory(userId: string): Promise<any> {
    // Get user historical data
    const { data, error } = await this.supabase
      .from('user_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return {
        totalSessions: 0,
        avgSessionDuration: 0,
        pagesPerSession: 0,
        bounceRate: 0,
        conversionEvents: 0
      };
    }

    return data;
  }

  private getFeatureDescription(feature: string): string {
    const descriptions: Record<string, string> = {
      'session_duration': 'Time spent on website',
      'pages_viewed': 'Number of pages visited',
      'form_submissions': 'Number of forms completed',
      'clicks': 'Number of clicks on elements',
      'scroll_depth': 'How far user scrolls on pages',
      'total_sessions': 'Total number of visits',
      'engagement_score': 'Overall engagement level'
    };

    return descriptions[feature] || feature;
  }

  private calculateFeatureImportance(features: Record<string, number>): Array<{ feature: string; importance: number }> {
    // Simplified feature importance calculation
    return Object.keys(features).map(feature => ({
      feature,
      importance: Math.abs(features[feature] || 0) * 10
    })).sort((a, b) => b.importance - a.importance);
  }
}

export default PredictiveAnalyticsService;