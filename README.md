# Chiranjivi Neupane

Backend Software Engineer based in Sydney, Australia — 5+ years across enterprise and platform environments, specializing in Java, Spring Boot, Go, microservices and AWS.

I own services end-to-end, from architecture through production support, with a focus on CI/CD, automated testing, and resolving critical incidents under pressure. Currently building backend systems at **Team Internet**.

**Status:** Open to select opportunities

## What I work with

- **Backend:** Java, Spring Boot, Go, Grails, REST APIs, Microservices
- **Cloud & DevOps:** AWS, Docker, Jenkins, Bamboo, Rancher, CI/CD
- **Data:** PostgreSQL, MySQL
- **Testing:** JUnit, Mockito, Cucumber, BDD
- **Security:** Spring Security, JWT, Keycloak
- **Observability:** Splunk, Grafana

## Portfolio

**[chiranjivineupane.com.np](https://www.chiranjivineupane.com.np/)** — this repository is also the source for that site.

## Contact

- Email: [chiranjivi.neupane96@gmail.com](mailto:chiranjivi.neupane96@gmail.com)
- LinkedIn: [linkedin.com/in/chiranjivi-neupane-315104123](https://www.linkedin.com/in/chiranjivi-neupane-315104123)

---

## About this repository

This repo doubles as both my GitHub profile README and the source for my portfolio site, deployed to GitHub Pages.

### Stack

- **Next.js** (App Router, static export) + **React** + **TypeScript**
- **three.js** via **React Three Fiber** for the two WebGL scenes
- CSS Modules with a small token layer in `app/globals.css`; fonts (IBM Plex Sans, IBM Plex Mono) self-hosted via `next/font`

All content is server-rendered HTML. The 3D scenes are decorative progressive enhancement: they load lazily after first paint, pause when off-screen, simplify on touch/small screens, and fall back to a static SVG when WebGL is unavailable, Save-Data is on, or the device is low-power. `prefers-reduced-motion` freezes scene motion and removes transitions.

### Updating content

Professional content lives in typed data files — UI components never need editing for CV updates:

| File                   | Contents                                                                     |
| ---------------------- | ---------------------------------------------------------------------------- |
| `data/profile.ts`      | Name, headline, contact links, About copy, engineering snapshot, SEO strings |
| `data/experience.ts`   | Roles (reverse-chronological), highlights, technologies                      |
| `data/technologies.ts` | Expertise categories, technologies, descriptions and connections             |
| `data/capabilities.ts` | Capability areas and where each was applied                                  |
| `data/education.ts`    | Qualifications (dated entries also appear on the experience timeline)        |
| `data/sections.ts`     | Section order and nav labels; numbering and the page are generated from it   |

Facts that appear in several places (role, employer, years of experience, location) are defined once in `data/profile.ts`. Experience entries and technologies are linked by id, and `npm test` fails if any id reference is broken.

### Structure

```
├── app/                 # Layout + metadata, page, robots.txt, sitemap.xml
├── components/
│   ├── layout/          # Header (nav, mobile menu) and footer
│   ├── sections/        # Hero, About, Expertise, Experience, Capabilities, Education, Contact
│   ├── experience/      # Scroll-linked timeline rail + entries
│   ├── expertise/       # Technology explorer + 3D constellation
│   ├── three/           # Hero system visualisation, static SVG fallback, loader
│   └── ui/              # Shared primitives
├── data/                # All profile content (see above)
├── lib/                 # Dates, breakpoints, motion helpers, shared scroll state, render-tier detection
├── tests/               # Data integrity, date maths, breakpoint and label-collision tests
└── public/              # CNAME, favicon, Open Graph image
```

### Running locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export to ./out
npm start          # serve ./out
npm run check      # typecheck, lint, formatting and tests (also run in CI)
```

Breakpoints are defined once in `lib/breakpoints.ts` (640 / 900 / 1100px); a test rejects any other value in a stylesheet media query.

### Deployment

`.github/workflows/deploy.yml` builds the static export on every push to `main` and publishes `out/` with GitHub Pages Actions. In the repository settings, **Pages → Build and deployment → Source** must be set to **GitHub Actions**. The custom domain (`www.chiranjivineupane.com.np`) stays configured in Pages settings; `public/CNAME` is kept for reference and is copied into the build.
