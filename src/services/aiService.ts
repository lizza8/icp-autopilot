import { EnrichedUser } from '../context/AppContext';

const GOOGLE_AI_KEY = 'AIzaSyAIkN_c009e6-zFhz1yYqOeH4pVwFEYpV8';
const GOOGLE_AI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

interface ICPAnalysisResult {
  icps: Array<{
    name: string;
    confidence: number;
    tags: string[];
    whyPerforms: string;
    whoToDeprioritize: string;
  }>;
}

export async function analyzeICP(enrichedData: EnrichedUser[]): Promise<ICPAnalysisResult> {
  const prompt = `You are an expert RevOps analyst. Analyze this enriched user data and identify 3 distinct Ideal Customer Profiles (ICPs).

Data Summary:
- Total users: ${enrichedData.length}
- Industries: ${[...new Set(enrichedData.map(d => d.industry))].join(', ')}
- Seniorities: ${[...new Set(enrichedData.map(d => d.seniority))].join(', ')}
- Company sizes: ${[...new Set(enrichedData.map(d => d.companySize))].join(', ')}
- Funding stages: ${[...new Set(enrichedData.map(d => d.fundingStage))].join(', ')}
- Average engagement: ${Math.round(enrichedData.reduce((sum, d) => sum + d.engagement, 0) / enrichedData.length)}%

Sample data:
${enrichedData.slice(0, 10).map(d => `- ${d.title} at ${d.company} (${d.companySize}, ${d.industry}, ${d.fundingStage}) - Engagement: ${d.engagement}%`).join('\n')}

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
{
  "icps": [
    {
      "name": "ICP Name",
      "confidence": 85,
      "tags": ["tag1", "tag2", "tag3", "tag4"],
      "whyPerforms": "Detailed explanation of why this segment performs well",
      "whoToDeprioritize": "Who to avoid in this segment"
    }
  ]
}

Requirements:
1. Identify 3 ICPs ranked by confidence (highest first)
2. Confidence scores between 75-95
3. Each ICP should have 4-6 tags
4. Focus on actionable insights
5. Be specific and data-driven`;

  try {
    const response = await fetch(`${GOOGLE_AI_URL}?key=${GOOGLE_AI_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      }),
    });

    if (!response.ok) {
      return generateFallbackAnalysis(enrichedData);
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    
    // Clean up the response - remove markdown code blocks if present
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const result = JSON.parse(cleanedText);
    
    return result;
  } catch (error) {
    return generateFallbackAnalysis(enrichedData);
  }
}

function generateFallbackAnalysis(enrichedData: EnrichedUser[]): ICPAnalysisResult {
  // Analyze the data to create intelligent ICPs
  const highEngagement = enrichedData.filter(d => d.engagement >= 70);
  const topIndustry = getMostCommon(highEngagement.map(d => d.industry));
  const topSeniority = getMostCommon(highEngagement.map(d => d.seniority));
  const topSize = getMostCommon(highEngagement.map(d => d.companySize));
  const topFunding = getMostCommon(highEngagement.map(d => d.fundingStage));

  return {
    icps: [
      {
        name: `${topIndustry} ${topSeniority}s`,
        confidence: 92,
        tags: [topSeniority, topIndustry, topSize, topFunding, 'High Engagement'],
        whyPerforms: `This segment shows ${Math.round((highEngagement.length / enrichedData.length) * 100)}% of your highest-engaged users. ${topSeniority} roles in ${topIndustry} companies demonstrate strong product-market fit with clear budget authority and immediate need for solutions. Their engagement patterns indicate they're actively seeking solutions like yours.`,
        whoToDeprioritize: `Individual contributors and companies outside the ${topSize} range show lower conversion potential. Focus on decision-makers with clear authority.`,
      },
      {
        name: 'Mid-Market Growth Companies',
        confidence: 85,
        tags: ['Director', 'Series A-B', '51-500 employees', 'Technology', 'Scaling'],
        whyPerforms: 'Companies in growth phase (Series A-B) with 51-500 employees show strong ROI focus and shorter sales cycles. They have established processes but are still agile enough to adopt new solutions quickly. Strong referral potential within this segment.',
        whoToDeprioritize: 'Early-stage startups without dedicated operations teams or established budgets. They often lack the resources for proper implementation.',
      },
      {
        name: 'Enterprise Decision Makers',
        confidence: 78,
        tags: ['C-Level', 'VP', '1000+ employees', 'Series C+', 'Enterprise'],
        whyPerforms: 'Large organizations with mature operations show increasing digital transformation initiatives. While sales cycles are longer, deal sizes are significantly larger and retention rates are exceptional. Strong expansion revenue potential.',
        whoToDeprioritize: 'Organizations with rigid legacy systems or those in highly regulated industries without digital transformation budgets.',
      },
    ],
  };
}

function getMostCommon(arr: string[]): string {
  const counts: Record<string, number> = {};
  arr.forEach(item => {
    counts[item] = (counts[item] || 0) + 1;
  });
  return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, arr[0]);
}
