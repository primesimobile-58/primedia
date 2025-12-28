import { NextRequest, NextResponse } from 'next/server';
import { userSegmentationService } from '@/lib/user-segmentation';
import { trackEvent } from '@/lib/analytics';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'anonymous';
    const segmentId = searchParams.get('segmentId');

    await trackEvent('segment_analytics_requested', {
      user_id: userId,
      segment_id: segmentId,
      request_type: 'GET'
    });

    if (segmentId) {
      const analytics = await userSegmentationService.getSegmentAnalytics(segmentId);
      
      if (!analytics) {
        return NextResponse.json(
          { error: 'Segment not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: analytics,
        timestamp: new Date().toISOString()
      });
    }

    const allSegments = userSegmentationService.getAllSegments();
    const segmentAnalytics = [];

    for (const segment of allSegments) {
      const analytics = await userSegmentationService.getSegmentAnalytics(segment.id);
      if (analytics) {
        segmentAnalytics.push(analytics);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        segments: segmentAnalytics,
        totalSegments: segmentAnalytics.length,
        summary: {
          totalUsers: segmentAnalytics.reduce((sum, seg) => sum + seg.userCount, 0),
          avgConversionRate: segmentAnalytics.reduce((sum, seg) => sum + seg.conversionRate, 0) / segmentAnalytics.length,
          avgEngagementScore: segmentAnalytics.reduce((sum, seg) => sum + seg.engagementScore, 0) / segmentAnalytics.length,
          avgLifetimeValue: segmentAnalytics.reduce((sum, seg) => sum + seg.avgLifetimeValue, 0) / segmentAnalytics.length
        }
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    
    await trackEvent('segment_analytics_error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      request_type: 'GET'
    });

    return NextResponse.json(
      { 
        error: 'Failed to retrieve segment analytics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, userData } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    await trackEvent('user_segmentation_evaluated', {
      user_id: userId,
      request_type: 'POST'
    });

    const segmentMatches = await userSegmentationService.evaluateUserSegments(userId, userData || {});
    const userSegments = await userSegmentationService.getUserSegments(userId);

    return NextResponse.json({
      success: true,
      data: {
        segmentMatches,
        userSegments,
        segmentCount: segmentMatches.length,
        topSegment: segmentMatches[0] || null
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    
    await trackEvent('user_segmentation_error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      request_type: 'POST'
    });

    return NextResponse.json(
      { 
        error: 'Failed to evaluate user segments',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { segmentId, updates } = body;

    if (!segmentId || !updates) {
      return NextResponse.json(
        { error: 'segmentId and updates are required' },
        { status: 400 }
      );
    }

    await trackEvent('segment_updated', {
      segment_id: segmentId,
      updates: Object.keys(updates),
      request_type: 'PUT'
    });

    const updatedSegment = await userSegmentationService.updateSegment(segmentId, updates);

    if (!updatedSegment) {
      return NextResponse.json(
        { error: 'Segment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedSegment,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    
    await trackEvent('segment_update_error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      request_type: 'PUT'
    });

    return NextResponse.json(
      { 
        error: 'Failed to update segment',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const segmentId = searchParams.get('segmentId');

    if (!segmentId) {
      return NextResponse.json(
        { error: 'segmentId is required' },
        { status: 400 }
      );
    }

    await trackEvent('segment_deleted', {
      segment_id: segmentId,
      request_type: 'DELETE'
    });

    const deleted = await userSegmentationService.deleteSegment(segmentId);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Segment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Segment deleted successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Segment deletion error:', error);
    
    await trackEvent('segment_deletion_error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      request_type: 'DELETE'
    });

    return NextResponse.json(
      { 
        error: 'Failed to delete segment',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
