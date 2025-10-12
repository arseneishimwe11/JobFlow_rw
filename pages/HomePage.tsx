import React from 'react';
import Hero from '../components/Hero';
import FeaturedJobs from '../components/FeaturedJobs';
import TopCompanies from '../components/TopCompanies';
import JobCategories from '../components/JobCategories';
import TrendingSkills from '../components/TrendingSkills';
import JobMarketInsights from '../components/JobMarketInsights';

export default function HomePage() {
  return (
    <div className="space-y-16">
      <Hero />
      <div className="container mx-auto px-4 max-w-7xl space-y-16">
        <FeaturedJobs />
        <JobCategories />
        <TopCompanies />
        <TrendingSkills />
        <JobMarketInsights />
      </div>
    </div>
  );
}
