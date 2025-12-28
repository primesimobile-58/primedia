'use client';

import { useState, useEffect } from 'react';

export interface EmailSequence {
  id: string;
  name: string;
  description: string;
  trigger: {
    type: 'signup' | 'segment' | 'behavior' | 'time';
    condition?: string;
  };
  emails: {
    subject: string;
    content: string;
    delayDays: number;
    fromEmail: string;
    fromName: string;
  }[];
  isActive: boolean;
  targetAudience: 'enterprise' | 'startup' | 'smb' | 'all';
}

export class EmailSequenceService {
  private sequences: EmailSequence[] = [];

  constructor() {
    this.initializeSequences();
  }

  private initializeSequences(): void {
    this.sequences = [
      {
        id: 'enterprise-onboarding',
        name: 'Enterprise Onboarding',
        description: 'Welcome sequence for enterprise prospects',
        trigger: { type: 'segment', condition: 'enterprise-prospects' },
        emails: [
          {
            subject: 'Welcome to Alya Intelligence - Your Enterprise Journey Begins',
            content: this.generateWelcomeEmail('enterprise'),
            delayDays: 0,
            fromEmail: 'welcome@alya-intelligence.com',
            fromName: 'Alya Team'
          },
          {
            subject: 'Case Study: How EnterpriseCorp Increased Revenue by 340%',
            content: this.generateCaseStudyEmail('enterprise'),
            delayDays: 2,
            fromEmail: 'success@alya-intelligence.com',
            fromName: 'Alya Success Team'
          },
          {
            subject: 'Unlock Advanced AI Features for Your Enterprise',
            content: this.generateFeaturesEmail('enterprise'),
            delayDays: 5,
            fromEmail: 'product@alya-intelligence.com',
            fromName: 'Alya Product Team'
          },
          {
            subject: 'Exclusive: 30-Day Enterprise Trial + White-Glove Setup',
            content: this.generateTrialOfferEmail('enterprise'),
            delayDays: 7,
            fromEmail: 'sales@alya-intelligence.com',
            fromName: 'Alya Sales Team'
          }
        ],
        isActive: true,
        targetAudience: 'enterprise'
      },
      {
        id: 'newsletter-welcome',
        name: 'Newsletter Welcome Series',
        description: 'Educational sequence for newsletter subscribers',
        trigger: { type: 'behavior', condition: 'newsletter-signup' },
        emails: [
          {
            subject: 'Welcome to the Alya Intelligence Newsletter!',
            content: this.generateNewsletterWelcomeEmail(),
            delayDays: 0,
            fromEmail: 'newsletter@alya-intelligence.com',
            fromName: 'Alya Insights Team'
          },
          {
            subject: 'AI Marketing Trends 2024: What 10,000 Campaigns Teach Us',
            content: this.generateFeaturesEmail('newsletter'),
            delayDays: 3,
            fromEmail: 'insights@alya-intelligence.com',
            fromName: 'Alya Insights Team'
          },
          {
            subject: 'The Science Behind Predictive Analytics in Marketing',
            content: this.generateFeaturesEmail('newsletter'),
            delayDays: 7,
            fromEmail: 'insights@alya-intelligence.com',
            fromName: 'Alya Insights Team'
          },
          {
            subject: 'Free Guide: Implementing AI in Your Marketing Stack',
            content: this.generateFeaturesEmail('newsletter'),
            delayDays: 14,
            fromEmail: 'insights@alya-intelligence.com',
            fromName: 'Alya Insights Team'
          }
        ],
        isActive: true,
        targetAudience: 'all'
      },
      {
        id: 'trial-nurture',
        name: 'Trial Nurture Sequence',
        description: 'Nurture sequence for trial users',
        trigger: { type: 'behavior', condition: 'trial-started' },
        emails: [
          {
            subject: '🎉 Your Trial is Ready! Quick Start Inside',
            content: this.generateTrialWelcomeEmail(),
            delayDays: 0,
            fromEmail: 'success@alya-intelligence.com',
            fromName: 'Alya Success Team'
          },
          {
            subject: 'Day 3: See Your First AI Predictions in Action',
            content: this.generateQuickWinsEmail(),
            delayDays: 3,
            fromEmail: 'success@alya-intelligence.com',
            fromName: 'Alya Success Team'
          },
          {
            subject: 'Week 1 Milestone: Advanced Features Unlocked',
            content: this.generateFeaturesEmail('enterprise'),
            delayDays: 7,
            fromEmail: 'success@alya-intelligence.com',
            fromName: 'Alya Success Team'
          },
          {
            subject: 'Final Days: Exclusive Pricing for Early Adopters',
            content: this.generateTrialOfferEmail('enterprise'),
            delayDays: 12,
            fromEmail: 'success@alya-intelligence.com',
            fromName: 'Alya Success Team'
          }
        ],
        isActive: true,
        targetAudience: 'all'
      },
      {
        id: 'smb-nurture',
        name: 'SMB Nurture Sequence',
        description: 'Sequence for small and medium businesses',
        trigger: { type: 'segment', condition: 'smb-prospects' },
        emails: [
          {
            subject: 'Your AI Marketing Guide is Here! + Bonus Templates',
            content: this.generateFeaturesEmail('smb'),
            delayDays: 0,
            fromEmail: 'resources@alya-intelligence.com',
            fromName: 'Alya Resources Team'
          },
          {
            subject: 'Case Study: How LocalBiz Grew 150% with AI',
            content: this.generateSMBCaseStudyEmail(),
            delayDays: 3,
            fromEmail: 'success@alya-intelligence.com',
            fromName: 'Alya Success Team'
          },
          {
            subject: 'Free Consultation: Personalized AI Strategy Session',
            content: this.generateCaseStudyEmail('smb'),
            delayDays: 7,
            fromEmail: 'sales@alya-intelligence.com',
            fromName: 'Alya Sales Team'
          }
        ],
        isActive: true,
        targetAudience: 'smb'
      },
      {
        id: 'startup-nurture',
        name: 'Startup Nurture Sequence',
        description: 'Sequence for startup founders',
        trigger: { type: 'segment', condition: 'startup-enthusiasts' },
        emails: [
          {
            subject: 'Startup-Friendly Pricing + Growth Hacks Inside',
            content: this.generateTrialOfferEmail('startup'),
            delayDays: 0,
            fromEmail: 'startup@alya-intelligence.com',
            fromName: 'Alya Startup Team'
          },
          {
            subject: 'YC Alumni Exclusive: 50% Off First Year',
            content: this.generateTrialOfferEmail('startup'),
            delayDays: 3,
            fromEmail: 'startup@alya-intelligence.com',
            fromName: 'Alya Startup Team'
          },
          {
            subject: 'Limited Spots: Startup Accelerator Program',
            content: this.generateTrialOfferEmail('startup'),
            delayDays: 5,
            fromEmail: 'startup@alya-intelligence.com',
            fromName: 'Alya Startup Team'
          }
        ],
        isActive: true,
        targetAudience: 'startup'
      }
    ];
  }

  private generateWelcomeEmail(audience: string): string {
    return `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #10b981;">Welcome to Alya Intelligence! 🚀</h1>
            <p>Thanks for joining thousands of marketers who are transforming their campaigns with AI.</p>
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 25px; border-radius: 12px; text-align: center; margin: 20px 0;">
              <h3>Your Journey Starts Here</h3>
              <p>Here's what you can expect in the next few days:</p>
              <div style="text-align: left; margin: 15px 0;">
                <p>✅ <strong>Day 1:</strong> Exclusive case study (${audience === 'enterprise' ? 'Enterprise' : 'Growth'})</p>
                <p>✅ <strong>Day 3:</strong> Advanced AI features tour</p>
                <p>✅ <strong>Day 5:</strong> Personalized trial offer</p>
              </div>
            </div>
            <p><strong>Quick tip:</strong> Connect your data sources first to get personalized insights from day one.</p>
            <a href="https://app.alya-intelligence.com/onboarding" style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0; font-size: 16px;">Get Started</a>
            <p>Questions? Just reply to this email - I read every single one.</p>
            <p>Best,<br>David from Alya Intelligence</p>
          </div>
        </body>
      </html>
    `;
  }

  private generateCaseStudyEmail(audience: string): string {
    return `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">Case Study: 340% Revenue Increase in 90 Days</h2>
            <p>See how ${audience === 'enterprise' ? 'TechCorp Enterprise' : 'GrowthStartup'} transformed their marketing with AI:</p>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>The Challenge</h3>
              <p>${audience === 'enterprise' ? 
                'TechCorp had 50,000+ customers but stagnant growth. Their marketing team was overwhelmed with data but lacked actionable insights.' :
                'GrowthStartup was struggling to scale beyond 1,000 customers. Their small team couldn’t personalize at scale.'}</p>
              <h3>The Solution</h3>
              <p>They implemented Alya Intelligence to:</p>
              <ul>
                <li>Predict customer churn before it happens</li>
                <li>Personalize campaigns based on behavioral data</li>
                <li>Optimize timing for maximum engagement</li>
              </ul>
              <h3>The Results</h3>
              <div style="background: #10b981; color: white; padding: 15px; border-radius: 6px; margin: 10px 0;">
                <strong>340% revenue increase in 90 days</strong>
              </div>
              <ul>
                <li>Churn reduced by 67%</li>
                <li>Customer lifetime value increased by 245%</li>
                <li>Marketing efficiency improved by 450%</li>
              </ul>
            </div>
            <p><strong>Want similar results?</strong> Here's your personalized action plan:</p>
            <a href="https://calendly.com/alya-intelligence/strategy-call" style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0; font-size: 16px;">Get Your Strategy</a>
            <p>Best,<br>David from Alya Intelligence</p>
          </div>
        </body>
      </html>
    `;
  }

  private generateFeaturesEmail(audience: string): string {
    const features = {
      enterprise: [
        'Predictive Customer Analytics',
        'Advanced Segmentation Engine',
        'Real-time Personalization',
        'Enterprise-grade Security',
        'White-label Solutions',
        'Dedicated Account Manager'
      ],
      startup: [
        'AI-powered Growth Hacking',
        'Automated Customer Insights',
        'Predictive Campaign Optimization',
        'Startup-friendly Pricing',
        'Quick Setup (5 minutes)',
        'Growth Community Access'
      ],
      smb: [
        'Smart Customer Segmentation',
        'Automated Campaign Optimization',
        'Predictive Analytics Dashboard',
        'Easy Integration',
        'Affordable Pricing',
        'Expert Support'
      ],
      newsletter: [
        'AI Marketing Trends',
        'Case Study Breakdowns',
        'Strategy Guides',
        'Tool Recommendations',
        'Industry Insights',
        'Expert Interviews'
      ]
    };

    return `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #10b981;">Unlock Advanced AI Features 🚀</h2>
            <p>Here are the ${audience === 'newsletter' ? 'insights' : 'features'} that will transform your marketing:</p>
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 25px; border-radius: 12px; margin: 20px 0;">
              <h3>🎯 ${audience === 'newsletter' ? 'This Week\'s Insights' : 'Core Features'}</h3>
              <ul style="margin: 15px 0;">
                ${features[audience as keyof typeof features].map(feature => `<li><strong>${feature}</strong></li>`).join('')}
              </ul>
            </div>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>💡 Pro Tip</h3>
              <p>${audience === 'enterprise' ? 
                'Start with predictive analytics - it delivers the highest ROI for large organizations.' :
                audience === 'startup' ?
                'Focus on growth hacking features first - they\'re designed for rapid scaling.' :
                audience === 'newsletter' ?
                'Apply one insight per week - consistency beats perfection in AI marketing.' :
                'Start with customer segmentation - it\'s the foundation of effective AI marketing.'}</p>
            </div>
            <a href="https://app.alya-intelligence.com/features" style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0; font-size: 16px;">
              ${audience === 'newsletter' ? 'Read Full Guide' : 'Explore Features'}
            </a>
            <p>Questions? Just reply - I read every email.</p>
            <p>Best,<br>David from Alya Intelligence</p>
          </div>
        </body>
      </html>
    `;
  }

  private generateTrialOfferEmail(audience: string): string {
    const offers = {
      enterprise: {
        title: 'Exclusive Enterprise Trial',
        duration: '60 days',
        features: ['White-glove setup', 'Custom integrations', 'Dedicated success manager', 'Advanced training'],
        cta: 'Schedule Enterprise Demo'
      },
      startup: {
        title: 'Startup Growth Package',
        duration: '30 days',
        features: ['All features included', 'Startup community access', 'Growth hacking templates', 'Expert mentorship'],
        cta: 'Start Free Trial'
      },
      smb: {
        title: 'Business Growth Trial',
        duration: '30 days',
        features: ['Full platform access', 'Expert setup assistance', 'Priority support', 'Training resources'],
        cta: 'Start Free Trial'
      }
    };

    const offer = offers[audience as keyof typeof offers];

    return `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #f59e0b;">🎉 ${offer.title}</h1>
            <p>Ready to see AI transform your marketing? Here's your exclusive offer:</p>
            <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 25px; border-radius: 12px; text-align: center; margin: 20px 0;">
              <h3>${offer.duration} Free Trial</h3>
              <p><strong>Everything included. No credit card required.</strong></p>
              <ul style="text-align: left; margin: 15px 0;">
                ${offer.features.map(feature => `<li>${feature}</li>`).join('')}
              </ul>
            </div>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>🚀 What happens next?</h3>
              <ol>
                <li>Start your trial in 2 minutes</li>
                <li>Connect your data sources</li>
                <li>Get your first AI insights</li>
                <li>See results within 7 days</li>
              </ol>
            </div>
            <a href="https://app.alya-intelligence.com/trial" style="background: #f59e0b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0; font-size: 18px; font-weight: bold;">
              ${offer.cta}
            </a>
            <p><strong>Questions?</strong> Book a 15-minute call with our team:</p>
            <a href="https://calendly.com/alya-intelligence/trial-setup" style="color: #f59e0b; text-decoration: none; font-weight: bold;">Schedule Setup Call →</a>
            <p>Best,<br>David from Alya Intelligence</p>
          </div>
        </body>
      </html>
    `;
  }

  private generateNewsletterWelcomeEmail(): string {
    return `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #10b981;">Welcome to the Alya Intelligence Newsletter! 🎉</h1>
            <p>Thanks for joining 50,000+ marketers who get cutting-edge AI insights delivered weekly.</p>
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 25px; border-radius: 12px; text-align: center; margin: 20px 0;">
              <h3>What You'll Get Every Tuesday</h3>
              <ul style="text-align: left; margin: 15px 0;">
                <li>🚀 Latest AI marketing trends and breakthroughs</li>
                <li>📊 Data-driven case studies from top brands</li>
                <li>🎯 Actionable strategies you can implement today</li>
                <li>🔧 Tool recommendations and reviews</li>
                <li>💡 Expert interviews and insights</li>
              </ul>
            </div>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>🎁 Your Welcome Gift</h3>
              <p>As a thank you, here's our exclusive <strong>"AI Marketing Starter Kit"</strong> (normally $97, free for subscribers):</p>
              <ul>
                <li>📖 AI Marketing Playbook (50+ pages)</li>
                <li>🎯 Campaign Optimization Checklist</li>
                <li>📊 ROI Calculator Template</li>
                <li>🚀 Tool Stack Recommendations</li>
              </ul>
              <a href="https://alya-intelligence.com/starter-kit" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0;">Download Your Kit</a>
            </div>
            <p><strong>First issue arrives Tuesday!</strong> Here's a preview of what's coming:</p>
            <div style="border-left: 4px solid #10b981; padding-left: 15px; margin: 20px 0;">
              <h4>Next Week: "The Psychology of AI-Driven Personalization"</h4>
              <p>How Netflix, Amazon, and Spotify use behavioral psychology to make AI recommendations irresistible.</p>
            </div>
            <p>Questions? Just reply - I read every email from subscribers.</p>
            <p>Welcome aboard!<br>David from Alya Intelligence</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="font-size: 12px; color: #6b7280;">P.S. Add newsletter@alya-intelligence.com to your contacts so you never miss an issue!</p>
          </div>
        </body>
      </html>
    `;
  }

  private generateTrialWelcomeEmail(): string {
    return `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #10b981;">🎉 Your Trial is Ready!</h1>
            <p>Welcome to Alya Intelligence! Your 14-day trial starts now.</p>
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 25px; border-radius: 12px; text-align: center; margin: 20px 0;">
              <h3>Quick Start Checklist</h3>
              <p>Complete these in your first 3 days for maximum impact:</p>
              <div style="text-align: left; margin: 15px 0;">
                <p>✅ Connect your data sources (5 min)</p>
                <p>✅ Set up your first AI model (10 min)</p>
                <p>✅ Launch your first predictive campaign (15 min)</p>
                <p>✅ Review your personalized dashboard</p>
              </div>
            </div>
            <a href="https://app.alya-intelligence.com/onboarding" style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0; font-size: 16px;">Start Onboarding</a>
            <p><strong>Need help?</strong> Our success team is here for you:</p>
            <ul>
              <li>📧 Email: success@alya-intelligence.com</li>
              <li>💬 Live chat: Available 9 AM - 6 PM EST</li>
              <li>📞 Phone: (555) 123-4567</li>
            </ul>
            <p>Your success manager will reach out within 24 hours to ensure you're set up for success.</p>
            <p>Best,<br>David from Alya Intelligence</p>
          </div>
        </body>
      </html>
    `;
  }

  private generateQuickWinsEmail(): string {
    return `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">Day 3: See Your First AI Predictions in Action 🎯</h2>
            <p>By now you should have your data connected. Here's how to see your first AI insights:</p>
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
              <h3>🚀 Your First 3 Predictions</h3>
              <ol>
                <li><strong>Churn Risk Prediction</strong><br>
                <em>"Which customers are most likely to leave?"</em><br>
                Go to: Dashboard → Customer Health → Churn Risk</li>
                <li><strong>Purchase Timing Prediction</strong><br>
                <em>"When will customers buy next?"</em><br>
                Go to: Campaigns → Predictive Timing → Next Purchase</li>
                <li><strong>Content Preference Prediction</strong><br>
                <em>"What content will engage each customer?"</em><br>
                Go to: Personalization → Content AI → Preferences</li>
              </ol>
            </div>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>💡 Pro Tips for Maximum Impact</h3>
              <ul>
                <li><strong>Start with churn prediction</strong> - it's the easiest to validate</li>
                <li><strong>Test predictions on 10% of customers first</strong></li>
                <li><strong>Track results for 7 days before scaling</strong></li>
                <li><strong>Use our pre-built templates</strong> - they're optimized for quick wins</li>
              </ul>
            </div>
            <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 20px; border-radius: 12px; text-align: center; margin: 20px 0;">
              <h3>🎯 Expected Results (Based on 1,000+ Users)</h3>
              <div style="display: flex; justify-content: space-around; margin: 15px 0;">
                <div>
                  <div style="font-size: 24px; font-weight: bold;">67%</div>
                  <div>Churn Reduction</div>
                </div>
                <div>
                  <div style="font-size: 24px; font-weight: bold;">340%</div>
                  <div>Revenue Increase</div>
                </div>
                <div>
                  <div style="font-size: 24px; font-weight: bold;">450%</div>
                  <div>Efficiency Gain</div>
                </div>
              </div>
            </div>
            <a href="https://app.alya-intelligence.com/predictions" style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0; font-size: 16px;">View Your Predictions</a>
            <p><strong>Need help finding these features?</strong> Reply to this email with "HELP" and I'll send you a personalized walkthrough.</p>
            <p>Best,<br>David from Alya Intelligence</p>
          </div>
        </body>
      </html>
    `;
  }

  private generateSMBCaseStudyEmail(): string {
    return `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">SMB Success Story: 200% Growth in 6 Months</h2>
            <p>See how TechStart Solutions grew from 50 to 150 customers using Alya Intelligence:</p>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>The Challenge</h3>
              <p>TechStart Solutions was a 3-person team struggling to compete with larger competitors. They had great products but couldn't personalize their marketing at scale.</p>
              <h3>The Solution</h3>
              <p>They implemented Alya Intelligence to:</p>
              <ul>
                <li>Automatically segment customers based on behavior</li>
                <li>Predict which leads were most likely to convert</li>
                <li>Personalize campaigns without hiring more staff</li>
              </ul>
              <h3>The Results</h3>
              <div style="background: #10b981; color: white; padding: 15px; border-radius: 6px; margin: 10px 0;">
                <strong>200% customer growth in 6 months</strong>
              </div>
              <ul>
                <li>Lead conversion increased by 340%</li>
                <li>Customer acquisition cost decreased by 60%</li>
                <li>Revenue per customer increased by 180%</li>
                <li>Team productivity improved by 300%</li>
              </ul>
            </div>
            <p><strong>"We couldn't have grown this fast without AI. It's like having a data scientist on our team."</strong></p>
            <p>- Sarah Chen, CEO of TechStart Solutions</p>
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
              <h3>🎯 Your SMB Growth Plan</h3>
              <ol>
                <li><strong>Start with customer segmentation</strong> (Day 1)</li>
                <li><strong>Add predictive lead scoring</strong> (Week 1)</li>
                <li><strong>Launch personalized campaigns</strong> (Week 2)</li>
                <li><strong>Optimize based on results</strong> (Ongoing)</li>
              </ol>
            </div>
            <a href="https://calendly.com/alya-intelligence/smb-strategy" style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0; font-size: 16px;">Get Your SMB Strategy</a>
            <p><strong>Ready to grow like TechStart?</strong> Book a free strategy call with our SMB specialist.</p>
            <p>Best,<br>David from Alya Intelligence</p>
          </div>
        </body>
      </html>
    `;
  }

  getSequences(): EmailSequence[] {
    return this.sequences.filter(seq => seq.isActive);
  }

  getSequenceById(id: string): EmailSequence | undefined {
    return this.sequences.find(seq => seq.id === id && seq.isActive);
  }

  getSequencesByAudience(audience: string): EmailSequence[] {
    return this.sequences.filter(seq => 
      seq.isActive && 
      (seq.targetAudience === audience || seq.targetAudience === 'all')
    );
  }

  async triggerSequence(sequenceId: string, userId: string, email: string): Promise<void> {
    const sequence = this.getSequenceById(sequenceId);
    if (!sequence) {
      throw new Error(`Sequence ${sequenceId} not found`);
    }

    // Simulate email sending (in real implementation, integrate with email service)
    console.log(`Triggering sequence ${sequenceId} for user ${userId} (${email})`);
    
    for (const emailConfig of sequence.emails) {
      console.log(`Scheduling email: ${emailConfig.subject} (delay: ${emailConfig.delayDays} days)`);
    }
  }

  async getSequenceAnalytics(sequenceId: string): Promise<any> {
    // Simulate analytics data
    return {
      sequenceId,
      totalSent: Math.floor(Math.random() * 1000) + 100,
      openRate: Math.random() * 0.3 + 0.15,
      clickRate: Math.random() * 0.1 + 0.02,
      conversionRate: Math.random() * 0.05 + 0.01,
      revenue: Math.floor(Math.random() * 50000) + 10000
    };
  }
}

export const emailSequenceService = new EmailSequenceService();

export function useEmailSequences() {
  const [sequences, setSequences] = useState<EmailSequence[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSequences = async () => {
      try {
        setLoading(true);
        const data = emailSequenceService.getSequences();
        setSequences(data);
      } catch (error) {
        console.error('Failed to load email sequences:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSequences();
  }, []);

  const triggerSequence = async (sequenceId: string, userId: string, email: string) => {
    try {
      await emailSequenceService.triggerSequence(sequenceId, userId, email);
      return { success: true };
    } catch (error) {
      console.error('Failed to trigger sequence:', error);
      return { success: false, error };
    }
  };

  const getSequenceAnalytics = async (sequenceId: string) => {
    try {
      return await emailSequenceService.getSequenceAnalytics(sequenceId);
    } catch (error) {
      console.error('Failed to get sequence analytics:', error);
      return null;
    }
  };

  return {
    sequences,
    loading,
    triggerSequence,
    getSequenceAnalytics
  };
}