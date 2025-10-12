import React, { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '../ui/textarea';
import { Alert, AlertDescription } from '../ui/alert';
import { Progress } from '../ui/progress';
import { Upload, FileText, AlertCircle, CheckCircle, X, Download, Trash2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import apiClient from '../../lib/apiClient';

interface BulkJobUploadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface JobData {
  title: string;
  company: string;
  location: string;
  link?: string;
  published?: string;
  deadline?: string;
  experience?: string;
  type: string;
}

export default function BulkJobUpload({ open, onOpenChange, onSuccess }: BulkJobUploadProps) {
  const { theme } = useTheme();
  const queryClient = useQueryClient();

  const [jsonData, setJsonData] = useState('');
  const [parsedJobs, setParsedJobs] = useState<JobData[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isValidating, setIsValidating] = useState(false);

  // Sample template data
  const sampleTemplate = JSON.stringify([
    {
      title: "Senior React Developer",
      company: "Tech Solutions Rwanda", 
      location: "Kigali, Rwanda",
      link: "https://techsolutions.rw/careers/react-developer",
      published: "08-10-2025",
      deadline: "31-10-2025",
      experience: "Senior (5+ years of experience)",
      type: "Job"
    },
    {
      title: "Marketing Specialist",
      company: "Digital Marketing Agency",
      location: "Kigali, Rwanda", 
      link: "https://digitalagency.rw/careers/marketing-specialist",
      published: "07-10-2025",
      deadline: "25-10-2025",
      experience: "Mid career (3 to 5 years of experience)",
      type: "Job"
    }
  ], null, 2);

  const bulkUploadMutation = useMutation({
    mutationFn: async (jobs: JobData[]) => {
      setUploadProgress(0);
      const batchSize = 5;
      const results = [];
      
      for (let i = 0; i < jobs.length; i += batchSize) {
        const batch = jobs.slice(i, i + batchSize);
        const batchResult = await apiClient.jobs.bulkCreate({ jobs: batch });
        results.push(...batchResult.jobs);
        setUploadProgress(Math.round(((i + batch.length) / jobs.length) * 100));
      }
      
      return results;
    },
    onSuccess: (results) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['admin-recent-jobs'] });
      onSuccess?.();
      
      // Show success message
      alert(`Successfully uploaded ${results.length} jobs!`);
      
      // Reset form
      setJsonData('');
      setParsedJobs([]);
      setUploadProgress(0);
      
      setTimeout(() => onOpenChange(false), 1000);
    },
    onError: (error) => {
      setErrors([`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`]);
    }
  });

  const validateJsonData = useCallback(() => {
    setIsValidating(true);
    setErrors([]);
    setParsedJobs([]);

    try {
      const parsed = JSON.parse(jsonData);
      
      if (!Array.isArray(parsed)) {
        throw new Error('Data must be an array of job objects');
      }

      const validationErrors: string[] = [];
      const validatedJobs: JobData[] = [];

      parsed.forEach((job, index) => {
        const jobErrors: string[] = [];
        
        // Required fields validation
        if (!job.title?.trim()) jobErrors.push(`title is required`);
        if (!job.company?.trim()) jobErrors.push(`company is required`);
        if (!job.location?.trim()) jobErrors.push(`location is required`);
        if (!job.type?.trim()) jobErrors.push(`type is required`);

        // URL validation (optional field)
        if (job.link && !job.link.startsWith('http')) {
          jobErrors.push(`link must be a valid HTTP/HTTPS URL`);
        }

        if (jobErrors.length > 0) {
          validationErrors.push(`Job ${index + 1}: ${jobErrors.join(', ')}`);
        } else {
          validatedJobs.push({
            title: job.title.trim(),
            company: job.company.trim(),
            location: job.location.trim(),
            link: job.link?.trim() || '',
            published: job.published?.trim() || '',
            deadline: job.deadline?.trim() || '',
            experience: job.experience?.trim() || '',
            type: job.type.trim()
          });
        }
      });

      if (validationErrors.length > 0) {
        setErrors(validationErrors);
      } else {
        setParsedJobs(validatedJobs);
      }
    } catch (error) {
      setErrors([`Invalid JSON format: ${error instanceof Error ? error.message : 'Unknown error'}`]);
    } finally {
      setIsValidating(false);
    }
  }, [jsonData]);

  const downloadTemplate = () => {
    const blob = new Blob([sampleTemplate], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'job-template.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleUpload = () => {
    if (parsedJobs.length > 0) {
      bulkUploadMutation.mutate(parsedJobs);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`max-w-6xl max-h-[90vh] overflow-y-auto ${
        theme === 'dark' 
          ? 'bg-gray-900/95 border-gray-700/50 backdrop-blur-xl' 
          : 'bg-white/95 border-gray-200/50 backdrop-blur-xl'
      }`}>
        <DialogHeader>
          <DialogTitle className={`flex items-center space-x-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            <Upload className="w-5 h-5" />
            <span>Bulk Job Upload</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Download */}
          <div className={`p-4 rounded-xl border ${
            theme === 'dark' 
              ? 'bg-blue-900/20 border-blue-800/50' 
              : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`font-medium ${
                  theme === 'dark' ? 'text-blue-300' : 'text-blue-800'
                }`}>
                  Need a template?
                </h3>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-blue-200' : 'text-blue-600'
                }`}>
                  Download our JSON template to get started with the correct format
                </p>
              </div>
              <Button
                onClick={downloadTemplate}
                variant="outline"
                size="sm"
                className={`${
                  theme === 'dark'
                    ? 'border-blue-600 text-blue-300 hover:bg-blue-900/30'
                    : 'border-blue-300 text-blue-600 hover:bg-blue-50'
                } rounded-xl`}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Template
              </Button>
            </div>
          </div>

          {/* JSON Input */}
          <div className="space-y-2">
            <Label className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} font-medium`}>
              Paste JSON Data *
            </Label>
            <Textarea
              value={jsonData}
              onChange={(e) => setJsonData(e.target.value)}
              placeholder="Paste your job data in JSON format here..."
              rows={12}
              className={`rounded-xl border-0 font-mono text-sm ${
                theme === 'dark' 
                  ? 'bg-gray-800/50 text-white placeholder:text-gray-400' 
                  : 'bg-gray-50 text-gray-900 placeholder:text-gray-500'
              }`}
            />
          </div>

          {/* Validation Button */}
          <div className="flex justify-center">
            <Button
              onClick={validateJsonData}
              disabled={!jsonData.trim() || isValidating}
              className={`rounded-xl ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                  : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
              } text-white font-medium`}
            >
              <FileText className="w-4 h-4 mr-2" />
              {isValidating ? 'Validating...' : 'Validate Data'}
            </Button>
          </div>

          {/* Validation Errors */}
          {errors.length > 0 && (
            <Alert className={`${
              theme === 'dark' 
                ? 'bg-red-900/20 border-red-800 text-red-300' 
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-medium">Validation Errors:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Success Validation */}
          {parsedJobs.length > 0 && errors.length === 0 && (
            <Alert className={`${
              theme === 'dark' 
                ? 'bg-green-900/20 border-green-800 text-green-300' 
                : 'bg-green-50 border-green-200 text-green-700'
            }`}>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <p className="font-medium">
                  ✅ Successfully validated {parsedJobs.length} jobs
                </p>
                <p className="text-sm mt-1">
                  Ready to upload to the platform
                </p>
              </AlertDescription>
            </Alert>
          )}

          {/* Upload Progress */}
          {bulkUploadMutation.isPending && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                  Uploading jobs...
                </span>
                <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                  {uploadProgress}%
                </span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {/* Preview */}
          {parsedJobs.length > 0 && !bulkUploadMutation.isPending && (
            <div className="space-y-3">
              <h3 className={`font-medium ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Preview ({parsedJobs.length} jobs)
              </h3>
              <div className={`max-h-64 overflow-y-auto space-y-2 p-3 rounded-xl border ${
                theme === 'dark' 
                  ? 'bg-gray-800/30 border-gray-700' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                {parsedJobs.slice(0, 5).map((job, index) => (
                  <div key={index} className={`p-3 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-700/30' : 'bg-white'
                  }`}>
                    <h4 className={`font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {job.title}
                    </h4>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {job.company} • {job.location} • {job.type}
                    </p>
                  </div>
                ))}
                {parsedJobs.length > 5 && (
                  <p className={`text-sm text-center ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    ...and {parsedJobs.length - 5} more jobs
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setJsonData('');
                setParsedJobs([]);
                setErrors([]);
                onOpenChange(false);
              }}
              disabled={bulkUploadMutation.isPending}
              className={`rounded-xl ${
                theme === 'dark' 
                  ? 'border-white/20 text-gray-300 hover:bg-white/10' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>

            {parsedJobs.length > 0 && (
              <Button
                onClick={() => {
                  setParsedJobs([]);
                  setErrors([]);
                }}
                variant="outline"
                disabled={bulkUploadMutation.isPending}
                className={`rounded-xl ${
                  theme === 'dark' 
                    ? 'border-red-600/50 text-red-400 hover:bg-red-900/20' 
                    : 'border-red-300 text-red-600 hover:bg-red-50'
                }`}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
            )}

            <Button
              onClick={handleUpload}
              disabled={parsedJobs.length === 0 || bulkUploadMutation.isPending}
              className={`rounded-xl ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                  : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
              } text-white font-medium`}
            >
              <Upload className="w-4 h-4 mr-2" />
              {bulkUploadMutation.isPending ? `Uploading...` : `Upload ${parsedJobs.length} Jobs`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
