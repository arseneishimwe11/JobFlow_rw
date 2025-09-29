import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2, Save, X, AlertCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import apiClient from '../../lib/apiClient';
import type { Job } from '../../lib/apiClient';

interface AdminJobFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job?: Job | null;
  onSuccess?: () => void;
}

interface JobFormData {
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string;
  salary_range?: string;
  job_type: string;
  category: string;
  deadline?: string;
  source: string;
  url: string;
}

export default function AdminJobForm({ open, onOpenChange, job, onSuccess }: AdminJobFormProps) {
  const { theme } = useTheme();
  const queryClient = useQueryClient();
  const isEditing = !!job;

  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    company: '',
    location: '',
    description: '',
    requirements: '',
    salary_range: '',
    job_type: '',
    category: '',
    deadline: '',
    source: 'Manual',
    url: '',
  });

  const [errors, setErrors] = useState<Partial<JobFormData>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Populate form when editing
  React.useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || '',
        company: job.company || '',
        location: job.location || '',
        description: job.description || '',
        requirements: job.requirements || '',
        salary_range: job.salaryRange || '',
        job_type: job.jobType || '',
        category: job.category || '',
        deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : '',
        source: job.source || 'Manual',
        url: job.url || '',
      });
    } else {
      setFormData({
        title: '',
        company: '',
        location: '',
        description: '',
        requirements: '',
        salary_range: '',
        job_type: '',
        category: '',
        deadline: '',
        source: 'Manual',
        url: '',
      });
    }
  }, [job]);

  const createJobMutation = useMutation({
    mutationFn: (jobData: JobFormData) => 
      isEditing ? apiClient.jobs.update(job.id, jobData) : apiClient.jobs.create(jobData),
    onSuccess: () => {
      setSuccessMessage(isEditing ? 'Job updated successfully!' : 'Job posted successfully!');
      setErrorMessage('');
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['featured-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['admin-recent-jobs'] });
      onSuccess?.();
      setTimeout(() => {
        onOpenChange(false);
        resetForm();
        setSuccessMessage('');
      }, 2000);
    },
    onError: (error) => {
      setErrorMessage(error instanceof Error ? error.message : `Failed to ${isEditing ? 'update' : 'post'} job`);
      setSuccessMessage('');
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      company: '',
      location: '',
      description: '',
      requirements: '',
      salary_range: '',
      job_type: '',
      category: '',
      deadline: '',
      source: 'Manual',
      url: '',
    });
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<JobFormData> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.company.trim()) newErrors.company = 'Company is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.job_type) newErrors.job_type = 'Job type is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.url.trim()) newErrors.url = 'URL is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      createJobMutation.mutate(formData);
    }
  };

  const handleInputChange = (field: keyof JobFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const categories = [
    'Technology', 'Finance', 'Healthcare', 'Education', 'Marketing',
    'Sales', 'Engineering', 'Design', 'Human Resources', 'Operations',
    'Customer Service', 'Manufacturing', 'Construction', 'Agriculture',
    'Government', 'Non-Profit', 'Tourism', 'Transportation', 'Other'
  ];

  const jobTypes = [
    'Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship',
    'Remote', 'Hybrid', 'Temporary', 'Volunteer'
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`max-w-4xl max-h-[90vh] overflow-y-auto ${
        theme === 'dark' 
          ? 'bg-gray-900/95 border-gray-700/50 backdrop-blur-xl' 
          : 'bg-white/95 border-gray-200/50 backdrop-blur-xl'
      }`}>
        <DialogHeader>
          <DialogTitle className={`flex items-center space-x-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            <Save className="w-5 h-5" />
            <span>{isEditing ? 'Edit Job' : 'Post New Job'}</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Job Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                Job Title *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Senior React Developer"
                className={`rounded-xl border-0 ${
                  theme === 'dark' 
                    ? 'bg-white/10 text-white placeholder:text-gray-400' 
                    : 'bg-white/80 text-gray-900 placeholder:text-gray-500'
                } ${errors.title ? 'ring-2 ring-red-500' : ''}`}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            {/* Company */}
            <div className="space-y-2">
              <Label htmlFor="company" className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                Company *
              </Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="e.g., Tech Solutions Rwanda"
                className={`rounded-xl border-0 ${
                  theme === 'dark' 
                    ? 'bg-white/10 text-white placeholder:text-gray-400' 
                    : 'bg-white/80 text-gray-900 placeholder:text-gray-500'
                } ${errors.company ? 'ring-2 ring-red-500' : ''}`}
              />
              {errors.company && (
                <p className="text-sm text-red-500">{errors.company}</p>
              )}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location" className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                Location *
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g., Kigali, Rwanda"
                className={`rounded-xl border-0 ${
                  theme === 'dark' 
                    ? 'bg-white/10 text-white placeholder:text-gray-400' 
                    : 'bg-white/80 text-gray-900 placeholder:text-gray-500'
                } ${errors.location ? 'ring-2 ring-red-500' : ''}`}
              />
              {errors.location && (
                <p className="text-sm text-red-500">{errors.location}</p>
              )}
            </div>

            {/* Job Type */}
            <div className="space-y-2">
              <Label className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                Job Type *
              </Label>
              <Select value={formData.job_type} onValueChange={(value) => handleInputChange('job_type', value)}>
                <SelectTrigger className={`rounded-xl border-0 ${
                  theme === 'dark' 
                    ? 'bg-white/10 text-white' 
                    : 'bg-white/80 text-gray-900'
                } ${errors.job_type ? 'ring-2 ring-red-500' : ''}`}>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  {jobTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.job_type && (
                <p className="text-sm text-red-500">{errors.job_type}</p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                Category *
              </Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger className={`rounded-xl border-0 ${
                  theme === 'dark' 
                    ? 'bg-white/10 text-white' 
                    : 'bg-white/80 text-gray-900'
                } ${errors.category ? 'ring-2 ring-red-500' : ''}`}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-red-500">{errors.category}</p>
              )}
            </div>

            {/* Salary Range */}
            <div className="space-y-2">
              <Label htmlFor="salary_range" className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                Salary Range
              </Label>
              <Input
                id="salary_range"
                value={formData.salary_range}
                onChange={(e) => handleInputChange('salary_range', e.target.value)}
                placeholder="e.g., 500,000 - 800,000 RWF/month"
                className={`rounded-xl border-0 ${
                  theme === 'dark' 
                    ? 'bg-white/10 text-white placeholder:text-gray-400' 
                    : 'bg-white/80 text-gray-900 placeholder:text-gray-500'
                }`}
              />
            </div>

            {/* Deadline */}
            <div className="space-y-2">
              <Label htmlFor="deadline" className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                Application Deadline
              </Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => handleInputChange('deadline', e.target.value)}
                className={`rounded-xl border-0 ${
                  theme === 'dark' 
                    ? 'bg-white/10 text-white' 
                    : 'bg-white/80 text-gray-900'
                }`}
              />
            </div>

            {/* URL */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="url" className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                Application URL *
              </Label>
              <Input
                id="url"
                type="url"
                value={formData.url}
                onChange={(e) => handleInputChange('url', e.target.value)}
                placeholder="https://company.com/careers/job-id"
                className={`rounded-xl border-0 ${
                  theme === 'dark' 
                    ? 'bg-white/10 text-white placeholder:text-gray-400' 
                    : 'bg-white/80 text-gray-900 placeholder:text-gray-500'
                } ${errors.url ? 'ring-2 ring-red-500' : ''}`}
              />
              {errors.url && (
                <p className="text-sm text-red-500">{errors.url}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
              Job Description *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Provide a detailed job description including responsibilities, qualifications, and company information..."
              rows={6}
              className={`rounded-xl border-0 ${
                theme === 'dark' 
                  ? 'bg-white/10 text-white placeholder:text-gray-400' 
                  : 'bg-white/80 text-gray-900 placeholder:text-gray-500'
              } ${errors.description ? 'ring-2 ring-red-500' : ''}`}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Requirements */}
          <div className="space-y-2">
            <Label htmlFor="requirements" className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
              Requirements
            </Label>
            <Textarea
              id="requirements"
              value={formData.requirements}
              onChange={(e) => handleInputChange('requirements', e.target.value)}
              placeholder="List the key requirements, skills, and qualifications needed for this position..."
              rows={4}
              className={`rounded-xl border-0 ${
                theme === 'dark' 
                  ? 'bg-white/10 text-white placeholder:text-gray-400' 
                  : 'bg-white/80 text-gray-900 placeholder:text-gray-500'
              }`}
            />
          </div>

          {Object.keys(errors).length > 0 && (
            <Alert className={`${
              theme === 'dark' 
                ? 'bg-red-900/20 border-red-800 text-red-300' 
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please fix the errors above before submitting.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createJobMutation.isPending}
              className={`rounded-xl ${
                theme === 'dark' 
                  ? 'border-white/20 text-gray-300 hover:bg-white/10' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createJobMutation.isPending}
              className={`rounded-xl ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                  : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
              } text-white font-medium`}
            >
              {createJobMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {createJobMutation.isPending ? (isEditing ? 'Updating...' : 'Posting...') : (isEditing ? 'Update Job' : 'Post Job')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}