export interface ExperienceHighlight {
  /** Short theme label used for scanning, e.g. "Migration". */
  focus: string;
  text: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  /** Compact name for the timeline rail. */
  shortName: string;
  /** Agency/consultancy the engagement was through, if any. */
  via?: string;
  location: string;
  /** YYYY-MM */
  start: string;
  /** YYYY-MM or 'present' */
  end: string | 'present';
  project?: string;
  /** Show highlights behind a "Show highlights" toggle (keeps older roles scannable). */
  collapsed?: boolean;
  highlights: ExperienceHighlight[];
  /** Technology ids from data/technologies.ts. */
  technologies: string[];
}

/** Reverse-chronological. */
export const experience: Experience[] = [
  {
    id: 'team-internet',
    role: 'Software Engineer',
    company: 'Team Internet',
    shortName: 'Team Internet',
    location: 'Sydney, NSW, Australia',
    start: '2022-03',
    end: 'present',
    highlights: [
      {
        focus: 'Migration',
        text: 'Built an automated migration pipeline to move a large volume of customer records between platforms under a tight deadline, achieving zero downtime and no data loss despite no direct API or database access',
      },
      {
        focus: 'Go microservice',
        text: 'Designed and built a new Go microservice from the ground up for a cloud platform integration, owning it from architecture through production deployment',
      },
      {
        focus: 'API modernization',
        text: 'Replaced a legacy API architecture with a simpler, more maintainable layer, significantly streamlining customer onboarding and reducing manual developer intervention during integration',
      },
      {
        focus: 'Security',
        text: 'Strengthened account security by implementing single-session login enforcement',
      },
      {
        focus: 'Legacy systems',
        text: 'Maintain a legacy codebase spanning over 20 years, now decomposed into 5+ core services, balancing operational continuity with ongoing modernization',
      },
      {
        focus: 'Technical guidance',
        text: 'Review code and provide technical guidance across an 8-engineer team',
      },
    ],
    technologies: ['java', 'spring-boot', 'go', 'microservices', 'aws', 'docker', 'mysql', 'cicd'],
  },
  {
    id: 'iag',
    role: 'API Developer',
    company: 'Insurance Australia Group Limited (IAG)',
    shortName: 'IAG',
    via: 'FinXL IT Professional Services',
    location: 'Sydney, NSW, Australia',
    start: '2021-08',
    end: '2022-02',
    highlights: [
      {
        focus: 'Incident response',
        text: 'Diagnosed a production payment failure caused by a Kafka misconfiguration in a Helm chart, restoring transaction processing',
      },
      {
        focus: 'Payments integration',
        text: 'Integrated a third-party payment provider as part of a 9-person Payments team, supporting secure and compliant transaction processing',
      },
      {
        focus: 'Testing',
        text: 'Wrote unit tests (JUnit/Mockito) and BDD tests (Cucumber) to strengthen payment API reliability ahead of releases',
      },
      {
        focus: 'Collaboration',
        text: 'Collaborated across product, frontend, QA and vendor teams to resolve integration issues, working within CI/CD practices using Bamboo and Rancher',
      },
    ],
    technologies: ['java', 'spring-boot', 'kafka', 'junit', 'mockito', 'cucumber', 'bamboo', 'rancher'],
  },
  {
    id: 'snigdhtech',
    role: 'Software Developer',
    company: 'SnigdhTech & Business Solution',
    shortName: 'SnigdhTech',
    location: 'Nakhu, Lalitpur, Nepal',
    start: '2018-12',
    end: '2019-07',
    project: 'Human Resource Management System',
    collapsed: true,
    highlights: [
      { focus: 'Security', text: 'Built backend features using Spring Security and JWT authentication' },
      {
        focus: 'Code quality',
        text: 'Applied clean code practices and design patterns for maintainable, scalable code',
      },
      { focus: 'Automation', text: 'Automated mailing processes and scheduled background tasks' },
      { focus: 'Integration', text: 'Integrated Google Maps REST APIs for location-based features' },
    ],
    technologies: ['java', 'spring-boot', 'mysql', 'git', 'bootstrap', 'jquery', 'jwt'],
  },
  {
    id: 'goglides',
    role: 'Software Engineer',
    company: 'GoGlides',
    shortName: 'GoGlides',
    location: 'Bakhundole, Lalitpur, Nepal',
    start: '2018-03',
    end: '2018-12',
    project: 'Adventure Sport Booking Website',
    collapsed: true,
    highlights: [
      { focus: 'Design', text: 'Analyzed, designed, and maintained application modules end-to-end' },
      { focus: 'Quality', text: 'Reviewed and tested existing systems to identify and resolve defects' },
      { focus: 'Stakeholders', text: 'Reported progress and collaborated closely with managers and stakeholders' },
      { focus: 'Delivery', text: 'Worked closely with developers and designers on cross-functional delivery' },
    ],
    technologies: ['grails', 'mysql', 'angular', 'aws', 'keycloak', 'git'],
  },
];
