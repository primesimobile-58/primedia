import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { crmService, CRMLead } from '@/lib/crm'
import EmailMarketingService from '@/lib/email-marketing'
import { emailSequenceService } from '@/lib/email-sequences'

// Initialize Supabase client with service role key for admin operations
const supabase = createServerClient()

// Initialize email marketing service with configuration from environment
const emailMarketing = new EmailMarketingService({
  mailchimp: process.env.MAILCHIMP_API_KEY ? {
    apiKey: process.env.MAILCHIMP_API_KEY,
    serverPrefix: process.env.MAILCHIMP_SERVER_PREFIX || 'us1',
    listId: process.env.MAILCHIMP_LIST_ID || 'main'
  } : undefined,
  sendgrid: process.env.SENDGRID_API_KEY ? {
    apiKey: process.env.SENDGRID_API_KEY,
    listId: process.env.SENDGRID_LIST_ID
  } : undefined,
  activeCampaign: process.env.ACTIVECAMPAIGN_API_KEY ? {
    apiKey: process.env.ACTIVECAMPAIGN_API_KEY,
    baseUrl: process.env.ACTIVECAMPAIGN_BASE_URL || 'https://youraccount.api-us1.com',
    listId: process.env.ACTIVECAMPAIGN_LIST_ID
  } : undefined
})

// Use the existing email sequence service

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      email,
      firstName,
      lastName,
      companyName,
      industry,
      preferences = {}
    } = body

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Get client IP and user agent
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Check if subscription already exists
    const { data: existingSubscription } = await supabase
      .from('newsletter_subscriptions')
      .select('id, is_active')
      .eq('email', email)
      .single()

    if (existingSubscription) {
      if (existingSubscription.is_active) {
        return NextResponse.json(
          { 
            error: 'Already subscribed',
            message: 'You are already subscribed to our newsletter'
          },
          { status: 409 }
        )
      } else {
        // Reactivate subscription
        const { data, error } = await supabase
          .from('newsletter_subscriptions')
          .update({
            is_active: true,
            unsubscribed_at: null,
            first_name: firstName,
            last_name: lastName,
            company_name: companyName,
            industry,
            preferences,
            ip_address: ip,
            user_agent: userAgent
          })
          .eq('email', email)
          .select()
          .single()

        if (error) {
          return NextResponse.json(
            { error: 'Failed to reactivate subscription' },
            { status: 500 }
          )
        }

        return NextResponse.json(
          { 
            success: true,
            message: 'Subscription reactivated successfully',
            subscriptionId: data.id
          },
          { status: 200 }
        )
      }
    }

    // Insert new subscription
    const { data, error } = await supabase
      .from('newsletter_subscriptions')
      .insert([
        {
          email,
          first_name: firstName,
          last_name: lastName,
          company_name: companyName,
          industry,
          preferences,
          is_active: true,
          ip_address: ip,
          user_agent: userAgent
        }
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create subscription' },
        { status: 500 }
      )
    }

    // Create CRM lead for newsletter subscription
    try {
      const crmLead: CRMLead = {
        email,
        firstName: firstName || 'Newsletter',
        lastName: lastName || 'Subscriber',
        company: companyName || 'Unknown',
        source: 'newsletter',
        leadType: 'newsletter',
        ipAddress: ip,
        userAgent: userAgent,
      };

      const crmResult = await crmService.createLead(crmLead);
      
      if (!crmResult.success) {
        /* noop */
      }
    } catch (crmError) {
      /* noop */
      // Don't fail the request if CRM integration fails
    }

    // Add to email marketing platforms
    try {
      const subscriberData = {
        email,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        company: companyName || undefined,
        source: 'newsletter',
        tags: ['newsletter', 'subscriber', 'alya-intelligence'],
        ipAddress: ip,
        userAgent: userAgent
      };

      await emailMarketing.addSubscriber(subscriberData);
    } catch (emailError) {
      /* noop */
      // Don't fail the main request if email marketing fails
    }

    // Trigger welcome email sequence
    try {
      await emailSequenceService.triggerSequence('newsletter-welcome', email, email);
    } catch (sequenceError) {
      /* noop */
      // Don't fail the main request if sequence fails
    }

    return NextResponse.json(
      { 
        success: true,
        message: 'Successfully subscribed to newsletter',
        subscriptionId: data.id
      },
      { status: 201 }
    )

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Update subscription to inactive
    const { data, error } = await supabase
      .from('newsletter_subscriptions')
      .update({
        is_active: false,
        unsubscribed_at: new Date().toISOString()
      })
      .eq('email', email)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to unsubscribe' },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { 
        success: true,
        message: 'Successfully unsubscribed from newsletter'
      },
      { status: 200 }
    )

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
