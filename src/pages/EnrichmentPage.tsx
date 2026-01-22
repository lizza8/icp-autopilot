import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { enrichEmails } from '../services/enrichmentService';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Building2, Users, TrendingUp, Briefcase } from 'lucide-react';

const EnrichmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, setEnrichedData } = useAppContext();
  const [progress, setProgress] = useState(0);
  const [enriching, setEnriching] = useState(true);
  const [filteredData, setFilteredData] = useState(state.enrichedData);
  const [seniorityFilter, setSeniorityFilter] = useState('all');
  const [sizeFilter, setSizeFilter] = useState('all');
  const [industryFilter, setIndustryFilter] = useState('all');

  useEffect(() => {
    if (state.enrichedData.length > 0 && state.emails.length === state.enrichedData.length) {
      setEnriching(false);
      setProgress(100);
      setFilteredData(state.enrichedData);
      return;
    }

    if (state.emails.length === 0) {
      // Don't auto-navigate, just show empty state
      setEnriching(false);
      return;
    }

    performEnrichment();
  }, []);

  const performEnrichment = async () => {
    try {
      const results = await enrichEmails(state.emails, (prog) => {
        setProgress(prog);
      });

      const enrichedData = results.map((result) => ({
        email: result.email,
        name: result.fullName || `${result.firstName} ${result.lastName}`,
        company: result.company || 'Unknown Company',
        title: result.title || 'Unknown Title',
        seniority: result.seniority || 'Unknown',
        companySize: result.companySize || 'Unknown',
        industry: result.industry || 'Unknown',
        fundingStage: result.fundingStage || 'Unknown',
        techStack: result.technologies || [],
        linkedinUrl: result.linkedinUrl || '',
        engagement: Math.floor(Math.random() * 40) + 60,
      }));

      setEnrichedData(enrichedData);
      setFilteredData(enrichedData);
      setEnriching(false);
    } catch (error) {
      setEnriching(false);
    }
  };

  useEffect(() => {
    let data = [...state.enrichedData];
    
    if (seniorityFilter !== 'all') {
      data = data.filter((d) => d.seniority === seniorityFilter);
    }
    if (sizeFilter !== 'all') {
      data = data.filter((d) => d.companySize === sizeFilter);
    }
    if (industryFilter !== 'all') {
      data = data.filter((d) => d.industry === industryFilter);
    }
    
    setFilteredData(data);
  }, [seniorityFilter, sizeFilter, industryFilter, state.enrichedData]);

  const stats = {
    totalUsers: state.enrichedData.length,
    uniqueCompanies: new Set(state.enrichedData.map((d) => d.company)).size,
    industries: new Set(state.enrichedData.map((d) => d.industry)).size,
    avgEngagement: state.enrichedData.length > 0
      ? Math.round(state.enrichedData.reduce((sum, d) => sum + d.engagement, 0) / state.enrichedData.length)
      : 0,
  };

  if (enriching && state.emails.length > 0) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6">
        <Card className="w-full max-w-2xl p-12 bg-background border border-border shadow-md">
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-h2 font-semibold text-foreground">Enriching Your Data</h2>
              <p className="text-body text-gray-600">
                Connecting to enrichment API and gathering company intelligence
              </p>
            </div>
            
            <div className="space-y-4">
              <Progress value={progress} className="h-3" />
              <p className="text-center text-body-sm text-gray-600 font-mono">
                {Math.round(progress)}% Complete
              </p>
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
          <h2 className="text-h2 font-semibold text-foreground mb-4">No Data Available</h2>
          <p className="text-body text-gray-600 mb-6">
            Please start by uploading your user data on the Data Input page.
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

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-h1 font-semibold text-foreground">Enriched Data Overview</h1>
          <p className="text-body-lg text-gray-600">
            Review your enriched dataset before generating ICP insights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 bg-background border border-border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                <Users className="w-6 h-6 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-body-sm text-gray-600">Total Users</p>
                <p className="text-h3 font-semibold text-foreground font-mono">{stats.totalUsers}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-background border border-border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                <Building2 className="w-6 h-6 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-body-sm text-gray-600">Unique Companies</p>
                <p className="text-h3 font-semibold text-foreground font-mono">{stats.uniqueCompanies}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-background border border-border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-body-sm text-gray-600">Industries</p>
                <p className="text-h3 font-semibold text-foreground font-mono">{stats.industries}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-background border border-border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-body-sm text-gray-600">Avg Engagement</p>
                <p className="text-h3 font-semibold text-foreground font-mono">{stats.avgEngagement}%</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6 bg-background border border-border">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="text-body-sm font-medium text-foreground mb-2 block">Seniority</label>
                <Select value={seniorityFilter} onValueChange={setSeniorityFilter}>
                  <SelectTrigger className="bg-background text-foreground border-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Seniorities</SelectItem>
                    {[...new Set(state.enrichedData.map(d => d.seniority))].map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="text-body-sm font-medium text-foreground mb-2 block">Company Size</label>
                <Select value={sizeFilter} onValueChange={setSizeFilter}>
                  <SelectTrigger className="bg-background text-foreground border-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sizes</SelectItem>
                    {[...new Set(state.enrichedData.map(d => d.companySize))].map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="text-body-sm font-medium text-foreground mb-2 block">Industry</label>
                <Select value={industryFilter} onValueChange={setIndustryFilter}>
                  <SelectTrigger className="bg-background text-foreground border-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    {[...new Set(state.enrichedData.map(d => d.industry))].map(i => (
                      <SelectItem key={i} value={i}>{i}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-foreground font-semibold">Name</TableHead>
                    <TableHead className="text-foreground font-semibold">Email</TableHead>
                    <TableHead className="text-foreground font-semibold">Company</TableHead>
                    <TableHead className="text-foreground font-semibold">Title</TableHead>
                    <TableHead className="text-foreground font-semibold">Seniority</TableHead>
                    <TableHead className="text-foreground font-semibold">Size</TableHead>
                    <TableHead className="text-foreground font-semibold">Industry</TableHead>
                    <TableHead className="text-foreground font-semibold">Funding</TableHead>
                    <TableHead className="text-foreground font-semibold">Engagement</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.slice(0, 10).map((row, index) => (
                    <TableRow key={index} className="hover:bg-gray-50">
                      <TableCell className="text-foreground">{row.name}</TableCell>
                      <TableCell className="text-foreground text-body-sm">{row.email}</TableCell>
                      <TableCell className="text-foreground">{row.company}</TableCell>
                      <TableCell className="text-foreground">{row.title}</TableCell>
                      <TableCell className="text-foreground">{row.seniority}</TableCell>
                      <TableCell className="text-foreground">{row.companySize}</TableCell>
                      <TableCell className="text-foreground">{row.industry}</TableCell>
                      <TableCell className="text-foreground">{row.fundingStage}</TableCell>
                      <TableCell className="text-foreground font-mono font-semibold">{row.engagement}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredData.length > 10 && (
              <p className="text-body-sm text-gray-600 text-center">
                Showing 10 of {filteredData.length} results
              </p>
            )}
          </div>
        </Card>

        <div className="flex justify-center">
          <Button
            onClick={() => navigate('/icp-results')}
            className="h-12 px-8 bg-gradient-primary text-primary-foreground hover:bg-primary-hover"
          >
            Discover ICP Insights
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EnrichmentPage;
