import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Target, TrendingUp, AlertCircle } from 'lucide-react';

const ICPResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, setICPResults } = useAppContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (state.icpResults.length > 0) {
      setLoading(false);
      return;
    }

    setTimeout(() => {
      const results = [
        {
          id: 'icp-1',
          name: 'Enterprise Tech Leaders',
          confidence: 92,
          tags: ['C-Level', 'Technology', '1000+ employees', 'High Engagement'],
          whyPerforms: 'This segment shows 3x higher conversion rates with strong engagement metrics. Decision-makers in large tech companies have clear budget authority and immediate need for solutions.',
          whoToDeprioritize: 'Individual contributors and companies under 500 employees show lower conversion potential in this segment.',
          isTop: true,
        },
        {
          id: 'icp-2',
          name: 'Mid-Market Finance Directors',
          confidence: 85,
          tags: ['Director', 'Finance', '200-1000 employees', 'Medium Engagement'],
          whyPerforms: 'Strong ROI focus and clear pain points. This segment has shorter sales cycles and predictable buying patterns with consistent quarterly budgets.',
          whoToDeprioritize: 'Companies in early-stage growth or those with limited financial planning resources.',
        },
        {
          id: 'icp-3',
          name: 'Healthcare VPs',
          confidence: 78,
          tags: ['VP', 'Healthcare', '500+ employees', 'Growing Engagement'],
          whyPerforms: 'Increasing digital transformation initiatives and regulatory compliance needs drive demand. Strong referral potential within the industry.',
          whoToDeprioritize: 'Small clinics and practices without dedicated IT or operations leadership.',
        },
      ];
      
      setICPResults(results);
      setLoading(false);
    }, 2000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6">
        <Card className="w-full max-w-2xl p-12 bg-background border border-border shadow-md">
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-h2 font-semibold text-foreground">Analyzing Your ICP</h2>
              <p className="text-body text-gray-600">
                Our AI is identifying your highest-performing customer segments
              </p>
            </div>
            
            <div className="flex justify-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-h1 font-semibold text-foreground">Your Ideal Customer Profiles</h1>
          <p className="text-body-lg text-gray-600 max-w-3xl mx-auto">
            Based on your enriched data, we've identified the customer segments most likely to convert and deliver long-term value
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {state.icpResults.map((icp, index) => (
            <Card
              key={icp.id}
              className={`p-8 bg-background border transition-all duration-normal hover:shadow-lg hover:-translate-y-1 ${
                icp.isTop ? 'border-primary border-2' : 'border-border'
              }`}
            >
              <div className="space-y-6">
                {icp.isTop && (
                  <Badge className="bg-gradient-primary text-primary-foreground">
                    Top ICP
                  </Badge>
                )}
                
                <div className="space-y-2">
                  <h3 className="text-h3 font-semibold text-foreground">{icp.name}</h3>
                </div>

                <div className="flex items-center justify-center">
                  <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="hsl(210, 20%, 95%)"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="url(#gradient)"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - icp.confidence / 100)}`}
                        strokeLinecap="round"
                        className="transition-all duration-slow"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="hsl(250, 80%, 60%)" />
                          <stop offset="100%" stopColor="hsl(260, 75%, 65%)" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-h2 font-semibold text-foreground font-mono">
                        {icp.confidence}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {icp.tags.map((tag, tagIndex) => (
                    <Badge
                      key={tagIndex}
                      variant="secondary"
                      className="bg-secondary text-secondary-foreground"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-success" />
                      <h4 className="text-body-sm font-semibold text-foreground uppercase tracking-wide">
                        Why It Performs Best
                      </h4>
                    </div>
                    <p className="text-body-sm text-gray-600 leading-relaxed">
                      {icp.whyPerforms}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-warning" />
                      <h4 className="text-body-sm font-semibold text-foreground uppercase tracking-wide">
                        Who to Deprioritize
                      </h4>
                    </div>
                    <p className="text-body-sm text-gray-600 leading-relaxed">
                      {icp.whoToDeprioritize}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            onClick={() => navigate('/actions')}
            className="h-12 px-8 bg-gradient-primary text-primary-foreground hover:bg-primary-hover"
          >
            Activate These ICPs
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ICPResultsPage;
