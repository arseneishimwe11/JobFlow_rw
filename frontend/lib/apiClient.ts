// Types for API responses
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string;
  salaryRange?: string;
  jobType: string;
  category: string;
  deadline?: string;
  source?: string;
  url?: string;
  postedDate: string;
  createdAt: string;
  isFeatured: boolean;
  isActive: boolean;
}

interface Company {
  id: number;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  location?: string;
  jobCount?: number;
}

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  isVerified: boolean;
  isPro: boolean;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface JobsListResponse {
  jobs: Job[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface CompaniesListResponse {
  companies: Company[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface StatsResponse {
  overview: {
    totalJobs: number;
    activeJobs: number;
    totalCompanies: number;
    totalUsers: number;
    featuredJobs: number;
    recentJobs: number;
  };
  categories: Array<{
    name: string;
    count: number;
  }>;
  jobTypes: Array<{
    name: string;
    type: string;
    count: number;
  }>;
  locations: Array<{
    name: string;
    count: number;
  }>;
  topCompanies: Array<{
    id: number;
    name: string;
    logo?: string;
    jobCount: number;
  }>;
  trends: Array<{
    date: string;
    count: number;
  }>;
  userStats?: {
    savedJobs: number;
    isAdmin: boolean;
  };
}

interface DashboardStatsResponse {
  overview: {
    jobs: {
      total: number;
      active: number;
      inactive: number;
      featured: number;
      today: number;
      thisWeek: number;
      thisMonth: number;
    };
    companies: {
      total: number;
    };
    users: {
      total: number;
      admins: number;
      regular: number;
    };
  };
  recentActivity: {
    jobs: Job[];
    users: User[];
  };
}

// New API client to replace the Encore.dev client
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = 'http://localhost:4000/api') {
    this.baseURL = baseURL;
    // Get token from localStorage if available
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Jobs API
  jobs = {
    list: async (params: any = {}): Promise<JobsListResponse> => {
      const searchParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          searchParams.append(key, params[key].toString());
        }
      });
      
      const queryString = searchParams.toString();
      return this.request<JobsListResponse>(`/jobs${queryString ? `?${queryString}` : ''}`);
    },

    get: async (params: { id: number }): Promise<Job> => {
      return this.request<Job>(`/jobs/${params.id}`);
    },

    create: async (data: any): Promise<Job> => {
      return this.request<Job>('/jobs', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    bulkCreate: async (data: { jobs: any[] }): Promise<{ jobs: Job[] }> => {
      return this.request<{ jobs: Job[] }>('/jobs/bulk', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    update: async (id: number, data: any): Promise<Job> => {
      return this.request<Job>(`/jobs/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    delete: async (id: number): Promise<{ success: boolean }> => {
      return this.request<{ success: boolean }>(`/jobs/${id}`, {
        method: 'DELETE',
      });
    },
  };

  // Companies API
  companies = {
    list: async (params: any = {}) => {
      const searchParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          searchParams.append(key, params[key].toString());
        }
      });
      
      const queryString = searchParams.toString();
      return this.request(`/companies${queryString ? `?${queryString}` : ''}`);
    },

    get: async (params: { id: number }) => {
      return this.request(`/companies/${params.id}`);
    },

    getTopCompanies: async (params: { limit?: number } = {}) => {
      const searchParams = new URLSearchParams();
      if (params.limit) {
        searchParams.append('limit', params.limit.toString());
      }
      
      const queryString = searchParams.toString();
      return this.request(`/companies/top/featured${queryString ? `?${queryString}` : ''}`);
    },
  };

  // Auth API
  auth = {
    login: async (data: { email: string; password: string }): Promise<AuthResponse> => {
      const response = await this.request<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      
      if (response.token) {
        this.setToken(response.token);
      }
      
      return response;
    },

    register: async (data: { name: string; email: string; password: string }): Promise<AuthResponse> => {
      const response = await this.request<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      
      if (response.token) {
        this.setToken(response.token);
      }
      
      return response;
    },

    me: async (): Promise<User> => {
      return this.request<User>('/auth/me');
    },

    logout: () => {
      this.clearToken();
    },
  };

  // Saved Jobs API
  savedJobs = {
    get: async (params: { userId: number }) => {
      return this.request(`/saved-jobs/${params.userId}`);
    },

    save: async (data: { jobId: number; userId: number }) => {
      return this.request('/saved-jobs', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    unsave: async (data: { jobId: number; userId: number }) => {
      return this.request('/saved-jobs', {
        method: 'DELETE',
        body: JSON.stringify(data),
      });
    },

    check: async (params: { jobId: number }) => {
      return this.request(`/saved-jobs/check/${params.jobId}`);
    },
  };

  // Users API
  users = {
    getProfile: async () => {
      return this.request('/users/profile');
    },

    updateProfile: async (data: any) => {
      return this.request('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    list: async (params: any = {}) => {
      const searchParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          searchParams.append(key, params[key].toString());
        }
      });
      
      const queryString = searchParams.toString();
      return this.request(`/users${queryString ? `?${queryString}` : ''}`);
    },

    get: async (params: { id: number }) => {
      return this.request(`/users/${params.id}`);
    },
  };

  // Stats API
  stats = {
    get: async (): Promise<StatsResponse> => {
      return this.request<StatsResponse>('/stats');
    },

    getDashboard: async (): Promise<DashboardStatsResponse> => {
      return this.request<DashboardStatsResponse>('/stats/dashboard');
    },
  };
}

// Create singleton instance
export const apiClient = new ApiClient();
export default apiClient;

// Export types for use in components
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
};
