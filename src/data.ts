// Large static data objects for the AutoApply AI Job Automation Platform

export interface Job {
  title: string;
  company: string;
  country: string;
  salary: string;
  platform: string;
  score: number;
  type: string;
  posted: string;
  tags: string[];
  desc: string;
}

export interface ApplicationRecord {
  company: string;
  position: string;
  country: string;
  salary: string;
  platform: string;
  appliedDate: string;
  cvUsed: string;
  status: 'Applied' | 'Interview' | 'Rejected' | 'Follow-up';
  followUp: string;
}

export interface PlatformConfig {
  name: string;
  icon: string;
  status: string;
  color: string;
  bg: string;
  apps: number;
}

export interface WorkflowConfig {
  name: string;
  desc: string;
  icon: string;
  color: string;
  bg: string;
  on: boolean;
}

export interface ScheduleEvent {
  time: string;
  title: string;
  sub: string;
  color: string;
  dot: string;
}

export const staticJobs: Job[] = [
  { 
    title: 'AI Automation Consultant', 
    company: 'Accenture', 
    country: 'USA', 
    salary: '$130,000 /yr', 
    platform: 'LinkedIn', 
    score: 94, 
    type: 'Contract', 
    posted: '2h ago', 
    tags: ['Claude', 'n8n', 'Python', 'LLM'], 
    desc: 'Seeking an experienced AI Automation Consultant to guide clients through strategic n8n workflow deployment. You will construct autonomous systems that interface with LLMs (Claude Sonnet 3.5, Gemini 1.5, GPT-4o), design resilient APIs endpoints, and measure actual operational ROI performance.' 
  },
  { 
    title: 'Senior Prompt Engineer', 
    company: 'Scale AI', 
    country: 'Remote', 
    salary: '$140,000 /yr', 
    platform: 'Braintrust', 
    score: 91, 
    type: 'Full-time', 
    posted: '4h ago', 
    tags: ['Prompt Eng', 'LLM', 'Python', 'Claude'], 
    desc: 'Develop, optimize, and inspect complex prompts across multi-turn dialogues. Build systematic test harness matrices to evaluate the safety, response alignment, and edge-cases of advanced reasoning models.' 
  },
  { 
    title: 'Power BI Consultant', 
    company: 'Deloitte', 
    country: 'UK', 
    salary: '$95,000 /yr', 
    platform: 'Indeed', 
    score: 88, 
    type: 'Consulting', 
    posted: '6h ago', 
    tags: ['Power BI', 'DAX', 'SQL', 'Azure'], 
    desc: 'Direct critical visualization dashboard pipelines for our enterprise clients. Strong command of DAX measures, star schema dimensional modeling, and hybrid SQL integration is necessary. Consulting background is a major plus.' 
  },
  { 
    title: 'LLM & AI Software Engineer', 
    company: 'Anthropic', 
    country: 'Remote', 
    salary: '$165,000 /yr', 
    platform: 'Arc.dev', 
    score: 86, 
    type: 'Full-time', 
    posted: '1d ago', 
    tags: ['LLM', 'Python', 'ML', 'Claude'], 
    desc: 'Optimize low-latency LLM inference workloads, build clean retrieval systems, and establish benchmark performance checks. Position is 100% remote with premium health benefits.' 
  },
  { 
    title: 'Workflow Automation Architect', 
    company: 'Zapier', 
    country: 'Remote', 
    salary: '$112,000 /yr', 
    platform: 'Upwork', 
    score: 84, 
    type: 'Freelance', 
    posted: '1d ago', 
    tags: ['n8n', 'Zapier', 'API', 'No-code'], 
    desc: 'Deconstruct nested bottlenecks in business operations and write multi-agent automation hooks linking CRM, helpdesks, and financial ledger channels. Highly collaborative role.' 
  },
  { 
    title: 'Tableau Analytics Expert', 
    company: 'McKinsey', 
    country: 'Singapore', 
    salary: '$105,000 /yr', 
    platform: 'LinkedIn', 
    score: 81, 
    type: 'Contract', 
    posted: '2d ago', 
    tags: ['Tableau', 'SQL', 'Python', 'Analytics'], 
    desc: 'Engage with executive dashboards translating dense metrics into clean, highly readable graphical interfaces. Tableau Creator license and clean SQL modeling skills are mandatory.' 
  },
  { 
    title: 'AI Operations & ML Consultant', 
    company: 'IBM', 
    country: 'Germany', 
    salary: '$120,000 /yr', 
    platform: 'Toptal', 
    score: 79, 
    type: 'Consulting', 
    posted: '2d ago', 
    tags: ['AI Ops', 'Python', 'MLOps', 'Cloud'], 
    desc: 'Audit current enterprise workloads, construct robust infrastructure checks, and manage automated model monitoring triggers. Client-facing proficiency required.' 
  }
];

export const staticApplications: ApplicationRecord[] = [
  { company: 'Accenture', position: 'AI Automation Consultant', country: 'USA', salary: '$130K', platform: 'LinkedIn', appliedDate: 'Jun 9', cvUsed: 'AI Automation CV', status: 'Interview', followUp: 'Due Jun 12' },
  { company: 'Scale AI', position: 'Senior Prompt Engineer', country: 'Remote', salary: '$140K', platform: 'Braintrust', appliedDate: 'Jun 9', cvUsed: 'Prompt Eng CV', status: 'Applied', followUp: '—' },
  { company: 'Deloitte', position: 'Power BI Consultant', country: 'UK', salary: '$95K', platform: 'Indeed', appliedDate: 'Jun 8', cvUsed: 'Power BI CV', status: 'Applied', followUp: '—' },
  { company: 'Anthropic', position: 'LLM Software Engineer', country: 'Remote', salary: '$165K', platform: 'Arc.dev', appliedDate: 'Jun 8', cvUsed: 'Full Stack AI CV', status: 'Applied', followUp: '—' },
  { company: 'KPMG', position: 'Data Automation Lead', country: 'India', salary: '$80K', platform: 'LinkedIn', appliedDate: 'Jun 7', cvUsed: 'Workflow CV', status: 'Rejected', followUp: '—' },
  { company: 'Zapier', position: 'Workflow Automation Specialist', country: 'Remote', salary: '$112K', platform: 'Upwork', appliedDate: 'Jun 7', cvUsed: 'Workflow CV', status: 'Applied', followUp: 'Due Jun 14' },
  { company: 'McKinsey', position: 'Tableau Analytics Expert', country: 'Singapore', salary: '$105K', platform: 'LinkedIn', appliedDate: 'Jun 6', cvUsed: 'Data Analytics CV', status: 'Applied', followUp: '—' },
  { company: 'IBM', position: 'AI Operations & ML Consultant', country: 'Germany', salary: '$120K', platform: 'Toptal', appliedDate: 'Jun 5', cvUsed: 'AI Automation CV', status: 'Applied', followUp: '—' }
];

export const staticPlatforms: PlatformConfig[] = [
  { name: 'LinkedIn', icon: 'BrandLinkedin', status: 'Connected', color: '#0077b5', bg: 'bg-blue-100/50 text-blue-700', apps: 28 },
  { name: 'Upwork', icon: 'Briefcase', status: 'Connected', color: '#37a112', bg: 'bg-emerald-100/50 text-emerald-700', apps: 32 },
  { name: 'Indeed', icon: 'Search', status: 'Connected', color: '#2164f3', bg: 'bg-sky-100/50 text-sky-700', apps: 15 },
  { name: 'Braintrust', icon: 'Cpu', status: 'Connected', color: '#a78bfa', bg: 'bg-violet-100/50 text-violet-700', apps: 8 },
  { name: 'Arc.dev', icon: 'Globe', status: 'Connected', color: '#2dd4bf', bg: 'bg-teal-100/50 text-teal-700', apps: 6 },
  { name: 'Toptal', icon: 'Star', status: 'Connected', color: '#f5a623', bg: 'bg-amber-100/50 text-amber-700', apps: 4 },
  { name: 'Freelancer', icon: 'Globe', status: 'Not connected', color: '#64748b', bg: 'bg-slate-100 text-slate-500', apps: 0 },
  { name: 'PeoplePerHour', icon: 'Clock', status: 'Not connected', color: '#64748b', bg: 'bg-slate-100 text-slate-500', apps: 0 }
];

export const staticWorkflows: WorkflowConfig[] = [
  { name: 'Daily Job Scan', desc: 'Scans 14 platforms every 6 hours for matches', icon: 'Search', color: 'text-sky-500', bg: 'bg-sky-50', on: true },
  { name: 'Auto Resume Tailor', desc: 'Customizes core CV keywords based on JD', icon: 'Fingerprint', color: 'text-emerald-500', bg: 'bg-emerald-50', on: true },
  { name: 'Cover Letter Draft', desc: 'Queries Gemini model for customized pitch letters', icon: 'Sparkles', color: 'text-indigo-500', bg: 'bg-indigo-50', on: true },
  { name: 'Auto Apply Agent', desc: 'Autonomously submits high-score applications', icon: 'Send', color: 'text-teal-500', bg: 'bg-teal-50', on: false },
  { name: '3-Day Email Follow-up', desc: 'Grounded outreach follow-ups 3 days post-apply', icon: 'Mail', color: 'text-amber-500', bg: 'bg-amber-50', on: true },
  { name: '7-Day Email Follow-up', desc: 'Second level escalated follow-up at 7 days', icon: 'MailCheck', color: 'text-amber-500', bg: 'bg-amber-50', on: true },
  { name: 'Anti-Duplicate Guard', desc: 'Prevents reapplying to same role/company', icon: 'Shield', color: 'text-emerald-500', bg: 'bg-emerald-50', on: true }
];

export const staticSchedule: ScheduleEvent[] = [
  { time: '6:00 AM', title: 'Autonomous Discovery Scan', sub: 'Indexed 14 search streams for matching jobs', color: 'text-sky-500', dot: 'Search' },
  { time: '7:00 AM', title: 'Match & Parsing Review', sub: 'Calculated profile match scores on newly discovered roles', color: 'text-emerald-500', dot: 'Fingerprint' },
  { time: '8:00 AM', title: 'Tailoring CV Customizer', sub: 'Drawn up unique copy variations aligned with ATS indicators', color: 'text-indigo-500', dot: 'FileText' },
  { time: '9:00 AM', title: 'Submission Queue Dispatch', sub: 'Dispatched 4 auto-apply payloads with match score >75%', color: 'text-teal-500', dot: 'Send' },
  { time: '12:00 PM', title: 'Mid-Day Sync Check', sub: 'Gathered incoming email updates and replies', color: 'text-sky-500', dot: 'RefreshCw' },
  { time: '6:00 PM', title: 'Graceful outreach post', sub: 'Delivered pending follow-up notes', color: 'text-amber-500', dot: 'Mail' },
  { time: '9:00 PM', title: 'Daily Report Courier', sub: 'Dispatched analytical dashboard snapshot to Moin', color: 'text-emerald-500', dot: 'PieChart' }
];
