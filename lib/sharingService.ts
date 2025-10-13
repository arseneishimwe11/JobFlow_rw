import type { Job } from './apiClient';

export interface ShareOptions {
  platform: 'whatsapp' | 'linkedin' | 'twitter' | 'facebook' | 'email' | 'copy';
}

export class JobSharingService {
  private static instance: JobSharingService;
  private baseUrl: string = window.location.origin;
  private siteUrl: string = 'opendoors.rw'; // Your production URL
  
  public static getInstance(): JobSharingService {
    if (!JobSharingService.instance) {
      JobSharingService.instance = new JobSharingService();
    }
    return JobSharingService.instance;
  }

  /**
   * Share a job to various platforms
   */
  async shareJob(job: Job, options: ShareOptions, imageDataUrl?: string): Promise<void> {
    const text = this.getFormattedShareText(job, options.platform);
    const url = this.getShareUrl(job);

    switch (options.platform) {
      case 'whatsapp':
        // Try to use Web Share API with image if available
        if (navigator.share && imageDataUrl) {
          try {
            // Convert data URL to blob
            const blob = await this.dataUrlToBlob(imageDataUrl);
            const file = new File([blob], `${job.title.replace(/[^a-zA-Z0-9]/g, '_')}.png`, { type: 'image/png' });
            
            await navigator.share({
              text: text,
              files: [file]
            });
            return;
          } catch (error) {
            console.log('Web Share API not available, falling back to text only');
          }
        }
        // Fallback to text only
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
        break;
      
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      
      case 'twitter':
        const twitterText = this.getTwitterText(job);
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}`, '_blank');
        break;
      
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      
      case 'email':
        const emailText = this.getEmailText(job);
        const subject = `Job Opportunity: ${job.title}`;
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailText)}`;
        break;
      
      case 'copy':
        await this.copyToClipboard(text);
        break;
    }
  }

  /**
   * Convert data URL to Blob
   */
  private async dataUrlToBlob(dataUrl: string): Promise<Blob> {
    const response = await fetch(dataUrl);
    return await response.blob();
  }

  /**
   * Get shareable URL for job
   */
  getShareUrl(job: Job): string {
    return `${this.baseUrl}/jobs/${job.id}`;
  }

  /**
   * Get formatted share text based on platform (WhatsApp style with full details)
   */
  private getFormattedShareText(job: Job, platform: string): string {
    const jobUrl = this.getShareUrl(job);
    const siteUrl = this.siteUrl;
    
    // Format deadline if available
    const deadlineText = job.deadline 
      ? `\nDeadline: ${new Date(job.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`
      : '';
    
    // Create the message with all details and emojis
    return `🚀 *Open Position*

*${job.title}*${deadlineText}

${job.company} is hiring!

📍 Location: ${job.location}
💼 Type: ${job.jobType || 'Full-time'}
🏷️ Category: ${job.category || 'General'}
${job.salaryRange ? `💰 Salary: ${job.salaryRange}` : ''}

Visit our opportunity platform to apply:
${jobUrl}

Follow our platform: ${this.baseUrl}

_Apply now or share with someone who might be a perfect fit._`;
  }

  /**
   * Get LinkedIn-optimized text
   */
  private getLinkedInText(job: Job): string {
    return `🎯 New Opportunity Alert!

${job.title} at ${job.company}

Location: ${job.location}
Type: ${job.jobType || 'Full-time'}

${job.description ? job.description.substring(0, 200) + '...' : ''}

Apply now: ${this.getShareUrl(job)}

#JobOpportunity #Hiring #${job.category?.replace(/\s/g, '')} #Rwanda`;
  }

  /**
   * Get Twitter-optimized text (character limit considered)
   */
  private getTwitterText(job: Job): string {
    const jobUrl = this.getShareUrl(job);
    const baseText = `🚀 ${job.title} at ${job.company}

📍 ${job.location}
💼 ${job.jobType || 'Full-time'}

Apply: ${jobUrl}`;
    
    // Twitter has 280 character limit
    return baseText.length > 270 ? baseText.substring(0, 270) + '...' : baseText;
  }

  /**
   * Get Email-optimized text
   */
  private getEmailText(job: Job): string {
    const jobUrl = this.getShareUrl(job);
    
    return `Hi,

I wanted to share this job opportunity with you:

Job Title: ${job.title}
Company: ${job.company}
Location: ${job.location}
Type: ${job.jobType || 'Full-time'}
Category: ${job.category || 'General'}
${job.salaryRange ? `Salary Range: ${job.salaryRange}` : ''}
${job.deadline ? `Application Deadline: ${new Date(job.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}` : ''}

${job.description || ''}

To apply or learn more, visit:
${jobUrl}

Explore more opportunities at ${this.siteUrl}

Best regards`;
  }

  /**
   * Copy text to clipboard
   */
  private async copyToClipboard(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
      } catch (err) {
        console.error('Failed to copy text', err);
      }
      
      document.body.removeChild(textArea);
    }
  }

  /**
   * Get preview text for display
   */
  getPreviewText(job: Job): string {
    return this.getFormattedShareText(job, 'whatsapp');
  }

  /**
   * Generate a professional job card image with SVG background
   */
  async generateJobImage(job: Job): Promise<string> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      // WhatsApp preview dimensions (16:9 ratio)
      canvas.width = 1024;
      canvas.height = 576;

      const renderContent = () => {
        // Add dark overlay for text readability (if SVG loaded)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Render text content
        const centerY = canvas.height / 2;
        
        // "Open Position" text at top
        ctx.fillStyle = '#ffffff';
        ctx.font = '22px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Open Position', canvas.width / 2, 80);

        // Job Title (main text)
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 48px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        const titleLines = this.wrapText(ctx, job.title, canvas.width - 120, 48);
        const titleY = centerY - 80;
        titleLines.slice(0, 2).forEach((line, index) => {
          ctx.fillText(line, canvas.width / 2, titleY + (index * 56));
        });

        // Company and Job Info
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.font = '20px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        
        let currentY = centerY + 10;
        
        // Company
        ctx.fillText(`${job.company}`, canvas.width / 2, currentY);
        currentY += 35;
        
        // Location & Type on same line
        const locationAndType = `${job.location || ''} ${job.location && job.jobType ? '•' : ''} ${job.jobType || ''}`.trim();
        if (locationAndType) {
          ctx.font = '18px system-ui, -apple-system, sans-serif';
          ctx.fillText(locationAndType, canvas.width / 2, currentY);
          currentY += 30;
        }

        // Deadline badge (green, centered)
        if (job.deadline) {
          const deadlineDate = new Date(job.deadline).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          });
          const deadlineText = `Deadline: ${deadlineDate}`;
          
          ctx.font = '18px system-ui, -apple-system, sans-serif';
          const deadlineWidth = ctx.measureText(deadlineText).width + 50;
          
          // Green rounded rectangle
          const rectX = (canvas.width - deadlineWidth) / 2;
          const rectY = currentY + 10;
          const rectHeight = 38;
          const radius = 19;
          
          ctx.fillStyle = '#84cc16';
          ctx.beginPath();
          ctx.moveTo(rectX + radius, rectY);
          ctx.lineTo(rectX + deadlineWidth - radius, rectY);
          ctx.quadraticCurveTo(rectX + deadlineWidth, rectY, rectX + deadlineWidth, rectY + radius);
          ctx.lineTo(rectX + deadlineWidth, rectY + rectHeight - radius);
          ctx.quadraticCurveTo(rectX + deadlineWidth, rectY + rectHeight, rectX + deadlineWidth - radius, rectY + rectHeight);
          ctx.lineTo(rectX + radius, rectY + rectHeight);
          ctx.quadraticCurveTo(rectX, rectY + rectHeight, rectX, rectY + rectHeight - radius);
          ctx.lineTo(rectX, rectY + radius);
          ctx.quadraticCurveTo(rectX, rectY, rectX + radius, rectY);
          ctx.closePath();
          ctx.fill();
          
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 16px system-ui, -apple-system, sans-serif';
          ctx.fillText(deadlineText, canvas.width / 2, rectY + 24);
        }

        // Bottom section - URL
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.font = '16px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Visit our opportunity platform to apply.', canvas.width / 2, canvas.height - 65);
        
        ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
        ctx.fillText('opendoors.rw', canvas.width / 2, canvas.height - 35);

        resolve(canvas.toDataURL('image/png', 1.0));
      };

      // Try to load SVG background
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        // Draw the background image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        renderContent();
      };
      
      img.onerror = () => {
        console.log('SVG failed to load, using gradient background');
        // Fallback to gradient background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#0f766e');
        gradient.addColorStop(1, '#14532d');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        renderContent();
      };
      
      // Try to load the SVG
      img.src = '/assets/job_offers.svg';
    });
  }

  /**
   * Download generated image
   */
  downloadImage(dataUrl: string, filename: string): void {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Wrap text to fit within width
   */
  private wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, fontSize: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = words[0];
    
    ctx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`;
    
    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    
    return lines;
  }
}

export const jobSharingService = JobSharingService.getInstance();
