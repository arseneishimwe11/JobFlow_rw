import type { Job } from './apiClient';

export interface ShareOptions {
  platform: 'whatsapp' | 'linkedin' | 'twitter' | 'facebook' | 'download' | 'copy';
  format: 'square' | 'landscape' | 'story';
  includeLogo?: boolean;
}

export class JobSharingService {
  private static instance: JobSharingService;
  
  public static getInstance(): JobSharingService {
    if (!JobSharingService.instance) {
      JobSharingService.instance = new JobSharingService();
    }
    return JobSharingService.instance;
  }

  /**
   * Generate a shareable image for a job posting
   */
  async generateJobImage(job: Job, options: ShareOptions): Promise<string> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    // Set canvas dimensions based on format
    const dimensions = this.getDimensions(options.format);
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1e40af'); // blue-800
    gradient.addColorStop(1, '#0891b2'); // cyan-600
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add subtle pattern overlay
    this.addPatternOverlay(ctx, canvas.width, canvas.height);

    // Add content
    await this.addJobContent(ctx, job, canvas.width, canvas.height, options);

    return canvas.toDataURL('image/png', 1.0);
  }

  /**
   * Share job to specific platform
   */
  async shareJob(job: Job, options: ShareOptions): Promise<void> {
    const shareUrl = this.getShareUrl(job, options);
    const shareText = this.getShareText(job, options);
    
    switch (options.platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'download':
        const imageDataUrl = await this.generateJobImage(job, options);
        this.downloadImage(imageDataUrl, `${job.title.replace(/[^a-zA-Z0-9]/g, '_')}_job_posting.png`);
        break;
      case 'copy':
        await this.copyToClipboard(shareText + ' ' + shareUrl);
        break;
    }
  }

  /**
   * Get shareable URL for job
   */
  getShareUrl(job: Job, options: ShareOptions): string {
    const baseUrl = window.location.origin;
    return `${baseUrl}/jobs/${job.id}`;
  }

  /**
   * Get share text for job
   */
  getShareText(job: Job, options: ShareOptions): string {
    return `🚀 New Job Opportunity!\n\n${job.title} at ${job.company}\n📍 ${job.location}\n\nCheck it out:`;
  }

  private getDimensions(format: ShareOptions['format']): { width: number; height: number } {
    switch (format) {
      case 'square':
        return { width: 1080, height: 1080 };
      case 'landscape':
        return { width: 1200, height: 630 };
      case 'story':
        return { width: 1080, height: 1920 };
      default:
        return { width: 1200, height: 630 };
    }
  }

  private addPatternOverlay(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    ctx.save();
    ctx.globalAlpha = 0.1;
    
    // Add subtle grid pattern
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    ctx.restore();
  }

  private async addJobContent(
    ctx: CanvasRenderingContext2D, 
    job: Job, 
    width: number, 
    height: number, 
    options: ShareOptions
  ): Promise<void> {
    const padding = 60;
    const contentWidth = width - (padding * 2);
    
    // Add decorative elements
    this.addDecorations(ctx, width, height);
    
    // Add logo/brand with better styling
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('🇷🇼 Akazi Rwanda', padding, 80);
    
    // Add "NEW JOB" badge
    ctx.fillStyle = '#10b981';
    ctx.fillRect(padding, 100, 180, 40);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Arial, sans-serif';
    ctx.fillText('NEW JOB OPPORTUNITY', padding + 10, 125);
    
    // Add job title with enhanced styling
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 42px Arial, sans-serif';
    ctx.textAlign = 'left';
    
    const titleLines = this.wrapText(ctx, job.title, contentWidth, 42);
    let currentY = 180;
    titleLines.forEach((line, index) => {
      ctx.fillText(line, padding, currentY + (index * 55));
    });
    currentY += titleLines.length * 55 + 20;
    
    // Add company info with icons
    ctx.fillStyle = '#e0f2fe';
    ctx.font = 'bold 30px Arial, sans-serif';
    ctx.fillText(`🏢 ${job.company}`, padding, currentY);
    currentY += 45;
    
    ctx.fillText(`📍 ${job.location}`, padding, currentY);
    currentY += 45;
    
    // Add job details with styling
    ctx.fillStyle = '#a7f3d0';
    ctx.font = '26px Arial, sans-serif';
    
    const jobInfo = `💼 ${job.jobType} • 🏷️ ${job.category}`;
    ctx.fillText(jobInfo, padding, currentY);
    currentY += 40;
    
    if (job.salaryRange) {
      ctx.fillText(`💰 ${job.salaryRange}`, padding, currentY);
      currentY += 40;
    }
    
    // Add description preview with better formatting
    if (job.description && options.format !== 'square') {
      ctx.fillStyle = '#f0f9ff';
      ctx.font = '22px Arial, sans-serif';
      
      const description = job.description.substring(0, 150) + '...';
      const descLines = this.wrapText(ctx, description, contentWidth, 22);
      descLines.slice(0, 3).forEach((line, index) => {
        ctx.fillText(line, padding, currentY + (index * 32));
      });
      currentY += descLines.slice(0, 3).length * 32 + 30;
    }
    
    // Add call to action with button styling
    const buttonY = height - 120;
    const buttonWidth = 400;
    const buttonX = (width - buttonWidth) / 2;
    
    // Button background
    ctx.fillStyle = '#10b981';
    ctx.fillRect(buttonX, buttonY - 30, buttonWidth, 60);
    
    // Button text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🚀 APPLY NOW', width / 2, buttonY + 5);
    
    // Add website URL
    ctx.fillStyle = '#e0f2fe';
    ctx.font = '20px Arial, sans-serif';
    ctx.fillText('Visit akazi.rw for more jobs', width / 2, height - 30);
  }

  private addDecorations(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    // Add subtle geometric decorations
    ctx.save();
    ctx.globalAlpha = 0.1;
    
    // Top right decoration
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(width - 100, 100, 80, 0, Math.PI * 2);
    ctx.fill();
    
    // Bottom left decoration
    ctx.beginPath();
    ctx.arc(100, height - 100, 60, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }

  private wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, fontSize: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = words[0];
    
    ctx.font = `bold ${fontSize}px Arial, sans-serif`;
    
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

  private downloadImage(dataUrl: string, filename: string): void {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private async copyToClipboard(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  }
}

export const jobSharingService = JobSharingService.getInstance();
