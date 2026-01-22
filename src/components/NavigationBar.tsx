import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';

const steps = [
  { path: '/setup', label: 'Setup', step: 1 },
  { path: '/input', label: 'Data Input', step: 2 },
  { path: '/enrichment', label: 'Enrichment', step: 3 },
  { path: '/icp-results', label: 'ICP Results', step: 4 },
  { path: '/actions', label: 'Actions', step: 5 },
];

const NavigationBar: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentStep = steps.find((s) => s.path === location.pathname);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/setup" className="text-h3 font-semibold text-foreground">
            ICP Autopilot
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            {steps.map((step) => {
              const isActive = location.pathname === step.path;
              return (
                <Link
                  key={step.path}
                  to={step.path}
                  className={`text-body-sm font-normal transition-colors duration-fast relative pb-1 ${
                    isActive
                      ? 'text-primary'
                      : 'text-gray-600 hover:text-primary-hover'
                  }`}
                >
                  {step.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="hidden md:block">
          {currentStep && (
            <span className="text-body-sm text-gray-600">
              Step {currentStep.step} of {steps.length}
            </span>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden bg-transparent text-foreground hover:bg-gray-100"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="px-6 py-4 space-y-2">
            {steps.map((step) => {
              const isActive = location.pathname === step.path;
              return (
                <Link
                  key={step.path}
                  to={step.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-3 px-4 rounded-md text-body transition-colors duration-fast ${
                    isActive
                      ? 'bg-secondary text-secondary-foreground'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {step.step}. {step.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

export default NavigationBar;
