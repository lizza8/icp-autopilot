import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useToast } from '../hooks/use-toast';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const SetupPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, setApiKeys } = useAppContext();
  const { toast } = useToast();
  
  const [enrichmentKey, setEnrichmentKey] = useState(state.apiKeys.enrichment);
  const [aiKey, setAiKey] = useState(state.apiKeys.ai);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!enrichmentKey.trim() || !aiKey.trim()) {
      setError('Both API keys are required');
      return;
    }

    setLoading(true);
    
    // Simulate API validation
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setApiKeys({ enrichment: enrichmentKey, ai: aiKey });
    setLoading(false);
    
    toast({
      title: 'Success',
      description: 'API keys saved successfully',
      variant: 'default',
    });
    
    setTimeout(() => {
      navigate('/input');
    }, 500);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6 py-12">
      <Card className="w-full max-w-md p-8 bg-background border border-border shadow-md">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-h2 font-semibold text-foreground">API Configuration</h1>
            <p className="text-body text-gray-600">
              Enter your API keys to get started with ICP Autopilot
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="enrichment-key" className="text-body-sm font-medium text-foreground">
                Enrichment API Key
              </Label>
              <Input
                id="enrichment-key"
                type="password"
                value={enrichmentKey}
                onChange={(e) => setEnrichmentKey(e.target.value)}
                placeholder="Enter enrichment API key"
                className="bg-background text-foreground border-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ai-key" className="text-body-sm font-medium text-foreground">
                AI API Key
              </Label>
              <Input
                id="ai-key"
                type="password"
                value={aiKey}
                onChange={(e) => setAiKey(e.target.value)}
                placeholder="Enter AI API key"
                className="bg-background text-foreground border-input"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-error/10 border border-error/20 rounded-md">
                <AlertCircle className="w-5 h-5 text-error" />
                <p className="text-body-sm text-error">{error}</p>
              </div>
            )}

            {state.apiKeys.enrichment && state.apiKeys.ai && !error && (
              <div className="flex items-center gap-2 p-3 bg-success/10 border border-success/20 rounded-md">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <p className="text-body-sm text-success">API keys are configured</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-primary text-primary-foreground hover:bg-primary-hover"
            >
              {loading ? 'Validating...' : 'Save & Continue'}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default SetupPage;
