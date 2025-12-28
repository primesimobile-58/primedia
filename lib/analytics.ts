import mixpanel from 'mixpanel-browser';
import ReactGA from 'react-ga4';

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || '';
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
}

export interface UserProfile {
  id?: string;
  email?: string;
  name?: string;
  company?: string;
  role?: string;
  utm_source?: string;
  utm_campaign?: string;
  utm_medium?: string;
}

class AnalyticsService {
  private mixpanelInitialized = false;
  private gaInitialized = false;

  initialize() {
    // Initialize Mixpanel
    if (MIXPANEL_TOKEN && !this.mixpanelInitialized) {
      try {
        mixpanel.init(MIXPANEL_TOKEN, {
          debug: process.env.NODE_ENV === 'development',
          track_pageview: true,
          persistence: 'localStorage',
        });
        this.mixpanelInitialized = true;
      } catch (error) {
        /* noop */
      }
    }

    // Initialize Google Analytics
    if (GA_MEASUREMENT_ID && !this.gaInitialized) {
      try {
        ReactGA.initialize(GA_MEASUREMENT_ID);
        this.gaInitialized = true;
      } catch (error) {
        /* noop */
      }
    }
  }

  identify(userId: string, profile?: UserProfile) {
    if (this.mixpanelInitialized) {
      mixpanel.identify(userId);
      if (profile) {
        mixpanel.people.set({
          $email: profile.email,
          $name: profile.name,
          company: profile.company,
          role: profile.role,
          utm_source: profile.utm_source,
          utm_campaign: profile.utm_campaign,
          utm_medium: profile.utm_medium,
        });
      }
    }

    if (this.gaInitialized) {
      ReactGA.set({ userId });
      if (profile) {
        ReactGA.set({
          user_properties: {
            email: profile.email,
            name: profile.name,
            company: profile.company,
            role: profile.role,
          }
        });
      }
    }
  }

  track(event: AnalyticsEvent) {
    if (this.mixpanelInitialized) {
      mixpanel.track(event.name, event.properties);
    }

    if (this.gaInitialized) {
      ReactGA.event({
        action: event.name,
        category: 'engagement',
        label: event.properties?.category || 'general',
        value: event.properties?.value,
      });
    }

    /* noop */
  }

  trackPageView(pathname: string, title?: string) {
    if (this.gaInitialized) {
      ReactGA.send({
        hitType: 'pageview',
        page: pathname,
        title,
      });
    }

    if (this.mixpanelInitialized) {
      mixpanel.track('Page View', {
        page: pathname,
        title,
      });
    }
  }

  trackFormSubmission(formType: string, data: Record<string, any>) {
    this.track({
      name: 'Form Submitted',
      properties: {
        form_type: formType,
        ...data,
      },
    });
  }

  trackButtonClick(buttonName: string, properties?: Record<string, any>) {
    this.track({
      name: 'Button Clicked',
      properties: {
        button_name: buttonName,
        ...properties,
      },
    });
  }

  trackDemoRequest(data: Record<string, any>) {
    this.track({
      name: 'Demo Requested',
      properties: {
        ...data,
        event_category: 'lead_generation',
        value: 100, // Demo request value for analytics
      },
    });

    if (this.mixpanelInitialized) {
      mixpanel.people.increment('demo_requests');
      mixpanel.people.set({
        last_demo_request: new Date().toISOString(),
      });
    }
  }

  trackNewsletterSignup(email: string, source?: string) {
    this.track({
      name: 'Newsletter Subscribed',
      properties: {
        email,
        source: source || 'website',
        event_category: 'lead_generation',
        value: 10, // Newsletter signup value for analytics
      },
    });

    if (this.mixpanelInitialized) {
      mixpanel.people.set({
        $email: email,
        newsletter_subscribed: true,
        newsletter_source: source,
        newsletter_subscribed_date: new Date().toISOString(),
      });
    }
  }

  trackVideoPlay(videoName: string, duration?: number) {
    this.track({
      name: 'Video Played',
      properties: {
        video_name: videoName,
        duration,
        event_category: 'engagement',
      },
    });
  }

  trackScrollDepth(depth: number, page?: string) {
    this.track({
      name: 'Scroll Depth Reached',
      properties: {
        depth_percentage: depth,
        page: page || window.location.pathname,
        event_category: 'engagement',
      },
    });
  }

  trackTimeOnPage(duration: number, page?: string) {
    this.track({
      name: 'Time on Page',
      properties: {
        duration_seconds: duration,
        page: page || window.location.pathname,
        event_category: 'engagement',
      },
    });
  }

  reset() {
    if (this.mixpanelInitialized) {
      mixpanel.reset();
    }
  }
}

export const analytics = new AnalyticsService();

// Export individual functions for convenience
export const trackEvent = (name: string, properties?: Record<string, any>) => {
  analytics.track({ name, properties });
};

export const identifyUser = (userId: string, profile?: UserProfile) => {
  analytics.identify(userId, profile);
};
