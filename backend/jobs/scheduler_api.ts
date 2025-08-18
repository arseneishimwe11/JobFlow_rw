import { api } from "encore.dev/api";
import { JobScheduler } from "./scheduler";

interface SchedulerStatusResponse {
  isScheduled: boolean;
  isRunning: boolean;
}

interface SchedulerActionResponse {
  message: string;
  status: SchedulerStatusResponse;
}

// Get scheduler status
export const getSchedulerStatus = api<{}, SchedulerStatusResponse>(
  { expose: true, method: "GET", path: "/jobs/scheduler/status" },
  async () => {
    const status = JobScheduler.getStatus();
    return {
      isScheduled: status.isScheduled,
      isRunning: status.isRunning
    };
  }
);

// Start the scheduler
export const startScheduler = api<{}, SchedulerActionResponse>(
  { expose: true, method: "POST", path: "/jobs/scheduler/start" },
  async () => {
    JobScheduler.start();
    const status = JobScheduler.getStatus();

    return {
      message: "Job scheduler started successfully",
      status: {
        isScheduled: status.isScheduled,
        isRunning: status.isRunning
      }
    };
  }
);

// Stop the scheduler
export const stopScheduler = api<{}, SchedulerActionResponse>(
  { expose: true, method: "POST", path: "/jobs/scheduler/stop" },
  async () => {
    JobScheduler.stop();
    const status = JobScheduler.getStatus();

    return {
      message: "Job scheduler stopped successfully",
      status: {
        isScheduled: status.isScheduled,
        isRunning: status.isRunning
      }
    };
  }
);

// Run scraping manually
export const runManualScraping = api<{}, SchedulerActionResponse>(
  { expose: true, method: "POST", path: "/jobs/scheduler/run" },
  async () => {
    if (JobScheduler.isScrapingRunning()) {
      throw new Error("Scraping is already in progress");
    }

    // Run scraping in background
    JobScheduler.runManual().catch(error => {
      console.error("Error in manual scraping:", error);
    });

    const status = JobScheduler.getStatus();

    return {
      message: "Manual scraping started successfully",
      status: {
        isScheduled: status.isScheduled,
        isRunning: status.isRunning
      }
    };
  }
);

