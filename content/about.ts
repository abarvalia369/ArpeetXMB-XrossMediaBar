import type { AboutContent } from "./types";

export const ABOUT: AboutContent = {
  bioHeading: "Bio",
  bio: "[BIO — 3–4 sentences about you: what drives you, what you're curious about outside of code and film, what you're looking for next. Placeholder copy.]",
  experienceHeading: "Experience",
  experience: [
    {
      dates: "JUN 2025 — DEC 2025 · CLIFTON, NJ",
      role: "Data Engineering Intern — Passaic Valley Water Commission",
      body: "Consolidated 5+ analytics APIs into SQL Server and deployed automated Python/SQL ETL pipelines with CI/CD, cutting manual reporting effort and troubleshooting time.",
    },
    {
      dates: "MAY 2023 — PRESENT · NEW BRUNSWICK, NJ",
      role: "Frontend Developer — Hack4Impact Rutgers Chapter",
      body: "Sustained >95% test coverage with automated Jest/RTL suites and cut initial load time 28% through code-splitting across 80+ reviewed commits.",
    },
    {
      dates: "DEC 2023 — MAY 2026 · NEW BRUNSWICK, NJ",
      role: "President — Association of Indians at Rutgers",
      body: "Led a 33-member team and $40K budget across 24 partner orgs, delivering events for 2,000+ attendees and raising $7K for charity.",
    },
  ],
  educationHeading: "Education",
  educationSchool: "Rutgers School of Arts and Sciences",
  educationDepartment: "Rutgers Honors College — New Brunswick, NJ",
  educationDegree: "B.S. Computer Science & Data Science",
  educationMeta: "GPA 3.7/4.0 · Expected May 2026",
  skillsHeading: "Skills",
  skillGroups: [
    { label: "Languages", items: ["Java (Spring Boot)", "Python", "SQL", "TypeScript/React", "C/C++", "Kotlin"] },
    { label: "Tools & platforms", items: ["Git / CI-CD", "Docker", "AWS", "REST APIs", "JUnit / Jest", "Jira / Agile"] },
  ],
  resumeButtonLabel: "Download résumé (coming soon)",
  resumeButtonTitle: "Add resume.pdf to enable this button",
};
