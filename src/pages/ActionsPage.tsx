import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { useToast } from '../hooks/use-toast';
import { ChevronDown, ChevronUp, Target, Megaphone, Package, BarChart3 } from 'lucide-react';

interface Action {
  id: string;
  title: string;
  description: string;
}

interface ActionSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  actions: Action[];
}

const ActionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, toggleAction, activateAllActions } = useAppContext();
  const { toast } = useToast();
  const [expandedSections, setExpandedSections] = React.useState<string[]>(['sales']);

  const sections: ActionSection[] = [
    {
      id: 'sales',
      title: 'Sales',
      icon: <Target className="w-6 h-6" />,
      actions: [
        {
          id: 'sales-1',
          title: 'Update lead scoring model',
          description: 'Prioritize Enterprise Tech Leaders with 2x weight in your CRM scoring algorithm',
        },
        {
          id: 'sales-2',
          title: 'Create targeted outreach sequences',
          description: 'Build personalized email sequences for each ICP segment with relevant case studies',
        },
        {
          id: 'sales-3',
          title: 'Train sales team on ICP insights',
          description: 'Schedule training sessions to align team on new ICP priorities and objection handling',
        },
      ],
    },
    {
      id: 'marketing',
      title: 'Marketing',
      icon: <Megaphone className="w-6 h-6" />,
      actions: [
        {
          id: 'marketing-1',
          title: 'Launch ICP-specific ad campaigns',
          description: 'Create LinkedIn and Google Ads targeting Enterprise Tech Leaders and Finance Directors',
        },
        {
          id: 'marketing-2',
          title: 'Develop segment-specific content',
          description: 'Produce whitepapers and case studies tailored to each ICP\'s pain points',
        },
        {
          id: 'marketing-3',
          title: 'Optimize website messaging',
          description: 'Update homepage and landing pages to speak directly to top ICP segments',
        },
      ],
    },
    {
      id: 'product',
      title: 'Product',
      icon: <Package className="w-6 h-6" />,
      actions: [
        {
          id: 'product-1',
          title: 'Prioritize enterprise features',
          description: 'Fast-track features most requested by Enterprise Tech Leaders segment',
        },
        {
          id: 'product-2',
          title: 'Create ICP-specific onboarding',
          description: 'Build customized onboarding flows for each high-value segment',
        },
        {
          id: 'product-3',
          title: 'Develop segment analytics',
          description: 'Add tracking to measure engagement and success metrics by ICP',
        },
      ],
    },
    {
      id: 'revops',
      title: 'RevOps',
      icon: <BarChart3 className="w-6 h-6" />,
      actions: [
        {
          id: 'revops-1',
          title: 'Update CRM segmentation',
          description: 'Tag all contacts with their ICP classification for better reporting',
        },
        {
          id: 'revops-2',
          title: 'Create ICP dashboards',
          description: 'Build executive dashboards showing performance metrics by ICP segment',
        },
        {
          id: 'revops-3',
          title: 'Implement ICP-based routing',
          description: 'Route high-value ICP leads to senior sales reps automatically',
        },
      ],
    },
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleActivateAll = () => {
    activateAllActions();
    toast({
      title: 'Success',
      description: 'All actions have been activated',
      variant: 'default',
    });
  };

  const activeCount = Object.values(state.activatedActions).filter(Boolean).length;
  const totalCount = sections.reduce((sum, section) => sum + section.actions.length, 0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="space-y-12">
        <div className="text-center space-y-4 animate-fade-in-up">
          <h1 className="text-h1 font-semibold text-foreground">Activate Your ICP Strategy</h1>
          <p className="text-body-lg text-gray-600 max-w-3xl mx-auto">
            Turn insights into action with these recommended next steps across your go-to-market teams
          </p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-body font-mono text-foreground">
              {activeCount} of {totalCount} actions activated
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {sections.map((section, sectionIndex) => {
            const isExpanded = expandedSections.includes(section.id);
            const sectionActiveCount = section.actions.filter(
              (action) => state.activatedActions[action.id]
            ).length;

            return (
              <Card 
                key={section.id} 
                className="bg-background border border-border overflow-hidden animate-fade-in-up hover:shadow-lg transition-all duration-normal"
                style={{ animationDelay: `${sectionIndex * 0.1}s` }}
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors duration-fast"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground">
                      {section.icon}
                    </div>
                    <div className="text-left">
                      <h3 className="text-h3 font-semibold text-foreground">{section.title}</h3>
                      <p className="text-body-sm text-gray-600">
                        {sectionActiveCount} of {section.actions.length} activated
                      </p>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-6 h-6 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-600" />
                  )}
                </button>

                {isExpanded && (
                  <div className="border-t border-border">
                    <div className="p-6 space-y-4">
                      {section.actions.map((action) => (
                        <div
                          key={action.id}
                          className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-fast"
                        >
                          <Switch
                            checked={state.activatedActions[action.id] || false}
                            onCheckedChange={() => toggleAction(action.id)}
                            className="mt-1"
                          />
                          <div className="flex-1 space-y-1">
                            <h4 className="text-body font-medium text-foreground">
                              {action.title}
                            </h4>
                            <p className="text-body-sm text-gray-600">
                              {action.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up">
          <Button
            onClick={handleActivateAll}
            className="h-12 px-8 bg-gradient-primary text-primary-foreground hover:bg-primary-hover hover:scale-105 transition-all duration-normal hover:shadow-xl"
          >
            Activate All Actions
          </Button>
          <Button
            onClick={() => navigate('/icp-results')}
            variant="outline"
            className="h-12 px-8 bg-background text-foreground border-border hover:bg-gray-100 hover:scale-105 transition-all duration-normal"
          >
            Back to ICP Results
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ActionsPage;
