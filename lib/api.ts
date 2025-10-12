// This file exports the API functions that were previously using Encore.dev
// Now they use the new apiClient

import { apiClient } from './apiClient';

// Re-export the API client methods for backward compatibility
export const jobApi = apiClient.jobs;
export const companyApi = apiClient.companies;
export const authApi = apiClient.auth;
export const savedJobsApi = apiClient.savedJobs;
export const userApi = apiClient.users;
export const statsApi = apiClient.stats;

// Export types
export type {
  Job,
  Company,
  User,
  AuthResponse,
  JobsListResponse,
  CompaniesListResponse,
  StatsResponse,
  DashboardStatsResponse,
  ApiResponse
} from './apiClient';

// Export the main client for direct access if needed
export { apiClient };

// Default export
export default apiClient;