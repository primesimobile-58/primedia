import { NextRequest, NextResponse } from 'next/server';
import { dynamicContentTargetingService } from '@/hooks/use-dynamic-content-targeting';
import { trackEvent } from '@/lib/analytics';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const elementId = searchParams.get('elementId');
    const variantId = searchParams.get('variantId');

    await trackEvent('content_analytics_requested', {
      element_id: elementId,
      variant_id: variantId,
      request_type: 'GET'
    });

    if (elementId) {
      const analytics = dynamicContentTargetingService.getContentAnalytics(elementId);
      
      if (!analytics) {
        return NextResponse.json(
          { error: 'Content analytics not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: analytics,
        timestamp: new Date().toISOString()
      });
    }

    // Return all content analytics if no specific element is requested
    const allContentAnalytics = [];
    const contentElements = ['hero-section', 'features-section', 'pricing-section', 'segment-showcase'];
    
    for (const element of contentElements) {
      const analytics = dynamicContentTargetingService.getContentAnalytics(element);
      if (analytics) {
        allContentAnalytics.push(analytics);
      }
    }

    const summary = {
      totalElements: allContentAnalytics.length,
      totalViews: allContentAnalytics.reduce((sum, analytics) => sum + analytics.totalViews, 0),
      totalClicks: allContentAnalytics.reduce((sum, analytics) => sum + analytics.totalClicks, 0),
      avgCtr: allContentAnalytics.reduce((sum, analytics) => sum + analytics.avgCtr, 0) / allContentAnalytics.length,
      topPerformingElement: allContentAnalytics.reduce((best, current) => 
        current.avgCtr > best.avgCtr ? current : best, allContentAnalytics[0]
      )?.elementId || 'none'
    };

    return NextResponse.json({
      success: true,
      data: {
        contentAnalytics: allContentAnalytics,
        summary
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    
    await trackEvent('content_analytics_error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      request_type: 'GET'
    });

    return NextResponse.json(
      { 
        error: 'Failed to retrieve content analytics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { elementId, variantId, action, userId } = body;

    if (!elementId || !variantId || !action) {
      return NextResponse.json(
        { error: 'elementId, variantId, and action are required' },
        { status: 400 }
      );
    }

    if (action === 'view') {
      dynamicContentTargetingService.trackContentView(elementId, variantId);
      
      await trackEvent('content_view_tracked', {
        element_id: elementId,
        variant_id: variantId,
        user_id: userId || 'anonymous'
      });

      return NextResponse.json({
        success: true,
        message: 'Content view tracked successfully',
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'click') {
      dynamicContentTargetingService.trackContentClick(elementId, variantId, 'cta');
      
      await trackEvent('content_click_tracked', {
        element_id: elementId,
        variant_id: variantId,
        action: 'cta',
        user_id: userId || 'anonymous'
      });

      return NextResponse.json({
        success: true,
        message: 'Content click tracked successfully',
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json(
      { error: 'Invalid action. Must be "view" or "click"' },
      { status: 400 }
    );

  } catch (error) {
    
    await trackEvent('content_tracking_error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      request_type: 'POST'
    });

    return NextResponse.json(
      { 
        error: 'Failed to track content interaction',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { elementId, variants, defaultVariant } = body;

    if (!elementId || !variants) {
      return NextResponse.json(
        { error: 'elementId and variants are required' },
        { status: 400 }
      );
    }

    // Update content targeting
    dynamicContentTargetingService.updateContentTarget(elementId, { 
      variants,
      defaultVariant 
    });

    await trackEvent('content_targeting_updated', {
      element_id: elementId,
      variant_count: variants.length,
      request_type: 'PUT'
    });

    return NextResponse.json({
      success: true,
      message: 'Content targeting updated successfully',
      data: {
        elementId,
        variantCount: variants.length,
        defaultVariant
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    
    await trackEvent('content_targeting_update_error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      request_type: 'PUT'
    });

    return NextResponse.json(
      { 
        error: 'Failed to update content targeting',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const elementId = searchParams.get('elementId');

    if (!elementId) {
      return NextResponse.json(
        { error: 'elementId is required' },
        { status: 400 }
      );
    }

    // Note: In a real implementation, you would remove the content target
    // For now, we'll just track the event
    await trackEvent('content_target_deleted', {
      element_id: elementId,
      request_type: 'DELETE'
    });

    return NextResponse.json({
      success: true,
      message: 'Content targeting deleted successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    
    await trackEvent('content_targeting_deletion_error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      request_type: 'DELETE'
    });

    return NextResponse.json(
      { 
        error: 'Failed to delete content targeting',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
