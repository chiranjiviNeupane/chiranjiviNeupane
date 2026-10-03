import { education } from './education';

export const SITE_URL = 'https://www.chiranjivineupane.com.np';

// Single source for facts that appear in several places (hero, about, SEO).
const name = 'Chiranjivi Neupane';
const title = 'Backend Software Engineer';
const currentRole = 'Software Engineer';
const currentEmployer = 'Team Internet';
const experience = { label: '5+ years', short: '5+ yrs' };
const location = {
  display: 'Sydney, Australia',
  short: 'Sydney, AU',
  locality: 'Sydney',
  region: 'NSW',
  country: 'AU',
  countryName: 'Australia',
};
const coreStack = ['Java', 'Spring Boot', 'Go', 'AWS', 'Microservices'];

export const profile = {
  name,
  firstName: 'Chiranjivi',
  lastName: 'Neupane',
  initials: 'CN',
  title,
  currentRole,
  currentEmployer,
  location,
  experience,
  availability: 'Open to select opportunities',
  coreStack,
  /** Hero line under the title; the title itself already says "Backend Software Engineer". */
  headline: `${experience.label} building and operating Java, Spring Boot & Go systems for enterprise platforms.`,
  contact: {
    email: 'chiranjivi.neupane96@gmail.com',
    linkedin: 'https://www.linkedin.com/in/chiranjivi-neupane-315104123',
    github: 'https://github.com/chiranjiviNeupane',
  },
  seo: {
    title: `${name} | ${title} (Java, Spring Boot, Go, AWS)`,
    shortTitle: `${name} | ${title}`,
    description: `${name} is a ${location.locality}-based ${title} with ${experience.label} of experience in Java, Spring Boot, Go, microservices, REST APIs and AWS for enterprise platforms.`,
    socialDescription: `${location.locality}-based ${title} with ${experience.label} of experience in Java, Spring Boot, Go, microservices, REST APIs and AWS for enterprise platforms.`,
    personDescription: `${title} with ${experience.label} of experience specializing in Java, Spring Boot, Go, microservices, REST APIs and AWS.`,
    knowsAbout: [
      'Java',
      'Spring Boot',
      'Go',
      'Microservices',
      'REST APIs',
      'AWS',
      'Docker',
      'MySQL',
      'PostgreSQL',
      'Kafka',
      'CI/CD',
    ],
  },
} as const;

const highestQualification = education[0];

export const about = {
  /** `**text**` renders as emphasis. */
  paragraphs: [
    `I'm a ${title} with **${experience.label} of experience** across enterprise and platform environments in ${location.countryName}, currently at **${currentEmployer}**, where I design, build and operate services using Java, Spring Boot and Go.`,
    "I focus on owning services end-to-end, from architecture through production support, and I'm comfortable reviewing code and providing technical guidance within Agile teams. I enjoy resolving critical incidents under pressure, modernizing legacy systems, and building reliable CI/CD and automated testing practices.",
    "Day to day, I work primarily with **Java, Spring Boot, Go, PostgreSQL/MySQL, Docker and AWS**, alongside testing tools like JUnit, Mockito and Cucumber. I've also worked with Spring Security/JWT-based authentication, Kafka, and enterprise integrations earlier in my career, and use AI-assisted tools (GitHub Copilot, Cursor, Claude) as part of my daily workflow.",
  ],
  snapshot: [
    { label: 'Experience', value: experience.label, detail: 'Enterprise & platform environments' },
    { label: 'Location', value: `${location.locality}, ${location.region}`, detail: location.countryName },
    { label: 'Current role', value: currentRole, detail: currentEmployer },
    {
      label: 'Primary focus',
      value: 'Backend & production systems',
      detail: 'Architecture through production support',
    },
    { label: 'Core technologies', value: 'Java · Spring Boot · Go', detail: 'PostgreSQL/MySQL · Docker · AWS' },
    {
      label: 'Education',
      value: highestQualification.abbreviation ?? highestQualification.qualification,
      detail: highestQualification.institution,
    },
  ],
} as const;

/** Compact key/value strip shown at the bottom of the hero. */
export const heroFacts = [
  { label: 'Based in', value: location.short },
  { label: 'Experience', value: experience.label },
  { label: 'Currently', value: currentEmployer },
];
