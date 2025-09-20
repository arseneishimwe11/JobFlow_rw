import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const sampleCompanies = [
  {
    name: 'Akazi Rwanda',
    description: 'Leading job platform in Rwanda connecting talent with opportunities',
    logo: 'https://via.placeholder.com/100x100?text=AR',
    website: 'https://akazi.rw',
    location: 'Kigali, Rwanda',
    industry: 'Technology',
    size: '50-100',
    founded: 2020,
  },
  {
    name: 'Bank of Kigali',
    description: 'Premier financial institution in Rwanda',
    logo: 'https://via.placeholder.com/100x100?text=BK',
    website: 'https://bk.rw',
    location: 'Kigali, Rwanda',
    industry: 'Banking & Finance',
    size: '1000+',
    founded: 1966,
  },
  {
    name: 'MTN Rwanda',
    description: 'Leading telecommunications company in Rwanda',
    logo: 'https://via.placeholder.com/100x100?text=MTN',
    website: 'https://mtn.rw',
    location: 'Kigali, Rwanda',
    industry: 'Telecommunications',
    size: '500-1000',
    founded: 1998,
  },
  {
    name: 'Zipline',
    description: 'Drone delivery company revolutionizing healthcare logistics',
    logo: 'https://via.placeholder.com/100x100?text=ZIP',
    website: 'https://zipline.com',
    location: 'Muhanga, Rwanda',
    industry: 'Healthcare Technology',
    size: '100-500',
    founded: 2014,
  },
  {
    name: 'Andela Rwanda',
    description: 'Global technology talent accelerator',
    logo: 'https://via.placeholder.com/100x100?text=AND',
    website: 'https://andela.com',
    location: 'Kigali, Rwanda',
    industry: 'Technology',
    size: '100-500',
    founded: 2014,
  },
];

const sampleJobs = [
  {
    title: 'Senior Software Engineer',
    company: 'Akazi Rwanda',
    location: 'Kigali, Rwanda',
    description: 'We are looking for a Senior Software Engineer to join our dynamic team. You will be responsible for developing and maintaining our job platform, working with modern technologies like React, Node.js, and PostgreSQL.',
    requirements: 'Bachelor\'s degree in Computer Science or related field. 5+ years of experience in full-stack development. Proficiency in JavaScript, TypeScript, React, Node.js. Experience with databases and cloud platforms.',
    salaryRange: '$50,000 - $70,000',
    jobType: 'Full-time',
    category: 'Technology',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    source: 'Manual',
    url: 'https://akazi.rw/jobs/senior-software-engineer',
    isFeatured: true,
  },
  {
    title: 'Digital Marketing Manager',
    company: 'Bank of Kigali',
    location: 'Kigali, Rwanda',
    description: 'Join our marketing team as a Digital Marketing Manager. You will lead digital marketing campaigns, manage social media presence, and drive customer acquisition through various digital channels.',
    requirements: 'Bachelor\'s degree in Marketing, Communications, or related field. 3+ years of digital marketing experience. Proficiency in Google Analytics, social media platforms, and marketing automation tools.',
    salaryRange: '$30,000 - $45,000',
    jobType: 'Full-time',
    category: 'Marketing',
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    source: 'Manual',
    url: 'https://bk.rw/careers/digital-marketing-manager',
    isFeatured: true,
  },
  {
    title: 'Network Engineer',
    company: 'MTN Rwanda',
    location: 'Kigali, Rwanda',
    description: 'We are seeking a Network Engineer to design, implement, and maintain our telecommunications infrastructure. You will work on cutting-edge network technologies and ensure optimal network performance.',
    requirements: 'Bachelor\'s degree in Telecommunications, Electrical Engineering, or related field. 4+ years of network engineering experience. CCNA/CCNP certification preferred. Experience with routing, switching, and network security.',
    salaryRange: '$40,000 - $55,000',
    jobType: 'Full-time',
    category: 'Engineering',
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    source: 'Manual',
    url: 'https://mtn.rw/careers/network-engineer',
    isFeatured: false,
  },
  {
    title: 'Data Scientist',
    company: 'Zipline',
    location: 'Muhanga, Rwanda',
    description: 'Join our data team to analyze flight patterns, optimize delivery routes, and improve our drone operations through data-driven insights. You will work with large datasets and machine learning algorithms.',
    requirements: 'Master\'s degree in Data Science, Statistics, or related field. 3+ years of experience in data analysis and machine learning. Proficiency in Python, R, SQL, and data visualization tools.',
    salaryRange: '$45,000 - $65,000',
    jobType: 'Full-time',
    category: 'Data Science',
    deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
    source: 'Manual',
    url: 'https://zipline.com/careers/data-scientist',
    isFeatured: true,
  },
  {
    title: 'Frontend Developer',
    company: 'Andela Rwanda',
    location: 'Kigali, Rwanda',
    description: 'We are looking for a talented Frontend Developer to create amazing user experiences. You will work with React, TypeScript, and modern frontend technologies to build scalable web applications.',
    requirements: 'Bachelor\'s degree in Computer Science or related field. 3+ years of frontend development experience. Expertise in React, TypeScript, HTML5, CSS3, and responsive design.',
    salaryRange: '$35,000 - $50,000',
    jobType: 'Full-time',
    category: 'Technology',
    deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
    source: 'Manual',
    url: 'https://andela.com/careers/frontend-developer',
    isFeatured: false,
  },
  {
    title: 'Product Manager',
    company: 'Akazi Rwanda',
    location: 'Kigali, Rwanda',
    description: 'Lead product development and strategy for our job platform. You will work closely with engineering, design, and business teams to deliver features that delight our users.',
    requirements: 'Bachelor\'s degree in Business, Engineering, or related field. 4+ years of product management experience. Strong analytical skills and experience with agile development methodologies.',
    salaryRange: '$45,000 - $60,000',
    jobType: 'Full-time',
    category: 'Product Management',
    deadline: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
    source: 'Manual',
    url: 'https://akazi.rw/jobs/product-manager',
    isFeatured: false,
  },
  {
    title: 'UX/UI Designer',
    company: 'Andela Rwanda',
    location: 'Kigali, Rwanda',
    description: 'Create intuitive and beautiful user interfaces for web and mobile applications. You will conduct user research, create wireframes and prototypes, and collaborate with development teams.',
    requirements: 'Bachelor\'s degree in Design, HCI, or related field. 3+ years of UX/UI design experience. Proficiency in Figma, Sketch, Adobe Creative Suite. Strong portfolio showcasing design process and outcomes.',
    salaryRange: '$30,000 - $45,000',
    jobType: 'Full-time',
    category: 'Design',
    deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
    source: 'Manual',
    url: 'https://andela.com/careers/ux-ui-designer',
    isFeatured: false,
  },
  {
    title: 'DevOps Engineer',
    company: 'Zipline',
    location: 'Muhanga, Rwanda',
    description: 'Manage and optimize our cloud infrastructure, CI/CD pipelines, and deployment processes. You will ensure high availability and scalability of our systems.',
    requirements: 'Bachelor\'s degree in Computer Science or related field. 4+ years of DevOps experience. Expertise in AWS/Azure, Docker, Kubernetes, and infrastructure as code tools.',
    salaryRange: '$50,000 - $70,000',
    jobType: 'Full-time',
    category: 'DevOps',
    deadline: new Date(Date.now() + 26 * 24 * 60 * 60 * 1000),
    source: 'Manual',
    url: 'https://zipline.com/careers/devops-engineer',
    isFeatured: true,
  },
  {
    title: 'Business Analyst',
    company: 'Bank of Kigali',
    location: 'Kigali, Rwanda',
    description: 'Analyze business processes, identify improvement opportunities, and support digital transformation initiatives. You will work with stakeholders across the organization.',
    requirements: 'Bachelor\'s degree in Business Administration, Finance, or related field. 3+ years of business analysis experience. Strong analytical and communication skills.',
    salaryRange: '$25,000 - $40,000',
    jobType: 'Full-time',
    category: 'Business Analysis',
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    source: 'Manual',
    url: 'https://bk.rw/careers/business-analyst',
    isFeatured: false,
  },
  {
    title: 'Mobile App Developer',
    company: 'MTN Rwanda',
    location: 'Kigali, Rwanda',
    description: 'Develop mobile applications for iOS and Android platforms. You will work on customer-facing apps and internal tools to enhance our mobile services.',
    requirements: 'Bachelor\'s degree in Computer Science or related field. 3+ years of mobile development experience. Proficiency in Swift/Kotlin or React Native/Flutter.',
    salaryRange: '$40,000 - $55,000',
    jobType: 'Full-time',
    category: 'Mobile Development',
    deadline: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000),
    source: 'Manual',
    url: 'https://mtn.rw/careers/mobile-app-developer',
    isFeatured: false,
  },
];

async function main() {
  console.log('🌱 Starting database seed...');

  try {
    // Create admin user
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
    
    const adminUser = await prisma.user.upsert({
      where: { email: process.env.ADMIN_EMAIL || 'admin@akazi.rw' },
      update: {},
      create: {
        email: process.env.ADMIN_EMAIL || 'admin@akazi.rw',
        name: 'Admin User',
        password: hashedPassword,
        role: 'ADMIN',
        isVerified: true,
        isPro: true,
      },
    });

    console.log('✅ Admin user created:', adminUser.email);

    // Create sample regular user
    const regularUser = await prisma.user.upsert({
      where: { email: 'user@example.com' },
      update: {},
      create: {
        email: 'user@example.com',
        name: 'John Doe',
        password: await bcrypt.hash('password123', 10),
        role: 'USER',
        isVerified: true,
        isPro: false,
      },
    });

    console.log('✅ Regular user created:', regularUser.email);

    // Create companies
    console.log('🏢 Creating companies...');
    const createdCompanies = [];
    
    for (const companyData of sampleCompanies) {
      const company = await prisma.company.upsert({
        where: { name: companyData.name },
        update: companyData,
        create: companyData,
      });
      createdCompanies.push(company);
      console.log(`✅ Company created: ${company.name}`);
    }

    // Create jobs
    console.log('💼 Creating jobs...');
    const createdJobs = [];
    
    for (const jobData of sampleJobs) {
      const company = createdCompanies.find(c => c.name === jobData.company);
      
      const job = await prisma.job.create({
        data: {
          ...jobData,
          companyId: company?.id,
          postedDate: new Date(),
        },
      });
      createdJobs.push(job);
      console.log(`✅ Job created: ${job.title} at ${job.company}`);
    }

    // Create some saved jobs for the regular user
    console.log('💾 Creating saved jobs...');
    const jobsToSave = createdJobs.slice(0, 3); // Save first 3 jobs
    
    for (const job of jobsToSave) {
      await prisma.savedJob.create({
        data: {
          userId: regularUser.id,
          jobId: job.id,
        },
      });
      console.log(`✅ Saved job: ${job.title} for ${regularUser.name}`);
    }

    console.log('🎉 Database seeded successfully!');
    console.log(`📊 Created: ${createdCompanies.length} companies, ${createdJobs.length} jobs, 2 users`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
