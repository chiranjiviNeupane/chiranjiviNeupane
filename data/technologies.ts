import { experience } from './experience';

export type TechCategoryId = 'backend' | 'cloud' | 'data' | 'security' | 'testing' | 'observability' | 'frontend';

export interface TechCategory {
  id: TechCategoryId;
  label: string;
  /** One-line summary of what the group covers. */
  summary: string;
}

export type TechUsage = 'current' | 'earlier';

export interface Technology {
  id: string;
  name: string;
  category: TechCategoryId;
  description: string;
  /** Ids of technologies this one is typically used alongside. Undirected. */
  related: string[];
  /**
   * Where it sits in the timeline, only where the CV says so:
   * 'current' = current role's stack or "day to day" in the About text;
   * 'earlier' = "earlier in my career" in the About text, or only used in past roles.
   * Left unset when the source material doesn't say.
   */
  usage?: TechUsage;
}

export const techCategories: TechCategory[] = [
  { id: 'backend', label: 'Backend', summary: 'Services, APIs and the languages behind them' },
  { id: 'cloud', label: 'Cloud & DevOps', summary: 'Shipping and running services' },
  { id: 'data', label: 'Data & Messaging', summary: 'Storage, queries and event streams' },
  { id: 'security', label: 'Security', summary: 'Authentication and authorization' },
  { id: 'testing', label: 'Testing & Quality', summary: 'Confidence before release' },
  { id: 'observability', label: 'Observability', summary: 'Visibility into production' },
  { id: 'frontend', label: 'Frontend familiarity', summary: 'Working across the stack when needed' },
];

export const technologies: Technology[] = [
  // Backend
  {
    id: 'java',
    name: 'Java',
    category: 'backend',
    usage: 'current',
    description: 'Primary backend language for designing, building and operating enterprise services.',
    related: ['spring-boot', 'junit', 'grails', 'go'],
  },
  {
    id: 'spring-boot',
    name: 'Spring Boot',
    category: 'backend',
    usage: 'current',
    description: 'Framework behind backend services across platform, payments and HR systems.',
    related: ['java', 'rest', 'spring-security', 'kafka', 'mysql', 'postgresql', 'microservices'],
  },
  {
    id: 'go',
    name: 'Go',
    category: 'backend',
    usage: 'current',
    description: 'Designed and built a new Go microservice from the ground up for a cloud platform integration.',
    related: ['microservices', 'docker', 'aws', 'rest'],
  },
  {
    id: 'grails',
    name: 'Grails',
    category: 'backend',
    usage: 'earlier',
    description: 'Application modules for an adventure sport booking website.',
    related: ['java', 'mysql', 'angular'],
  },
  {
    id: 'rest',
    name: 'REST APIs',
    category: 'backend',
    description: 'Building clean APIs and replacing legacy architectures with simpler, maintainable layers.',
    related: ['openapi', 'microservices', 'spring-boot'],
  },
  {
    id: 'microservices',
    name: 'Microservices',
    category: 'backend',
    usage: 'current',
    description: 'Independently deployable services, owned end-to-end from architecture to production.',
    related: ['docker', 'kafka', 'rest', 'splunk', 'grafana'],
  },
  {
    id: 'openapi',
    name: 'Swagger / OpenAPI',
    category: 'backend',
    description: 'API tooling for describing and exploring REST endpoints.',
    related: ['rest'],
  },

  // Cloud & Infrastructure
  {
    id: 'aws',
    name: 'AWS',
    category: 'cloud',
    usage: 'current',
    description: 'Elastic Beanstalk, S3 and RDS.',
    related: ['docker', 'postgresql', 'mysql', 'cicd'],
  },
  {
    id: 'docker',
    name: 'Docker',
    category: 'cloud',
    usage: 'current',
    description: 'Containerised services as part of day-to-day backend delivery.',
    related: ['rancher', 'cicd', 'microservices'],
  },
  {
    id: 'cicd',
    name: 'CI/CD',
    category: 'cloud',
    usage: 'current',
    description: 'Building reliable pipelines so tested code reaches production safely.',
    related: ['jenkins', 'bamboo', 'junit', 'cucumber'],
  },
  {
    id: 'jenkins',
    name: 'Jenkins',
    category: 'cloud',
    description: 'Pipeline automation for builds and test suites.',
    related: ['cicd'],
  },
  {
    id: 'bamboo',
    name: 'Bamboo',
    category: 'cloud',
    usage: 'earlier',
    description: 'CI/CD practices on a payments engineering team.',
    related: ['cicd', 'rancher'],
  },
  {
    id: 'git',
    name: 'Git',
    category: 'cloud',
    description: 'Version control.',
    related: ['cicd'],
  },
  {
    id: 'rancher',
    name: 'Rancher',
    category: 'cloud',
    usage: 'earlier',
    description: 'Container platform used alongside Bamboo-based CI/CD.',
    related: ['docker', 'kafka'],
  },

  // Data & Messaging
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    category: 'data',
    usage: 'current',
    description: 'Schema modelling and query tuning for performance.',
    related: ['mysql'],
  },
  {
    id: 'mysql',
    name: 'MySQL',
    category: 'data',
    usage: 'current',
    description: 'Relational storage behind platform, HR and booking systems.',
    related: ['postgresql'],
  },
  {
    id: 'kafka',
    name: 'Kafka',
    category: 'data',
    usage: 'earlier',
    description: 'Kafka-based messaging; diagnosed a production payment failure caused by a Kafka misconfiguration.',
    related: ['microservices', 'spring-boot'],
  },

  // Security
  {
    id: 'spring-security',
    name: 'Spring Security',
    category: 'security',
    usage: 'earlier',
    description: 'Authentication and authorization for Spring-based services.',
    related: ['jwt', 'keycloak'],
  },
  {
    id: 'jwt',
    name: 'JWT',
    category: 'security',
    usage: 'earlier',
    description: 'Token-based authentication for backend features.',
    related: ['spring-security', 'keycloak'],
  },
  {
    id: 'keycloak',
    name: 'Keycloak',
    category: 'security',
    usage: 'earlier',
    description: 'Identity and access management.',
    related: ['jwt', 'grails'],
  },

  // Testing & Quality
  {
    id: 'junit',
    name: 'JUnit',
    category: 'testing',
    usage: 'current',
    description: 'Unit tests to strengthen payment API reliability ahead of releases.',
    related: ['mockito', 'java'],
  },
  {
    id: 'mockito',
    name: 'Mockito',
    category: 'testing',
    usage: 'current',
    description: 'Isolating dependencies in unit tests.',
    related: ['junit'],
  },
  {
    id: 'cucumber',
    name: 'Cucumber',
    category: 'testing',
    usage: 'current',
    description: 'BDD tests for payment APIs.',
    related: ['bdd', 'junit'],
  },
  {
    id: 'bdd',
    name: 'BDD',
    category: 'testing',
    description: 'Behaviour-driven development with executable specifications.',
    related: ['cucumber'],
  },

  // Observability
  {
    id: 'splunk',
    name: 'Splunk',
    category: 'observability',
    description: 'Log search and analysis for production systems.',
    related: ['grafana', 'microservices'],
  },
  {
    id: 'grafana',
    name: 'Grafana',
    category: 'observability',
    description: 'Dashboards and metrics for production visibility.',
    related: ['splunk'],
  },

  // Frontend familiarity
  {
    id: 'react',
    name: 'React',
    category: 'frontend',
    description: 'Component-based front ends.',
    related: ['javascript'],
  },
  {
    id: 'angular',
    name: 'Angular',
    category: 'frontend',
    usage: 'earlier',
    description: 'Front end for an adventure sport booking website.',
    related: ['javascript', 'grails'],
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    category: 'frontend',
    description: 'The language of the browser layer.',
    related: ['html-css', 'jquery'],
  },
  {
    id: 'html-css',
    name: 'HTML5 / CSS3',
    category: 'frontend',
    description: 'Semantic markup and styling.',
    related: ['bootstrap'],
  },
  {
    id: 'jquery',
    name: 'jQuery',
    category: 'frontend',
    usage: 'earlier',
    description: 'DOM scripting in an HR management system.',
    related: ['bootstrap'],
  },
  {
    id: 'bootstrap',
    name: 'Bootstrap',
    category: 'frontend',
    usage: 'earlier',
    description: 'Responsive UI framework.',
    related: [],
  },
];

export const technologyById = new Map(technologies.map((t) => [t.id, t]));

/** Undirected, de-duplicated edge list derived from `related`. */
export const technologyEdges: [string, string][] = (() => {
  const seen = new Set<string>();
  const edges: [string, string][] = [];
  for (const tech of technologies) {
    for (const other of tech.related) {
      if (!technologyById.has(other)) continue;
      const key = [tech.id, other].sort().join('|');
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push([tech.id, other]);
    }
  }
  return edges;
})();

export function neighboursOf(id: string): Set<string> {
  const result = new Set<string>();
  for (const [a, b] of technologyEdges) {
    if (a === id) result.add(b);
    if (b === id) result.add(a);
  }
  return result;
}

/** Employers whose listed stack includes this technology (derived from experience data). */
export function employersUsing(tech: Technology): string[] {
  return experience.filter((job) => job.technologies.includes(tech.id)).map((job) => job.company);
}
