import { createServerClient } from '@/lib/supabase';
import { trackEvent } from '@/lib/analytics';

export interface ABTest {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'running' | 'paused' | 'completed';
  startDate: Date;
  endDate?: Date;
  trafficAllocation: number; // 0-100 percentage
  confidenceLevel: number; // 0-1 (e.g., 0.95 for 95%)
  winnerCriteria: 'conversion_rate' | 'engagement' | 'revenue' | 'custom';
  variants: ABTestVariant[];
  targetAudience?: {
    segments?: string[];
    devices?: ('desktop' | 'mobile' | 'tablet')[];
    countries?: string[];
    minSessionDuration?: number;
    minPageViews?: number;
  };
  goals: {
    primary: ABTestGoal;
    secondary?: ABTestGoal[];
  };
}

export interface ABTestVariant {
  id: string;
  name: string;
  trafficWeight: number; // 0-1 (e.g., 0.5 for 50%)
  content: {
    heroTitle?: string;
    heroSubtitle?: string;
    ctaText?: string;
    ctaColor?: string;
    heroImage?: string;
    socialProofText?: string;
    pricingHighlight?: string;
    featuresOrder?: string[];
    testimonialsOrder?: string[];
    [key: string]: any;
  };
  isControl: boolean;
}

export interface ABTestGoal {
  id: string;
  name: string;
  type: 'conversion' | 'engagement' | 'revenue' | 'time_on_page' | 'scroll_depth';
  eventName: string;
  targetValue?: number;
  successCriteria: 'increase' | 'decrease';
}

export interface ABTestResult {
  testId: string;
  variantId: string;
  visitors: number;
  conversions: number;
  conversionRate: number;
  confidence: number;
  significance: boolean;
  lift: number; // percentage improvement over control
  revenue?: number;
  avgTimeOnPage?: number;
  avgScrollDepth?: number;
  pValue: number;
  standardError: number;
}

export interface UserAssignment {
  userId: string;
  testId: string;
  variantId: string;
  assignedAt: Date;
  sessionId: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  country?: string;
  referrer?: string;
}

class ABTestingService {
  private supabase = createServerClient();

  // Get active A/B tests for the current user
  async getActiveTests(userId?: string, sessionId?: string): Promise<ABTest[]> {
    try {
      const { data: tests, error } = await this.supabase
        .from('ab_tests')
        .select(`
          *,
          ab_test_variants (*)
        `)
        .eq('status', 'running')
        .lte('start_date', new Date().toISOString())
        .or(`end_date.is.null,end_date.gte.${new Date().toISOString()}`)
        .order('created_at', { ascending: false });

      if (error) {
        return [];
      }

      return tests.map(test => this.formatTestData(test));
    } catch (error) {
      return [];
    }
  }

  // Assign user to test variant
  async assignUserToTest(
    testId: string,
    userId: string,
    sessionId: string,
    deviceType: 'desktop' | 'mobile' | 'tablet',
    country?: string,
    referrer?: string
  ): Promise<string | null> {
    try {
      // Check if user is already assigned to this test
      const { data: existingAssignment } = await this.supabase
        .from('ab_test_assignments')
        .select('variant_id')
        .eq('test_id', testId)
        .eq('user_id', userId)
        .single();

      if (existingAssignment) {
        return existingAssignment.variant_id;
      }

      // Get test details
      const { data: test } = await this.supabase
        .from('ab_tests')
        .select(`
          *,
          ab_test_variants (*)
        `)
        .eq('id', testId)
        .single();

      if (!test) {
        return null;
      }

      const formattedTest = this.formatTestData(test);
      
      // Check if user qualifies for this test based on audience criteria
      if (!this.userQualifiesForTest(formattedTest, { deviceType, country, referrer })) {
        return null;
      }

      // Select variant based on traffic weights
      const variantId = this.selectVariant(formattedTest.variants);

      // Record assignment
      const { error } = await this.supabase
        .from('ab_test_assignments')
        .insert([{
          test_id: testId,
          user_id: userId,
          variant_id: variantId,
          session_id: sessionId,
          device_type: deviceType,
          country,
          referrer,
          assigned_at: new Date().toISOString()
        }]);

      if (error) {
        return null;
      }

      // Track assignment event
      trackEvent('ab_test_assignment', {
        test_id: testId,
        variant_id: variantId,
        user_id: userId,
        device_type: deviceType
      });

      return variantId;
    } catch (error) {
      return null;
    }
  }

  // Track conversion event for A/B test
  async trackConversion(
    testId: string,
    userId: string,
    variantId: string,
    eventName: string,
    value?: number,
    metadata?: Record<string, any>
  ): Promise<void> {
    try {
      // Record conversion
      const { error } = await this.supabase
        .from('ab_test_conversions')
        .insert([{
          test_id: testId,
          user_id: userId,
          variant_id: variantId,
          event_name: eventName,
          value: value || 1,
          metadata,
          converted_at: new Date().toISOString()
        }]);

      if (error) {
        return;
      }

      // Track conversion event
      trackEvent('ab_test_conversion', {
        test_id: testId,
        variant_id: variantId,
        event_name: eventName,
        value: value || 1
      });
    } catch (error) {
      /* noop */
    }
  }

  // Get test results and statistics
  async getTestResults(testId: string): Promise<ABTestResult[]> {
    try {
      // Get all assignments and conversions for this test
      const { data: assignments } = await this.supabase
        .from('ab_test_assignments')
        .select('*')
        .eq('test_id', testId);

      const { data: conversions } = await this.supabase
        .from('ab_test_conversions')
        .select('*')
        .eq('test_id', testId);

      if (!assignments || !conversions) {
        return [];
      }

      // Calculate results for each variant
      const results: ABTestResult[] = [];
      const variants = [...new Set(assignments.map(a => a.variant_id))];

      for (const variantId of variants) {
        const variantAssignments = assignments.filter(a => a.variant_id === variantId);
        const variantConversions = conversions.filter(c => c.variant_id === variantId);
        
        const visitors = variantAssignments.length;
        const conversionsCount = variantConversions.length;
        const conversionRate = visitors > 0 ? conversionsCount / visitors : 0;

        // Calculate statistical significance
        const controlResults = results.find(r => this.isControlVariant(testId, r.variantId));
        let confidence = 0;
        let significance = false;
        let lift = 0;
        let pValue = 1;

        if (controlResults && controlResults.conversionRate > 0) {
          const test = this.calculateStatisticalSignificance(
            controlResults.visitors,
            controlResults.conversions,
            visitors,
            conversionsCount
          );
          confidence = test.confidence;
          significance = test.significant;
          lift = ((conversionRate - controlResults.conversionRate) / controlResults.conversionRate) * 100;
          pValue = test.pValue;
        }

        results.push({
          testId,
          variantId,
          visitors,
          conversions: conversionsCount,
          conversionRate,
          confidence,
          significance,
          lift,
          pValue,
          standardError: this.calculateStandardError(visitors, conversionRate)
        });
      }

      return results;
    } catch (error) {
      return [];
    }
  }

  // Create new A/B test
  async createTest(test: Omit<ABTest, 'id'>): Promise<string | null> {
    try {
      const { data, error } = await this.supabase
        .from('ab_tests')
        .insert([{
          name: test.name,
          description: test.description,
          status: test.status,
          start_date: test.startDate.toISOString(),
          end_date: test.endDate?.toISOString(),
          traffic_allocation: test.trafficAllocation,
          confidence_level: test.confidenceLevel,
          winner_criteria: test.winnerCriteria,
          target_audience: test.targetAudience,
          goals: test.goals,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        return null;
      }

      // Create variants
      for (const variant of test.variants) {
        await this.supabase
          .from('ab_test_variants')
          .insert([{
            test_id: data.id,
            name: variant.name,
            traffic_weight: variant.trafficWeight,
            content: variant.content,
            is_control: variant.isControl
          }]);
      }

      return data.id;
    } catch (error) {
      return null;
    }
  }

  // Update test status (pause, resume, complete)
  async updateTestStatus(testId: string, status: ABTest['status']): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('ab_tests')
        .update({ status })
        .eq('id', testId);

      if (error) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  // Declare winner and complete test
  async declareWinner(testId: string, winningVariantId: string): Promise<boolean> {
    try {
      // Get test results
      const results = await this.getTestResults(testId);
      const winningResult = results.find(r => r.variantId === winningVariantId);

      if (!winningResult || !winningResult.significance) {
        return false;
      }

      // Update test with winner
      const { error } = await this.supabase
        .from('ab_tests')
        .update({
          status: 'completed',
          winner_variant_id: winningVariantId,
          completed_at: new Date().toISOString()
        })
        .eq('id', testId);

      if (error) {
        return false;
      }

      // Track winner declaration
      trackEvent('ab_test_winner_declared', {
        test_id: testId,
        winning_variant_id: winningVariantId,
        confidence: winningResult.confidence,
        lift: winningResult.lift
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  // Helper methods
  private formatTestData(test: any): ABTest {
    return {
      id: test.id,
      name: test.name,
      description: test.description,
      status: test.status,
      startDate: new Date(test.start_date),
      endDate: test.end_date ? new Date(test.end_date) : undefined,
      trafficAllocation: test.traffic_allocation,
      confidenceLevel: test.confidence_level,
      winnerCriteria: test.winner_criteria,
      targetAudience: test.target_audience,
      goals: test.goals,
      variants: test.ab_test_variants.map((v: any) => ({
        id: v.id,
        name: v.name,
        trafficWeight: v.traffic_weight,
        content: v.content,
        isControl: v.is_control
      }))
    };
  }

  private userQualifiesForTest(
    test: ABTest,
    userContext: { deviceType: string; country?: string; referrer?: string }
  ): boolean {
    if (!test.targetAudience) return true;

    const { devices, countries } = test.targetAudience;

    // Check device targeting
    if (devices && devices.length > 0) {
      if (!devices.includes(userContext.deviceType as any)) {
        return false;
      }
    }

    // Check country targeting
    if (countries && countries.length > 0) {
      if (!userContext.country || !countries.includes(userContext.country)) {
        return false;
      }
    }

    return true;
  }

  private selectVariant(variants: ABTestVariant[]): string {
    const random = Math.random();
    let cumulativeWeight = 0;

    for (const variant of variants) {
      cumulativeWeight += variant.trafficWeight;
      if (random <= cumulativeWeight) {
        return variant.id;
      }
    }

    // Fallback to first variant
    return variants[0].id;
  }

  private isControlVariant(testId: string, variantId: string): boolean {
    // This would typically query the database
    // For now, assume the first variant is control
    return false;
  }

  private calculateStatisticalSignificance(
    controlVisitors: number,
    controlConversions: number,
    testVisitors: number,
    testConversions: number
  ): { confidence: number; significant: boolean; pValue: number } {
    // Two-proportion z-test
    const p1 = controlConversions / controlVisitors;
    const p2 = testConversions / testVisitors;
    const p = (controlConversions + testConversions) / (controlVisitors + testVisitors);

    const se = Math.sqrt(p * (1 - p) * (1 / controlVisitors + 1 / testVisitors));
    const z = (p2 - p1) / se;

    // Convert z-score to confidence level (two-tailed test)
    const confidence = Math.min(1 - (1 - this.normalCDF(Math.abs(z))) * 2, 0.999);
    const pValue = 2 * (1 - this.normalCDF(Math.abs(z)));
    const significant = pValue < 0.05; // 95% confidence level

    return { confidence, significant, pValue };
  }

  private normalCDF(x: number): number {
    // Approximation of standard normal CDF
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x) / Math.sqrt(2);

    const t = 1 / (1 + p * x);
    const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return 0.5 * (1 + sign * y);
  }

  private calculateStandardError(visitors: number, rate: number): number {
    return Math.sqrt((rate * (1 - rate)) / visitors);
  }
}

export default ABTestingService;
