import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Toaster } from './components/ui/toaster';
import NavigationBar from './components/NavigationBar';
import SetupPage from './pages/SetupPage';
import DataInputPage from './pages/DataInputPage';
import EnrichmentPage from './pages/EnrichmentPage';
import ICPResultsPage from './pages/ICPResultsPage';
import ActionsPage from './pages/ActionsPage';

function App() {
  return (
    <Router>
      <AppProvider>
        <div className="min-h-screen bg-gray-50">
          <NavigationBar />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Navigate to="/setup" replace />} />
              <Route path="/setup" element={<SetupPage />} />
              <Route path="/input" element={<DataInputPage />} />
              <Route path="/enrichment" element={<EnrichmentPage />} />
              <Route path="/icp-results" element={<ICPResultsPage />} />
              <Route path="/actions" element={<ActionsPage />} />
            </Routes>
          </main>
          <Toaster />
        </div>
      </AppProvider>
    </Router>
  );
}

export default App;
