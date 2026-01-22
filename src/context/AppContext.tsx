import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AppState {
  emails: string[];
  enrichedData: EnrichedUser[];
  icpResults: ICPResult[];
  activatedActions: Record<string, boolean>;
  analysisHistory: AnalysisHistory[];
}

interface EnrichedUser {
  email: string;
  name: string;
  company: string;
  title: string;
  seniority: string;
  companySize: string;
  industry: string;
  fundingStage: string;
  techStack: string[];
  linkedinUrl: string;
  engagement: number;
}

interface ICPResult {
  id: string;
  name: string;
  confidence: number;
  tags: string[];
  whyPerforms: string;
  whoToDeprioritize: string;
  isTop?: boolean;
}

interface AnalysisHistory {
  id: string;
  timestamp: number;
  emailCount: number;
  topICP: string;
}

interface AppContextType {
  state: AppState;
  setEmails: (emails: string[]) => void;
  setEnrichedData: (data: EnrichedUser[]) => void;
  setICPResults: (results: ICPResult[]) => void;
  toggleAction: (actionId: string) => void;
  activateAllActions: () => void;
  addAnalysisToHistory: (analysis: AnalysisHistory) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'icp-autopilot-state';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return {
          emails: [],
          enrichedData: [],
          icpResults: [],
          activatedActions: {},
          analysisHistory: [],
        };
      }
    }
    return {
      emails: [],
      enrichedData: [],
      icpResults: [],
      activatedActions: {},
      analysisHistory: [],
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const setEmails = (emails: string[]) => {
    setState((prev) => ({ ...prev, emails }));
  };

  const setEnrichedData = (data: EnrichedUser[]) => {
    setState((prev) => ({ ...prev, enrichedData: data }));
  };

  const setICPResults = (results: ICPResult[]) => {
    setState((prev) => ({ ...prev, icpResults: results }));
  };

  const toggleAction = (actionId: string) => {
    setState((prev) => ({
      ...prev,
      activatedActions: {
        ...prev.activatedActions,
        [actionId]: !prev.activatedActions[actionId],
      },
    }));
  };

  const activateAllActions = () => {
    const allActions = [
      'sales-1', 'sales-2', 'sales-3',
      'marketing-1', 'marketing-2', 'marketing-3',
      'product-1', 'product-2', 'product-3',
      'revops-1', 'revops-2', 'revops-3',
    ];
    const activated = allActions.reduce((acc, id) => ({ ...acc, [id]: true }), {});
    setState((prev) => ({ ...prev, activatedActions: activated }));
  };

  const addAnalysisToHistory = (analysis: AnalysisHistory) => {
    setState((prev) => ({
      ...prev,
      analysisHistory: [analysis, ...prev.analysisHistory].slice(0, 10),
    }));
  };

  return (
    <AppContext.Provider
      value={{
        state,
        setEmails,
        setEnrichedData,
        setICPResults,
        toggleAction,
        activateAllActions,
        addAnalysisToHistory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export type { EnrichedUser, ICPResult, AnalysisHistory };
