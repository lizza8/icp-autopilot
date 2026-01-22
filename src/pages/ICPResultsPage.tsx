import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { analyzeICP } from '../services/aiService';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { TrendingUp, AlertCircle, Download, History } from 'lucide-react';

const ICPResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, setICPResults, addAnalysisToHistory } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (state.enrichedData.length === 0) {
      // Don't auto-navigate, just show empty state
      setLoading(false);
      return;
    }

    if (state.icpResults.length > 0) {
      setLoading(false);
      return;
    }

    performAnalysis();
  }, []);

  const performAnalysis = async () => {
    try {
      const analysis = await analyzeICP(state.enrichedData);
      
      const results = analysis.icps.map((icp, index) => ({
        id: `icp-${index + 1}`,
        name: icp.name,
        confidence: icp.confidence,
        tags: icp.tags,
        whyPerforms: icp.whyPerforms,
        whoToDeprioritize: icp.whoToDeprioritize,
        isTop: index === 0,
      }));

      setICPResults(results);
      
      addAnalysisToHistory({
        id: Date.now().toString(),
        timestamp: Date.now(),
        emailCount: state.enrichedData.length,
        topICP: results[0].name,
      });

      setLoading(false);
    } catch (error) {
      console.error('Analysis failed:', error);
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    const content = state.icpResults.map(icp => 
      `${icp.name}\nConfidence: ${icp.confidence}%\nTags: ${icp.tags.join(', ')}\n\nWhy it performs:\n${icp.whyPerforms}\n\nWho to deprioritize:\n${icp.whoToDeprioritize}\n\n---\n\n`
    ).join('');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `icp-analysis-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading && state.enrichedData.length > 0) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6">
        <Card className="w-full max-w-2xl p-12 bg-background border border-border shadow-md">
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-h2 font-semibold text-foreground">Analyzing Your ICP</h2>
              <p className="text-body text-gray-600">
                AI is identifying your highest-performing customer segments
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

  if (state.enrichedData.length === 0) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6">
        <Card className="w-full max-w-2xl p-12 bg-background border border-border shadow-md text-center">
          <h2 className="text-h2 font-semibold text-foreground mb-4">No Enriched Data Available</h2>
          <p className="text-body text-gray-600 mb-6">
            Please enrich your data first before generating ICP insights.
          </p>
          <Button
            onClick={() => navigate('/input')}
            className="h-12 px-8 bg-gradient-primary text-primary-foreground hover:bg-primary-hover"
          >
            Go to Data Input
          </Button>
        </Card>
      </div>
    );
  }

  if (state.icpResults.length === 0) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6">
        <Card className="w-full max-w-2xl p-12 bg-background border border-border shadow-md text-center">
          <h2 className="text-h2 font-semibold text-foreground mb-4">No ICP Results Yet</h2>
          <p className="text-body text-gray-600 mb-6">
            Click below to analyze your enriched data and discover your ICPs.
          </p>
          <Button
            onClick={performAnalysis}
            className="h-12 px-8 bg-gradient-primary text-primary-foreground hover:bg-primary-hover"
          >
            Analyze Now
          </Button>
        </Card>
      </div>
    );
  }

  const previousAnalysis = state.analysisHistory[1];
  const drift = previousAnalysis && state.icpResults[0] 
    ? state.icpResults[0].name !== previousAnalysis.topICP 
    : false;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-h1 font-semibold text-foreground">Your Ideal Customer Profiles</h1>
          <p className="text-body-lg text-gray-600 max-w-3xl mx-auto">
            Based on {state.enrichedData.length} enriched contacts, AI has identified the customer segments most likely to convert and deliver long-term value
          </p>
          
          <div className="flex items-center justify-center gap-4 pt-2">
            <Button
              onClick={exportToPDF}
              variant="outline"
              className="h-10 px-6 bg-background text-foreground border-border hover:bg-gray-100"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Analysis
            </Button>
            
            {state.analysisHistory.length > 0 && (
              <Button
                onClick={() => setShowHistory(!showHistory)}
                variant="outline"
                className="h-10 px-6 bg-background text-foreground border-border hover:bg-gray-100"
              >
                <History className="w-4 h-4 mr-2" />
                History ({state.analysisHistory.length})
              </Button>
            )}
          </div>

          {drift && (
            <Card className="p-4 bg-warning/10 border-warning/20 max-w-2xl mx-auto">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-warning" />
                <div className="text-left">
                  <p className="text-body-sm font-semibold text-warning-foreground">ICP Drift Detected</p>
                  <p className="text-body-sm text-gray-700">
                    Your top ICP has changed from "{previousAnalysis.topICP}" to "{state.icpResults[0].name}"
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {showHistory && state.analysisHistory.length > 0 && (
          <Card className="p-6 bg-background border border-border">
            <h3 className="text-h4 font-semibold text-foreground mb-4">Analysis History</h3>
            <div className="space-y-3">
              {state.analysisHistory.map((analysis) => (
                <div key={analysis.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div>
                    <p className="text-body-sm font-medium text-foreground">{analysis.topICP}</p>
                    <p className="text-body-sm text-gray-600">
                      {analysis.emailCount} contacts analyzed
                    </p>
                  </div>
                  <p className="text-body-sm text-gray-600">
                    {new Date(analysis.timestamp).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {state.icpResults.map((icp, index) => (
            <Card
              key={icp.id}
              className={`p-8 bg-background border transition-all duration-normal hover:shadow-xl hover:-translate-y-1 ${
                icp.isTop ? 'border-primary border-2 shadow-lg' : 'border-border'
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
