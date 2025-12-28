import { NextRequest, NextResponse } from 'next/server';
import { realTimeAudienceTargetingService } from '@/hooks/use-real-time-audience-targeting';
import { trackEvent } from '@/lib/analytics';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const audienceId = searchParams.get('audienceId');
    const campaignId = searchParams.get('campaignId');

    await trackEvent('audience_analytics_requested', {
      audience_id: audienceId,
      campaign_id: campaignId,
      request_type: 'GET'
    });

    if (audienceId) {
      const audience = realTimeAudienceTargetingService.getAudienceById(audienceId);
      const realTimeData = realTimeAudienceTargetingService.getRealTimeAudienceData(audienceId);
      const size = await realTimeAudienceTargetingService.calculateAudienceSize(audienceId);

      if (!audience) {
        return NextResponse.json(
          { error: 'Audience not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          audience,
          realTimeData,
          currentSize: size,
          estimatedReach: audience.estimatedReach,
          conversionRate: audience.conversionRate
        },
        timestamp: new Date().toISOString()
      });
    }

    if (campaignId) {
      const campaignPerformance = await realTimeAudienceTargetingService.getCampaignPerformance(campaignId);
      
      return NextResponse.json({
        success: true,
        data: campaignPerformance,
        timestamp: new Date().toISOString()
      });
    }

    const allAudiences = realTimeAudienceTargetingService.getAllAudiences();
    const activeAudiences = realTimeAudienceTargetingService.getActiveAudiences();

    const audienceAnalytics = [];
    for (const audience of allAudiences) {
      const realTimeData = realTimeAudienceTargetingService.getRealTimeAudienceData(audience.id);
      const size = await realTimeAudienceTargetingService.calculateAudienceSize(audience.id);
      
      audienceAnalytics.push({
        ...audience,
        realTimeData,
        currentSize: size
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        audiences: audienceAnalytics,
        totalAudiences: allAudiences.length,
        activeAudiences: activeAudiences.length,
        summary: {
          totalEstimatedReach: allAudiences.reduce((sum, audience) => sum + audience.estimatedReach, 0),
          avgConversionRate: allAudiences.reduce((sum, audience) => sum + audience.conversionRate, 0) / allAudiences.length,
          totalCurrentUsers: audienceAnalytics.reduce((sum, audience) => sum + (audience.realTimeData?.currentUsers || 0), 0)
        }
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    
    await trackEvent('audience_analytics_error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      request_type: 'GET'
    });

    return NextResponse.json(
      { 
        error: 'Failed to retrieve audience analytics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, segments, conditions, estimatedReach, conversionRate } = body;

    if (!name || !segments || !conditions) {
      return NextResponse.json(
        { error: 'name, segments, and conditions are required' },
        { status: 400 }
      );
    }

    const newAudience = await realTimeAudienceTargetingService.createAudience({
      name,
      description,
      segments,
      conditions,
      size: estimatedReach || 1000,
      estimatedReach: estimatedReach || 1000,
      conversionRate: conversionRate || 0.05,
      isActive: true
    });

    await trackEvent('audience_created', {
      audience_id: newAudience.id,
      audience_name: newAudience.name,
      segment_count: newAudience.segments.length,
      estimated_reach: newAudience.estimatedReach
    });

    return NextResponse.json({
      success: true,
      data: newAudience,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    
    await trackEvent('audience_creation_error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      request_type: 'POST'
    });

    return NextResponse.json(
      { 
        error: 'Failed to create audience',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { audienceId, updates } = body;

    if (!audienceId || !updates) {
      return NextResponse.json(
        { error: 'audienceId and updates are required' },
        { status: 400 }
      );
    }

    const updatedAudience = await realTimeAudienceTargetingService.updateAudience(audienceId, updates);

    if (!updatedAudience) {
      return NextResponse.json(
        { error: 'Audience not found' },
        { status: 404 }
      );
    }

    await trackEvent('audience_updated', {
      audience_id: audienceId,
      updates: Object.keys(updates),
      request_type: 'PUT'
    });

    return NextResponse.json({
      success: true,
      data: updatedAudience,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    
    await trackEvent('audience_update_error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      request_type: 'PUT'
    });

    return NextResponse.json(
      { 
        error: 'Failed to update audience',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const audienceId = searchParams.get('audienceId');

    if (!audienceId) {
      return NextResponse.json(
        { error: 'audienceId is required' },
        { status: 400 }
      );
    }

    const deleted = await realTimeAudienceTargetingService.deleteAudience(audienceId);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Audience not found' },
        { status: 404 }
      );
    }

    await trackEvent('audience_deleted', {
      audience_id: audienceId,
      request_type: 'DELETE'
    });

    return NextResponse.json({
      success: true,
      message: 'Audience deleted successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Audience deletion error:', error);
    
    await trackEvent('audience_deletion_error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      request_type: 'DELETE'
    });

    return NextResponse.json(
      { 
        error: 'Failed to delete audience',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
