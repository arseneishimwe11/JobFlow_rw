import React, { useState, useEffect } from 'react';
import { Share2, MessageCircle, Linkedin, Twitter, Facebook, Mail, Copy, Check, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  const [copied, setCopied] = useState(false);
  const [shareText] = useState(() => jobSharingService.getPreviewText(job));
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Auto-generate image when modal opens
  useEffect(() => {
    if (isOpen && !imagePreview) {
      handleGenerateImage();
    }
  }, [isOpen]);

  const shareOptions: Array<{
    platform: ShareOptions['platform'];
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
  }> = [
    {
      platform: 'whatsapp',
      label: 'WhatsApp',
      icon: MessageCircle,
      color: 'text-green-600',
      bgColor: 'hover:bg-green-50 dark:hover:bg-green-900/20'
    },
    {
      platform: 'linkedin',
      label: 'LinkedIn',
      icon: Linkedin,
      color: 'text-blue-600',
      bgColor: 'hover:bg-blue-50 dark:hover:bg-blue-900/20'
    },
    {
      platform: 'twitter',
      label: 'Twitter/X',
      icon: Twitter,
      color: 'text-sky-500',
      bgColor: 'hover:bg-sky-50 dark:hover:bg-sky-900/20'
    },
    {
      platform: 'facebook',
      label: 'Facebook',
      icon: Facebook,
      color: 'text-blue-700',
      bgColor: 'hover:bg-blue-50 dark:hover:bg-blue-900/20'
    },
    {
      platform: 'email',
      label: 'Email',
      icon: Mail,
      color: 'text-orange-600',
      bgColor: 'hover:bg-orange-50 dark:hover:bg-orange-900/20'
    },
    {
      platform: 'copy',
      label: 'Copy Text',
      icon: copied ? Check : Copy,
      color: copied ? 'text-green-600' : 'text-gray-600',
      bgColor: 'hover:bg-gray-50 dark:hover:bg-gray-800'
    }
  ];

  const handleShare = async (platform: ShareOptions['platform']) => {
    try {
      if (platform === 'copy') {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
      // Pass the image for platforms that support it (especially WhatsApp)
      await jobSharingService.shareJob(job, { platform }, imagePreview || undefined);
    } catch (error) {
      console.error('Error sharing job:', error);
    }
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying text:', error);
    }
  };

  const handleGenerateImage = async () => {
    try {
      setIsGenerating(true);
      const imageDataUrl = await jobSharingService.generateJobImage(job);
      setImagePreview(imageDataUrl);
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadImage = () => {
    if (imagePreview) {
      const filename = `${job.title.replace(/[^a-zA-Z0-9]/g, '_')}_job_posting.png`;
      jobSharingService.downloadImage(imagePreview, filename);
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
          {/* Image Preview at Top (WhatsApp style) */}
          {isGenerating ? (
            <div className={`flex items-center justify-center p-12 rounded-xl border ${
              theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex flex-col items-center space-y-3">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Generating preview...
                </span>
              </div>
            </div>
          ) : imagePreview ? (
            <div className={`rounded-xl overflow-hidden border ${
              theme === 'dark' ? 'border-white/10' : 'border-gray-200'
            }`}>
              <img 
                src={imagePreview} 
                alt="Job preview card" 
                className="w-full h-auto"
              />
            </div>
          ) : null}

          {/* Text Preview - WhatsApp Style */}
          <div className="space-y-3">
            <div className={`p-4 rounded-xl border text-sm whitespace-pre-wrap ${
              theme === 'dark' 
                ? 'bg-green-900/10 border-green-800/30 text-gray-300' 
                : 'bg-green-50 border-green-200 text-gray-800'
            }`} style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
              {shareText}
            </div>
            <Button
              onClick={handleCopyText}
              className={`w-full ${
                copied 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied to Clipboard!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Message
                </>
              )}
            </Button>
          </div>

          {/* Share Buttons */}
          {/* <div className="space-y-3">
            <label className={`font-medium ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Share directly to
            </label>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {shareOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <Button
                    key={option.platform}
                    onClick={() => handleShare(option.platform)}
                    variant="outline"
                    className={`h-16 flex flex-col items-center justify-center space-y-2 transition-all ${
                      option.bgColor
                    } ${
                      theme === 'dark' 
                        ? 'border-white/20 text-gray-300' 
                        : 'border-gray-300 text-gray-700'
                    }`}
                  >
                    <IconComponent className={`w-6 h-6 ${option.color}`} />
                    <span className="text-xs font-medium">{option.label}</span>
                  </Button>
                );
              })}
            </div>
          </div> */}

          {/* Download Image Button */}
          {imagePreview && (
            <Button
              onClick={handleDownloadImage}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Image Card
            </Button>
          )}

          {/* Direct Link */}
          <div className="space-y-3">
            <label className={`font-medium ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Job Link
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={jobSharingService.getShareUrl(job)}
                readOnly
                className={`flex-1 px-3 py-2 rounded-lg border text-sm ${
                  theme === 'dark' 
                    ? 'bg-white/10 border-white/20 text-gray-300' 
                    : 'bg-gray-50 border-gray-300 text-gray-700'
                }`}
              />
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(jobSharingService.getShareUrl(job));
                }}
                size="sm"
                variant="outline"
                className={`${
                  theme === 'dark' 
                    ? 'border-white/20 text-gray-300 hover:bg-white/10' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}