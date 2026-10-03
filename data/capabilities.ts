export type CapabilityIcon =
  'system' | 'api' | 'services' | 'integration' | 'data' | 'security' | 'pipeline' | 'incident' | 'legacy';

export interface Capability {
  id: string;
  title: string;
  description: string;
  icon: CapabilityIcon;
  /** Experience ids where this work was done; rendered as "Applied at". */
  appliedAt: string[];
}

export const philosophy =
  "I care about code that's easy to review, tested before it ships, and safe to operate under pressure. That shapes how I approach code review, CI/CD, and incident response.";

export const capabilities: Capability[] = [
  {
    id: 'backend',
    title: 'Scalable Backend Systems',
    description:
      'Designing and building backend services, owned end-to-end from architecture through production support.',
    icon: 'system',
    appliedAt: ['team-internet', 'iag', 'snigdhtech'],
  },
  {
    id: 'api',
    title: 'REST API Design & Modernization',
    description: 'Building clean APIs and replacing legacy architectures with simpler, maintainable layers.',
    icon: 'api',
    appliedAt: ['team-internet', 'iag'],
  },
  {
    id: 'microservices',
    title: 'Microservices Architecture',
    description:
      'Structuring applications as independently deployable services, owned end-to-end from architecture to production.',
    icon: 'services',
    appliedAt: ['team-internet'],
  },
  {
    id: 'integrations',
    title: 'Enterprise & Third-Party Integrations',
    description: 'Connecting systems and services, including cloud platforms and payment providers.',
    icon: 'integration',
    appliedAt: ['team-internet', 'iag', 'snigdhtech'],
  },
  {
    id: 'data',
    title: 'Database Design & Optimization',
    description: 'Modeling schemas and tuning queries for performance.',
    icon: 'data',
    appliedAt: ['team-internet', 'snigdhtech', 'goglides'],
  },
  {
    id: 'security',
    title: 'Secure Authentication & Account Security',
    description:
      'Implementing authentication and authorization, from token-based auth to single-session login enforcement.',
    icon: 'security',
    appliedAt: ['team-internet', 'snigdhtech', 'goglides'],
  },
  {
    id: 'cicd',
    title: 'CI/CD & Test Automation',
    description: 'Building reliable pipelines and automated unit and BDD test suites that strengthen releases.',
    icon: 'pipeline',
    appliedAt: ['team-internet', 'iag'],
  },
  {
    id: 'incidents',
    title: 'Production Incident Response',
    description: 'Diagnosing critical production issues under pressure and restoring service.',
    icon: 'incident',
    appliedAt: ['iag'],
  },
  {
    id: 'legacy',
    title: 'Legacy Modernization',
    description: 'Decomposing long-lived codebases into maintainable services while keeping operations running.',
    icon: 'legacy',
    appliedAt: ['team-internet'],
  },
];
