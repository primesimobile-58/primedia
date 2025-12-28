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
      companyName,
      firstName,
      lastName,
      jobTitle,
      companySize,
      industry,
      useCase,
      utmSource,
      utmMedium,
      utmCampaign
    } = body

    // Validate required fields
    if (!email || !companyName || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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

    // Check if demo request already exists for this email
    const { data: existingRequest } = await supabase
      .from('demo_requests')
      .select('id, status')
      .eq('email', email)
      .single()

    if (existingRequest) {
      return NextResponse.json(
        { 
          error: 'Demo request already exists',
          existingRequest: {
            id: existingRequest.id,
            status: existingRequest.status
          }
        },
        { status: 409 }
      )
    }

    // Insert new demo request
    const { data, error } = await supabase
      .from('demo_requests')
      .insert([
        {
          email,
          company_name: companyName,
          first_name: firstName,
          last_name: lastName,
          job_title: jobTitle,
          company_size: companySize,
          industry,
          use_case: useCase,
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
          ip_address: ip,
          user_agent: userAgent,
          status: 'pending'
        }
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create demo request' },
        { status: 500 }
      )
    }

    // Create CRM lead
    try {
      const crmLead: CRMLead = {
        email,
        firstName,
        lastName,
        company: companyName,
        phone: body.phone || undefined,
        useCase: useCase || undefined,
        companySize: companySize || undefined,
        source: 'demo_request',
        leadType: 'demo_request',
        utmSource: utmSource || undefined,
        utmCampaign: utmCampaign || undefined,
        utmMedium: utmMedium || undefined,
        ipAddress: ip,
        userAgent: userAgent,
      };

      const crmResult = await crmService.createLead(crmLead);
      
      // silently ignore CRM lead failure
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
        source: 'demo_request',
        tags: ['demo_request', 'lead', 'alya-intelligence', companySize || 'unknown'],
        customFields: {
          job_title: jobTitle,
          company_size: companySize,
          industry: industry,
          use_case: useCase
        },
        ipAddress: ip,
        userAgent: userAgent
      };

      const emailResults = await emailMarketing.addSubscriber(subscriberData);
      /* noop */
    } catch (emailError) {
      /* noop */
      // Don't fail the main request if email marketing fails
    }

    // Trigger demo request email sequence
    try {
      await emailSequenceService.triggerSequence('enterprise-onboarding', email, email);
    } catch (sequenceError) {
      /* noop */
      // Don't fail the main request if sequence fails
    }

    return NextResponse.json(
      { 
        success: true,
        message: 'Demo request submitted successfully',
        requestId: data.id
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('demo_requests')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch demo requests' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      data: data || []
    })

  } catch (error) {
    console.error('Get demo requests error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
