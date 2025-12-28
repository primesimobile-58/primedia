import crypto from 'crypto';

export interface EmailMarketingConfig {
  mailchimp?: {
    apiKey: string;
    serverPrefix: string;
    listId: string;
  };
  sendgrid?: {
    apiKey: string;
    listId?: string;
  };
  activeCampaign?: {
    apiKey: string;
    baseUrl: string;
    listId?: string;
  };
}

export interface SubscriberData {
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  phone?: string;
  tags?: string[];
  customFields?: Record<string, any>;
  source?: string;
  leadScore?: number;
  userAgent?: string;
  ipAddress?: string;
}

export interface EmailCampaign {
  subject: string;
  content: string;
  fromEmail: string;
  fromName: string;
  listIds?: string[];
  tags?: string[];
  templateId?: string;
}

export interface EmailSequence {
  name: string;
  emails: {
    subject: string;
    content: string;
    delayDays: number;
    fromEmail: string;
    fromName: string;
  }[];
  triggerTags?: string[];
}

class EmailMarketingService {
  private config: EmailMarketingConfig;

  constructor(config: EmailMarketingConfig) {
    this.config = config;
  }

  // Mailchimp Integration
  async addToMailchimp(subscriber: SubscriberData): Promise<boolean> {
    if (!this.config.mailchimp) return false;

    const { apiKey, serverPrefix, listId } = this.config.mailchimp;
    const dataCenter = serverPrefix || apiKey.split('-')[1];
    
    const subscriberHash = crypto.createHash('md5').update(subscriber.email.toLowerCase()).digest('hex');
    
    const payload = {
      email_address: subscriber.email,
      status: 'subscribed',
      merge_fields: {
        FNAME: subscriber.firstName || '',
        LNAME: subscriber.lastName || '',
        COMPANY: subscriber.company || '',
        PHONE: subscriber.phone || ''
      },
      tags: subscriber.tags || [],
      ip_signup: subscriber.ipAddress || '',
      timestamp_signup: new Date().toISOString()
    };

    // Add custom fields
    if (subscriber.customFields) {
      Object.keys(subscriber.customFields).forEach(key => {
        const upperKey = key.toUpperCase() as keyof typeof payload.merge_fields;
        if (upperKey in payload.merge_fields) {
          payload.merge_fields[upperKey] = subscriber.customFields![key];
        }
      });
    }

    try {
      const response = await fetch(
        `https://${dataCenter}.api.mailchimp.com/3.0/lists/${listId}/members/${subscriberHash}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      );

      if (response.ok) {
        // Add tags if provided
        if (subscriber.tags && subscriber.tags.length > 0) {
          await this.addMailchimpTags(subscriber.email, subscriber.tags);
        }
        return true;
      }
      
      const error = await response.json();
      /* noop */
      return false;
    } catch (error) {
      /* noop */
      return false;
    }
  }

  private async addMailchimpTags(email: string, tags: string[]): Promise<void> {
    if (!this.config.mailchimp) return;

    const { apiKey, serverPrefix, listId } = this.config.mailchimp;
    const dataCenter = serverPrefix || apiKey.split('-')[1];
    
    const subscriberHash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');

    await fetch(
      `https://${dataCenter}.api.mailchimp.com/3.0/lists/${listId}/members/${subscriberHash}/tags`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tags: tags.map(tag => ({ name: tag, status: 'active' }))
        })
      }
    );
  }

  // SendGrid Integration
  async addToSendGrid(subscriber: SubscriberData): Promise<boolean> {
    if (!this.config.sendgrid) return false;

    const { apiKey, listId } = this.config.sendgrid;
    
    const payload = {
      list_ids: listId ? [listId] : undefined,
      contacts: [
        {
          email: subscriber.email,
          first_name: subscriber.firstName,
          last_name: subscriber.lastName,
          custom_fields: {
            company: subscriber.company,
            phone: subscriber.phone,
            source: subscriber.source,
            lead_score: subscriber.leadScore,
            ...subscriber.customFields
          }
        }
      ]
    };

    try {
      const response = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        // Add to custom fields and tags
        if (subscriber.tags && subscriber.tags.length > 0) {
          await this.addSendGridTags(subscriber.email, subscriber.tags);
        }
        return true;
      }
      
      const error = await response.json();
      /* noop */
      return false;
    } catch (error) {
      /* noop */
      return false;
    }
  }

  private async addSendGridTags(email: string, tags: string[]): Promise<void> {
    if (!this.config.sendgrid) return;

    const { apiKey } = this.config.sendgrid;

    // First, get the contact ID
    const searchResponse = await fetch(`https://api.sendgrid.com/v3/marketing/contacts/search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: `email = '${email}'`
      })
    });

    if (searchResponse.ok) {
      const searchData = await searchResponse.json();
      if (searchData.result && searchData.result.length > 0) {
        const contactId = searchData.result[0].id;
        
        // Add tags
        await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contacts: [{
              id: contactId,
              custom_fields: {
                tags: tags.join(',')
              }
            }]
          })
        });
      }
    }
  }

  // ActiveCampaign Integration
  async addToActiveCampaign(subscriber: SubscriberData): Promise<boolean> {
    if (!this.config.activeCampaign) return false;

    const { apiKey, baseUrl, listId } = this.config.activeCampaign;
    
    const payload = {
      contact: {
        email: subscriber.email,
        firstName: subscriber.firstName,
        lastName: subscriber.lastName,
        phone: subscriber.phone,
        fieldValues: [] as Array<{ field: string; value: string }>
      }
    };

    // Add custom fields
    if (subscriber.company) {
      payload.contact.fieldValues.push({
        field: 'company',
        value: subscriber.company
      });
    }

    if (subscriber.source) {
      payload.contact.fieldValues.push({
        field: 'source',
        value: subscriber.source
      });
    }

    if (subscriber.leadScore) {
      payload.contact.fieldValues.push({
        field: 'lead_score',
        value: subscriber.leadScore.toString()
      });
    }

    if (subscriber.customFields) {
      Object.keys(subscriber.customFields).forEach(key => {
        payload.contact.fieldValues.push({
          field: key,
          value: subscriber.customFields![key].toString()
        });
      });
    }

    try {
      const response = await fetch(`${baseUrl}/api/3/contacts`, {
        method: 'POST',
        headers: {
          'Api-Token': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        const contactId = data.contact.id;

        // Add to list if provided
        if (listId) {
          await this.addToActiveCampaignList(contactId, listId);
        }

        // Add tags if provided
        if (subscriber.tags && subscriber.tags.length > 0) {
          await this.addActiveCampaignTags(contactId, subscriber.tags);
        }

        return true;
      }
      
      const error = await response.json();
      /* noop */
      return false;
    } catch (error) {
      /* noop */
      return false;
    }
  }

  private async addToActiveCampaignList(contactId: string, listId: string): Promise<void> {
    if (!this.config.activeCampaign) return;

    const { apiKey, baseUrl } = this.config.activeCampaign;

    await fetch(`${baseUrl}/api/3/contactLists`, {
      method: 'POST',
      headers: {
        'Api-Token': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contactList: {
          list: listId,
          contact: contactId,
          status: 1
        }
      })
    });
  }

  private async addActiveCampaignTags(contactId: string, tags: string[]): Promise<void> {
    if (!this.config.activeCampaign) return;

    const { apiKey, baseUrl } = this.config.activeCampaign;

    // Create tags if they don't exist
    for (const tag of tags) {
      const tagResponse = await fetch(`${baseUrl}/api/3/tags`, {
        method: 'POST',
        headers: {
          'Api-Token': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tag: {
            tag: tag,
            tagType: 'contact',
            description: `Auto-generated tag for ${tag}`
          }
        })
      });

      if (tagResponse.ok) {
        const tagData = await tagResponse.json();
        const tagId = tagData.tag.id;

        // Add tag to contact
        await fetch(`${baseUrl}/api/3/contactTags`, {
          method: 'POST',
          headers: {
            'Api-Token': apiKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contactTag: {
              contact: contactId,
              tag: tagId
            }
          })
        });
      }
    }
  }

  // Unified method to add subscriber to all configured platforms
  async addSubscriber(subscriber: SubscriberData): Promise<{
    mailchimp: boolean;
    sendgrid: boolean;
    activeCampaign: boolean;
  }> {
    const results = {
      mailchimp: false,
      sendgrid: false,
      activeCampaign: false
    };

    // Add to all configured platforms in parallel
    const [mailchimpResult, sendgridResult, activeCampaignResult] = await Promise.allSettled([
      this.addToMailchimp(subscriber),
      this.addToSendGrid(subscriber),
      this.addToActiveCampaign(subscriber)
    ]);

    if (mailchimpResult.status === 'fulfilled') results.mailchimp = mailchimpResult.value;
    if (sendgridResult.status === 'fulfilled') results.sendgrid = sendgridResult.value;
    if (activeCampaignResult.status === 'fulfilled') results.activeCampaign = activeCampaignResult.value;

    return results;
  }

  // Create and send email campaigns
  async createEmailCampaign(campaign: EmailCampaign, platform: 'mailchimp' | 'sendgrid' | 'activeCampaign'): Promise<boolean> {
    switch (platform) {
      case 'mailchimp':
        return this.createMailchimpCampaign(campaign);
      case 'sendgrid':
        return this.createSendGridCampaign(campaign);
      case 'activeCampaign':
        return this.createActiveCampaignCampaign(campaign);
      default:
        return false;
    }
  }

  private async createMailchimpCampaign(campaign: EmailCampaign): Promise<boolean> {
    if (!this.config.mailchimp) return false;

    const { apiKey, serverPrefix } = this.config.mailchimp;
    const dataCenter = serverPrefix || apiKey.split('-')[1];

    const payload = {
      type: 'regular',
      recipients: {
        list_id: campaign.listIds?.[0]
      },
      settings: {
        subject_line: campaign.subject,
        from_name: campaign.fromName,
        reply_to: campaign.fromEmail,
        title: campaign.subject
      },
      content: {
        html: campaign.content
      }
    };

    try {
      const response = await fetch(`https://${dataCenter}.api.mailchimp.com/3.0/campaigns`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      return response.ok;
    } catch (error) {
      /* noop */
      return false;
    }
  }

  private async createSendGridCampaign(campaign: EmailCampaign): Promise<boolean> {
    if (!this.config.sendgrid) return false;

    const { apiKey } = this.config.sendgrid;

    const payload = {
      title: campaign.subject,
      subject: campaign.subject,
      html_content: campaign.content,
      from: {
        email: campaign.fromEmail,
        name: campaign.fromName
      },
      list_ids: campaign.listIds,
      categories: campaign.tags
    };

    try {
      const response = await fetch('https://api.sendgrid.com/v3/marketing/singlesends', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      return response.ok;
    } catch (error) {
      /* noop */
      return false;
    }
  }

  private async createActiveCampaignCampaign(campaign: EmailCampaign): Promise<boolean> {
    if (!this.config.activeCampaign) return false;

    const { apiKey, baseUrl } = this.config.activeCampaign;

    const payload = {
      campaign: {
        type: 'single',
        name: campaign.subject,
        subject: campaign.subject,
        fromemail: campaign.fromEmail,
        fromname: campaign.fromName,
        html: campaign.content,
        list: campaign.listIds?.[0]
      }
    };

    try {
      const response = await fetch(`${baseUrl}/api/3/campaigns`, {
        method: 'POST',
        headers: {
          'Api-Token': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      return response.ok;
    } catch (error) {
      /* noop */
      return false;
    }
  }
}

export default EmailMarketingService;
