import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../hooks/use-toast';
import { Upload, Mail, Sparkles } from 'lucide-react';

const DataInputPage: React.FC = () => {
  const navigate = useNavigate();
  const { setEmails } = useAppContext();
  const { toast } = useToast();
  
  const [emailText, setEmailText] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [emailCount, setEmailCount] = useState(0);

  const parseEmails = (text: string): string[] => {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const matches = text.match(emailRegex) || [];
    return [...new Set(matches)];
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setEmailText(text);
    const emails = parseEmails(text);
    setEmailCount(emails.length);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type === 'text/csv') {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setEmailText(text);
        const emails = parseEmails(text);
        setEmailCount(emails.length);
      };
      reader.readAsText(file);
    } else {
      toast({
        title: 'Invalid file',
        description: 'Please upload a CSV file',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setEmailText(text);
        const emails = parseEmails(text);
        setEmailCount(emails.length);
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = () => {
    const emails = parseEmails(emailText);
    if (emails.length === 0) {
      toast({
        title: 'No emails found',
        description: 'Please enter or upload email addresses',
        variant: 'destructive',
      });
      return;
    }

    setEmails(emails);
    toast({
      title: 'Success',
      description: `${emails.length} email(s) loaded`,
      variant: 'default',
    });
    
    setTimeout(() => {
      navigate('/enrichment');
    }, 500);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="space-y-8">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-h1 font-semibold text-foreground">Discover Your ICP</h1>
          </div>
          <p className="text-body-lg text-gray-600 max-w-2xl mx-auto">
            Upload your user data and let AI automatically identify your highest-value customer segments
          </p>
          <p className="text-body-sm text-gray-500">
            Powered by real-time enrichment and AI analysis
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card
            className={`p-8 border-2 transition-all duration-normal ${
              dragActive
                ? 'border-primary bg-secondary/50'
                : 'border-border bg-background hover:shadow-lg'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                  <Upload className="w-8 h-8 text-secondary-foreground" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-h4 font-medium text-foreground">Upload CSV File</h3>
                  <p className="text-body-sm text-gray-600">
                    Drag and drop your CSV file here
                  </p>
                </div>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-background text-foreground border-border hover:bg-gray-100"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    Choose File
                  </Button>
                </label>
              </div>
            </div>
          </Card>

          <Card className="p-8 border border-border bg-background">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                  <Mail className="w-6 h-6 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="text-h4 font-medium text-foreground">Paste Emails</h3>
                  <p className="text-body-sm text-gray-600">
                    Enter email addresses directly
                  </p>
                </div>
              </div>
              
              <Textarea
                value={emailText}
                onChange={handleTextChange}
                placeholder="Paste email addresses here (one per line or comma-separated)"
                className="min-h-[200px] bg-background text-foreground border-input resize-none"
              />
              
              {emailCount > 0 && (
                <div className="flex items-center justify-between p-3 bg-info/10 border border-info/20 rounded-md">
                  <span className="text-body-sm text-info font-medium">
                    {emailCount} unique email{emailCount !== 1 ? 's' : ''} detected
                  </span>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleSubmit}
            disabled={emailCount === 0}
            className="h-12 px-8 bg-gradient-primary text-primary-foreground hover:bg-primary-hover disabled:opacity-50"
          >
            Start Enrichment & Analysis
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataInputPage;
