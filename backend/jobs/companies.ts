import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { jobsDB } from "./db";
import type { Company } from "./types";

interface ListCompaniesParams {
  page?: Query<number>;
  limit?: Query<number>;
  search?: Query<string>;
  industry?: Query<string>;
  location?: Query<string>;
}

interface CompaniesResponse {
  companies: Company[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Retrieves all companies with filtering and pagination support.
export const listCompanies = api<ListCompaniesParams, CompaniesResponse>(
  { expose: true, method: "GET", path: "/companies" },
  async (params) => {
    const page = params.page || 1;
    const limit = Math.min(params.limit || 20, 100);
    const offset = (page - 1) * limit;

    let whereClause = "WHERE 1=1";
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (params.search) {
      whereClause += ` AND (name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      queryParams.push(`%${params.search}%`);
      paramIndex++;
    }

    if (params.industry) {
      whereClause += ` AND industry ILIKE $${paramIndex}`;
      queryParams.push(`%${params.industry}%`);
      paramIndex++;
    }

    if (params.location) {
      whereClause += ` AND location ILIKE $${paramIndex}`;
      queryParams.push(`%${params.location}%`);
      paramIndex++;
    }

    const countQuery = `SELECT COUNT(*) as total FROM companies ${whereClause}`;
    const totalResult = await jobsDB.rawQueryRow(countQuery, ...queryParams);
    const total = parseInt(totalResult?.total || "0");

    const companiesQuery = `
      SELECT * FROM companies 
      ${whereClause}
      ORDER BY is_verified DESC, rating DESC NULLS LAST, total_jobs DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    
    const companies = await jobsDB.rawQueryAll(
      companiesQuery,
      ...queryParams,
      limit,
      offset
    );

    return {
      companies: companies.map(company => ({
        id: company.id,
        name: company.name,
        description: company.description,
        website: company.website,
        logo_url: company.logo_url,
        industry: company.industry,
        size: company.size,
        location: company.location,
        founded_year: company.founded_year,
        benefits: company.benefits || [],
        culture_tags: company.culture_tags || [],
        rating: company.rating ? parseFloat(company.rating) : undefined,
        total_jobs: company.total_jobs,
        is_verified: company.is_verified,
        created_at: new Date(company.created_at),
        updated_at: new Date(company.updated_at),
      })),
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    };
  }
);

interface GetCompanyParams {
  id: number;
}

// Retrieves a specific company by ID with its jobs.
export const getCompany = api<GetCompanyParams, Company & { jobs: any[] }>(
  { expose: true, method: "GET", path: "/companies/:id" },
  async (params) => {
    const company = await jobsDB.queryRow`
      SELECT * FROM companies WHERE id = ${params.id}
    `;

    if (!company) {
      throw new Error("Company not found");
    }

    const jobs = await jobsDB.queryAll`
      SELECT * FROM jobs 
      WHERE company_id = ${params.id} AND is_active = TRUE
      ORDER BY posted_date DESC NULLS LAST, created_at DESC
      LIMIT 20
    `;

    return {
      id: company.id,
      name: company.name,
      description: company.description,
      website: company.website,
      logo_url: company.logo_url,
      industry: company.industry,
      size: company.size,
      location: company.location,
      founded_year: company.founded_year,
      benefits: company.benefits || [],
      culture_tags: company.culture_tags || [],
      rating: company.rating ? parseFloat(company.rating) : undefined,
      total_jobs: company.total_jobs,
      is_verified: company.is_verified,
      created_at: new Date(company.created_at),
      updated_at: new Date(company.updated_at),
      jobs: jobs.map(job => ({
        ...job,
        posted_date: job.posted_date ? new Date(job.posted_date) : undefined,
        scraped_at: new Date(job.scraped_at),
        created_at: new Date(job.created_at),
        updated_at: new Date(job.updated_at),
      })),
    };
  }
);
