import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
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
    if (state.enrichedData.length > 0) {
      setEnriching(false);
      setProgress(100);
      setFilteredData(state.enrichedData);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setEnriching(false);
          generateEnrichedData();
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const generateEnrichedData = () => {
    const seniorities = ['C-Level', 'VP', 'Director', 'Manager', 'Individual Contributor'];
    const sizes = ['1-50', '51-200', '201-1000', '1001-5000', '5000+'];
    const industries = ['Technology', 'Finance', 'Healthcare', 'Retail', 'Manufacturing'];
    const companies = ['Acme Corp', 'TechStart Inc', 'Global Solutions', 'Innovation Labs', 'Enterprise Co'];
    const titles = ['CEO', 'VP Sales', 'Director Marketing', 'Product Manager', 'Sales Rep'];

    const data = state.emails.map((email, index) => ({
      email,
      name: `User ${index + 1}`,
      company: companies[index % companies.length],
      title: titles[index % titles.length],
      seniority: seniorities[index % seniorities.length],
      companySize: sizes[index % sizes.length],
      industry: industries[index % industries.length],
      engagement: Math.floor(Math.random() * 100),
    }));

    setEnrichedData(data);
    setFilteredData(data);
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

  if (enriching) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6">
        <Card className="w-full max-w-2xl p-12 bg-background border border-border shadow-md">
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-h2 font-semibold text-foreground">Enriching Your Data</h2>
              <p className="text-body text-gray-600">
                Please wait while we enrich your contact data with company and engagement information
              </p>
            </div>
            
            <div className="space-y-4">
              <Progress value={progress} className="h-3" />
              <p className="text-center text-body-sm text-gray-600 font-mono">
                {progress}% Complete
              </p>
            </div>
          </div>
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
                    <SelectItem value="C-Level">C-Level</SelectItem>
                    <SelectItem value="VP">VP</SelectItem>
                    <SelectItem value="Director">Director</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Individual Contributor">Individual Contributor</SelectItem>
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
                    <SelectItem value="1-50">1-50</SelectItem>
                    <SelectItem value="51-200">51-200</SelectItem>
                    <SelectItem value="201-1000">201-1000</SelectItem>
                    <SelectItem value="1001-5000">1001-5000</SelectItem>
                    <SelectItem value="5000+">5000+</SelectItem>
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
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Retail">Retail</SelectItem>
                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-foreground">Name</TableHead>
                    <TableHead className="text-foreground">Email</TableHead>
                    <TableHead className="text-foreground">Company</TableHead>
                    <TableHead className="text-foreground">Title</TableHead>
                    <TableHead className="text-foreground">Seniority</TableHead>
                    <TableHead className="text-foreground">Size</TableHead>
                    <TableHead className="text-foreground">Industry</TableHead>
                    <TableHead className="text-foreground">Engagement</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.slice(0, 10).map((row, index) => (
                    <TableRow key={index} className="hover:bg-gray-50">
                      <TableCell className="text-foreground">{row.name}</TableCell>
                      <TableCell className="text-foreground">{row.email}</TableCell>
                      <TableCell className="text-foreground">{row.company}</TableCell>
                      <TableCell className="text-foreground">{row.title}</TableCell>
                      <TableCell className="text-foreground">{row.seniority}</TableCell>
                      <TableCell className="text-foreground">{row.companySize}</TableCell>
                      <TableCell className="text-foreground">{row.industry}</TableCell>
                      <TableCell className="text-foreground font-mono">{row.engagement}%</TableCell>
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
