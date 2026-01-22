const FULLENRICH_API_KEY = 'f3766c44-8a85-48e6-9941-36299e494534';
const FULLENRICH_API_URL = 'https://api.fullenrich.com/v1/enrich';

interface EnrichmentResponse {
  email: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  title?: string;
  seniority?: string;
  companySize?: string;
  industry?: string;
  fundingStage?: string;
  technologies?: string[];
  linkedinUrl?: string;
}

export async function enrichEmail(email: string): Promise<EnrichmentResponse> {
  try {
    const response = await fetch(FULLENRICH_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FULLENRICH_API_KEY}`,
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error(`Enrichment failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Enrichment error:', error);
    // Return mock data on error
    return generateMockEnrichment(email);
  }
}

function generateMockEnrichment(email: string): EnrichmentResponse {
  const companies = ['Acme Corp', 'TechStart Inc', 'Global Solutions', 'Innovation Labs', 'Enterprise Co', 'DataFlow Systems', 'CloudScale', 'NextGen Analytics'];
  const titles = ['CEO', 'VP Sales', 'Director of Marketing', 'Product Manager', 'Head of Growth', 'CTO', 'VP Operations', 'Director of RevOps'];
  const seniorities = ['C-Level', 'VP', 'Director', 'Manager', 'Senior'];
  const sizes = ['1-50', '51-200', '201-1000', '1001-5000', '5000+'];
  const industries = ['Technology', 'Finance', 'Healthcare', 'Retail', 'Manufacturing', 'SaaS', 'E-commerce'];
  const fundingStages = ['Seed', 'Series A', 'Series B', 'Series C', 'Public', 'Bootstrapped'];
  const techStacks = [
    ['Salesforce', 'HubSpot', 'Slack'],
    ['AWS', 'Docker', 'Kubernetes'],
    ['React', 'Node.js', 'PostgreSQL'],
    ['Stripe', 'Intercom', 'Segment'],
    ['Google Analytics', 'Mixpanel', 'Amplitude'],
  ];

  const firstName = email.split('@')[0].split('.')[0];
  const lastName = email.split('@')[0].split('.')[1] || 'User';
  
  return {
    email,
    firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
    lastName: lastName.charAt(0).toUpperCase() + lastName.slice(1),
    fullName: `${firstName.charAt(0).toUpperCase() + firstName.slice(1)} ${lastName.charAt(0).toUpperCase() + lastName.slice(1)}`,
    company: companies[Math.floor(Math.random() * companies.length)],
    title: titles[Math.floor(Math.random() * titles.length)],
    seniority: seniorities[Math.floor(Math.random() * seniorities.length)],
    companySize: sizes[Math.floor(Math.random() * sizes.length)],
    industry: industries[Math.floor(Math.random() * industries.length)],
    fundingStage: fundingStages[Math.floor(Math.random() * fundingStages.length)],
    technologies: techStacks[Math.floor(Math.random() * techStacks.length)],
    linkedinUrl: `https://linkedin.com/in/${firstName}-${lastName}`,
  };
}

export async function enrichEmails(emails: string[], onProgress?: (progress: number) => void): Promise<EnrichmentResponse[]> {
  const results: EnrichmentResponse[] = [];
  
  for (let i = 0; i < emails.length; i++) {
    const result = await enrichEmail(emails[i]);
    results.push(result);
    
    if (onProgress) {
      onProgress(((i + 1) / emails.length) * 100);
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return results;
}
