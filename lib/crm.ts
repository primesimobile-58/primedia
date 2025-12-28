export interface CRMLead {
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  phone?: string;
  useCase?: string;
  companySize?: string;
  source?: string;
  leadType: 'demo_request' | 'newsletter' | 'trial_signup';
  utmSource?: string;
  utmCampaign?: string;
  utmMedium?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface CRMConfig {
  salesforce?: {
    enabled: boolean;
    clientId: string;
    clientSecret: string;
    username: string;
    password: string;
    securityToken: string;
    instanceUrl: string;
  };
  hubspot?: {
    enabled: boolean;
    apiKey: string;
    portalId: string;
  };
  pipedrive?: {
    enabled: boolean;
    apiToken: string;
    companyDomain: string;
  };
}

class CRMService {
  private config: CRMConfig;

  constructor(config: CRMConfig) {
    this.config = config;
  }

  async createLead(lead: CRMLead): Promise<{ success: boolean; leadId?: string; error?: string }> {
    const results = await Promise.allSettled([
      this.createSalesforceLead(lead),
      this.createHubSpotContact(lead),
      this.createPipedriveLead(lead),
    ]);

    const successful = results.filter(result => result.status === 'fulfilled');
    const failed = results.filter(result => result.status === 'rejected');

    if (successful.length > 0) {
      return { success: true };
    } else {
      return { 
        success: false, 
        error: `All CRM integrations failed: ${failed.map(f => (f as PromiseRejectedResult).reason).join(', ')}` 
      };
    }
  }

  private async createSalesforceLead(lead: CRMLead): Promise<string> {
    if (!this.config.salesforce?.enabled) {
      throw new Error('Salesforce not enabled');
    }

    const accessToken = await this.getSalesforceAccessToken();
    
    const salesforceLead = {
      FirstName: lead.firstName,
      LastName: lead.lastName,
      Email: lead.email,
      Company: lead.company,
      Phone: lead.phone,
      LeadSource: lead.source || 'Website',
      Description: this.generateLeadDescription(lead),
      Industry: this.inferIndustry(lead.company),
      NumberOfEmployees: this.mapCompanySize(lead.companySize),
    };

    const response = await fetch(`${this.config.salesforce.instanceUrl}/services/data/v58.0/sobjects/Lead`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(salesforceLead),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Salesforce API error: ${error}`);
    }

    const result = await response.json();
    return result.id;
  }

  private async createHubSpotContact(lead: CRMLead): Promise<string> {
    if (!this.config.hubspot?.enabled) {
      throw new Error('HubSpot not enabled');
    }

    const hubspotContact = {
      properties: {
        email: lead.email,
        firstname: lead.firstName,
        lastname: lead.lastName,
        company: lead.company,
        phone: lead.phone,
        website: this.inferWebsite(lead.company),
        jobtitle: lead.useCase ? `Interested in ${lead.useCase}` : 'Unknown',
      },
    };

    const response = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.hubspot.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(hubspotContact),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HubSpot API error: ${error}`);
    }

    const result = await response.json();
    return result.id;
  }

  private async createPipedriveLead(lead: CRMLead): Promise<string> {
    if (!this.config.pipedrive?.enabled) {
      throw new Error('Pipedrive not enabled');
    }

    const pipedriveLead = {
      title: `${lead.firstName} ${lead.lastName} - ${lead.company}`,
      organization_id: null,
      person_id: null,
      value: this.getLeadValue(lead.leadType),
      currency: 'USD',
      user_id: null,
      stage_id: this.getPipedriveStageId(lead.leadType),
      source: lead.source || 'Website',
      note: this.generateLeadDescription(lead),
    };

    const response = await fetch(`https://${this.config.pipedrive.companyDomain}.pipedrive.com/api/v1/leads`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.pipedrive.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pipedriveLead),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Pipedrive API error: ${error}`);
    }

    const result = await response.json();
    return result.data.id.toString();
  }

  private async getSalesforceAccessToken(): Promise<string> {
    const params = new URLSearchParams({
      grant_type: 'password',
      client_id: this.config.salesforce!.clientId,
      client_secret: this.config.salesforce!.clientSecret,
      username: this.config.salesforce!.username,
      password: this.config.salesforce!.password + this.config.salesforce!.securityToken,
    });

    const response = await fetch(`${this.config.salesforce!.instanceUrl}/services/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Salesforce authentication error: ${error}`);
    }

    const result = await response.json();
    return result.access_token;
  }

  private generateLeadDescription(lead: CRMLead): string {
    const parts = [
      `Lead Type: ${lead.leadType}`,
      `Use Case: ${lead.useCase || 'Not specified'}`,
      `Company Size: ${lead.companySize || 'Not specified'}`,
    ];

    if (lead.utmSource) {
      parts.push(`UTM Source: ${lead.utmSource}`);
    }
    if (lead.utmCampaign) {
      parts.push(`UTM Campaign: ${lead.utmCampaign}`);
    }
    if (lead.utmMedium) {
      parts.push(`UTM Medium: ${lead.utmMedium}`);
    }

    return parts.join('\n');
  }

  private inferIndustry(companyName: string): string {
    const industryKeywords = {
      'tech': 'Technology',
      'software': 'Technology',
      'digital': 'Technology',
      'finance': 'Financial Services',
      'bank': 'Financial Services',
      'health': 'Healthcare',
      'medical': 'Healthcare',
      'retail': 'Retail',
      'shop': 'Retail',
      'education': 'Education',
      'school': 'Education',
      'consulting': 'Professional Services',
      'marketing': 'Professional Services',
    };

    const lowerName = companyName.toLowerCase();
    for (const [keyword, industry] of Object.entries(industryKeywords)) {
      if (lowerName.includes(keyword)) {
        return industry;
      }
    }

    return 'Other';
  }

  private mapCompanySize(size?: string): number | null {
    if (!size) return null;

    const sizeMap: Record<string, number> = {
      '1-10': 10,
      '11-50': 50,
      '51-200': 200,
      '201-500': 500,
      '501-1000': 1000,
      '1000+': 5000,
    };

    return sizeMap[size] || null;
  }

  private inferWebsite(companyName: string): string {
    // Simple heuristic - in production, you'd want a more sophisticated approach
    return `https://www.${companyName.toLowerCase().replace(/\s+/g, '')}.com`;
  }

  private getLeadValue(leadType: string): number {
    const valueMap: Record<string, number> = {
      'demo_request': 500,
      'newsletter': 50,
      'trial_signup': 200,
    };

    return valueMap[leadType] || 100;
  }

  private getPipedriveStageId(leadType: string): number {
    // These would be your actual Pipedrive stage IDs
    const stageMap: Record<string, number> = {
      'demo_request': 1,
      'newsletter': 2,
      'trial_signup': 3,
    };

    return stageMap[leadType] || 1;
  }
}

// Create singleton instance with environment configuration
const crmConfig: CRMConfig = {
  salesforce: {
    enabled: process.env.SALESFORCE_ENABLED === 'true',
    clientId: process.env.SALESFORCE_CLIENT_ID || '',
    clientSecret: process.env.SALESFORCE_CLIENT_SECRET || '',
    username: process.env.SALESFORCE_USERNAME || '',
    password: process.env.SALESFORCE_PASSWORD || '',
    securityToken: process.env.SALESFORCE_SECURITY_TOKEN || '',
    instanceUrl: process.env.SALESFORCE_INSTANCE_URL || '',
  },
  hubspot: {
    enabled: process.env.HUBSPOT_ENABLED === 'true',
    apiKey: process.env.HUBSPOT_API_KEY || '',
    portalId: process.env.HUBSPOT_PORTAL_ID || '',
  },
  pipedrive: {
    enabled: process.env.PIPEDRIVE_ENABLED === 'true',
    apiToken: process.env.PIPEDRIVE_API_TOKEN || '',
    companyDomain: process.env.PIPEDRIVE_COMPANY_DOMAIN || '',
  },
};

export const crmService = new CRMService(crmConfig);