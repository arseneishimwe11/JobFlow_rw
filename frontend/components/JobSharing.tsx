import React, { useState } from 'react';
import { Share2, Download, MessageCircle, Linkedin, Twitter, Facebook, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '../contexts/ThemeContext';
import { jobSharingService, ShareOptions } from '../lib/sharingService';
import type { Job } from '../lib/apiClient';

interface JobSharingProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
}

export default function JobSharing({ job, isOpen, onClose }: JobSharingProps) {
  const { theme } = useTheme();
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<ShareOptions['format']>('landscape');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const shareOptions: Array<{
    platform: ShareOptions['platform'];
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }> = [
    {
      platform: 'whatsapp',
      label: 'WhatsApp',
      icon: MessageCircle,
      color: 'text-green-600'
    },
    {
      platform: 'linkedin',
      label: 'LinkedIn',
      icon: Linkedin,
      color: 'text-blue-600'
    },
    {
      platform: 'twitter',
      label: 'Twitter',
      icon: Twitter,
      color: 'text-sky-500'
    },
    {
      platform: 'facebook',
      label: 'Facebook',
      icon: Facebook,
      color: 'text-blue-700'
    },
    {
      platform: 'download',
      label: 'Download',
      icon: Download,
      color: 'text-purple-600'
    }
  ];

  const formatOptions = [
    { value: 'landscape', label: 'Landscape (1200x630)', description: 'Perfect for LinkedIn, Facebook' },
    { value: 'square', label: 'Square (1080x1080)', description: 'Great for Instagram, Twitter' },
    { value: 'story', label: 'Story (1080x1920)', description: 'Instagram Stories, WhatsApp Status' }
  ];

  const handleShare = async (platform: ShareOptions['platform']) => {
    try {
      setIsGenerating(true);
      await jobSharingService.shareJob(job, {
        platform,
        format: selectedFormat,
        includeLogo: true
      });
    } catch (error) {
      console.error('Error sharing job:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreviewImage = async () => {
    try {
      setIsGenerating(true);
      const imageDataUrl = await jobSharingService.generateJobImage(job, {
        platform: 'download',
        format: selectedFormat,
        includeLogo: true
      });
      setGeneratedImage(imageDataUrl);
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadImage = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.download = `${job.title.replace(/[^a-zA-Z0-9]/g, '_')}_job_posting.png`;
      link.href = generatedImage;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-2xl max-h-[90vh] overflow-y-auto ${
        theme === 'dark' 
          ? 'bg-gray-900/95 border-white/10 text-white' 
          : 'bg-white/95 border-gray-200 text-gray-900'
      } backdrop-blur-xl`}>
        <DialogHeader>
          <DialogTitle className={`flex items-center space-x-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            <Share2 className="w-5 h-5" />
            <span>Share Job Opportunity</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Job Preview */}
          <div className={`p-4 rounded-xl border ${
            theme === 'dark' 
              ? 'bg-white/5 border-white/10' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <h3 className={`font-semibold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {job.title}
            </h3>
            <div className={`flex items-center space-x-4 text-sm ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <span>{job.company}</span>
              <span>•</span>
              <span>{job.location}</span>
              <span>•</span>
              <span>{job.jobType}</span>
            </div>
          </div>

          {/* Format Selection */}
          <div className="space-y-3">
            <label className={`font-medium ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Image Format
            </label>
            <Select value={selectedFormat} onValueChange={(value: ShareOptions['format']) => setSelectedFormat(value)}>
              <SelectTrigger className={`${
                theme === 'dark' 
                  ? 'bg-white/10 border-white/20 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                {formatOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-gray-500">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Image Preview */}
          {generatedImage && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className={`font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Preview
                </label>
                <Button
                  onClick={handleDownloadImage}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </div>
              <div className={`border rounded-xl overflow-hidden ${
                theme === 'dark' ? 'border-white/10' : 'border-gray-200'
              }`}>
                <img 
                  src={generatedImage} 
                  alt="Job sharing preview" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          )}

          {/* Share Buttons */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className={`font-medium ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Share to Platform
              </label>
              <Button
                onClick={handlePreviewImage}
                disabled={isGenerating}
                variant="outline"
                size="sm"
                className={`${
                  theme === 'dark' 
                    ? 'border-white/20 text-gray-300 hover:bg-white/10' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {isGenerating ? 'Generating...' : 'Preview Image'}
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {shareOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <Button
                    key={option.platform}
                    onClick={() => handleShare(option.platform)}
                    disabled={isGenerating}
                    variant="outline"
                    className={`h-12 flex flex-col items-center space-y-1 ${
                      theme === 'dark' 
                        ? 'border-white/20 text-gray-300 hover:bg-white/10' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent className={`w-5 h-5 ${option.color}`} />
                    <span className="text-xs font-medium">{option.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Share URL */}
          <div className="space-y-3">
            <label className={`font-medium ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Direct Link
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={jobSharingService.getShareUrl(job, { platform: 'download', format: 'landscape' })}
                readOnly
                className={`flex-1 px-3 py-2 rounded-lg border text-sm ${
                  theme === 'dark' 
                    ? 'bg-white/10 border-white/20 text-gray-300' 
                    : 'bg-gray-50 border-gray-300 text-gray-700'
                }`}
              />
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(
                    jobSharingService.getShareUrl(job, { platform: 'download', format: 'landscape' })
                  );
                }}
                size="sm"
                variant="outline"
                className={`${
                  theme === 'dark' 
                    ? 'border-white/20 text-gray-300 hover:bg-white/10' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Copy
              </Button>
            </div>
          </div>

          {/* Loading State */}
          {isGenerating && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span className={`${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Generating image...
                </span>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
