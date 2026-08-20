export function BioPanel() {
  return (
    <div>
      <h2 className="text-2xl font-semibold sm:text-3xl">Bio</h2>
      <p className="mt-5 max-w-md leading-relaxed text-white/55">
        [BIO — 3–4 sentences about you: what drives you, what you&apos;re curious about outside of
        code and film, what you&apos;re looking for next. Placeholder copy.]
      </p>
    </div>
  );
}

function ShotItem({ dates, role, body }: { dates: string; role: string; body: string }) {
  return (
    <li className="relative pl-6">
      <span className="absolute -left-[25px] top-1.5 h-2 w-2 rounded-full border-2 border-black bg-white/70" />
      <p className="font-mono text-xs tracking-wide text-white/40">{dates}</p>
      <p className="mt-1 font-semibold">{role}</p>
      <p className="mt-1 text-sm leading-relaxed text-white/55">{body}</p>
    </li>
  );
}

export function ExperiencePanel() {
  return (
    <div>
      <h2 className="text-2xl font-semibold sm:text-3xl">Experience</h2>
      <ol className="mt-6 space-y-7 border-l border-white/15 pl-6">
        <ShotItem
          dates="JUN 2025 — DEC 2025 · CLIFTON, NJ"
          role="Data Engineering Intern — Passaic Valley Water Commission"
          body="Consolidated 5+ analytics APIs into SQL Server and deployed automated Python/SQL ETL pipelines with CI/CD, cutting manual reporting effort and troubleshooting time."
        />
        <ShotItem
          dates="MAY 2023 — PRESENT · NEW BRUNSWICK, NJ"
          role="Frontend Developer — Hack4Impact Rutgers Chapter"
          body="Sustained >95% test coverage with automated Jest/RTL suites and cut initial load time 28% through code-splitting across 80+ reviewed commits."
        />
        <ShotItem
          dates="DEC 2023 — MAY 2026 · NEW BRUNSWICK, NJ"
          role="President — Association of Indians at Rutgers"
          body="Led a 33-member team and $40K budget across 24 partner orgs, delivering events for 2,000+ attendees and raising $7K for charity."
        />
      </ol>
      <button
        type="button"
        aria-disabled="true"
        title="Add resume.pdf to enable this button"
        className="mt-8 inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm text-white/60"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M12 3v13m0 0l-4-4m4 4l4-4M5 21h14" />
        </svg>
        Download résumé (coming soon)
      </button>
    </div>
  );
}

export function EducationPanel() {
  return (
    <div>
      <h2 className="text-2xl font-semibold sm:text-3xl">Education</h2>
      <p className="mt-5 font-semibold">Rutgers School of Arts and Sciences</p>
      <p className="text-sm text-white/50">Rutgers Honors College — New Brunswick, NJ</p>
      <p className="mt-2 text-sm">B.S. Computer Science &amp; Data Science</p>
      <p className="mt-1 font-mono text-xs text-white/40">GPA 3.7/4.0 · Expected May 2026</p>
    </div>
  );
}

function SkillGroup({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="mb-2 text-sm text-white/50">{label}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="rounded-full border border-white/15 px-2.5 py-1 font-mono text-xs">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SkillsPanel() {
  return (
    <div>
      <h2 className="text-2xl font-semibold sm:text-3xl">Skills</h2>
      <div className="mt-5 space-y-5">
        <SkillGroup label="Languages" items={["Java (Spring Boot)", "Python", "SQL", "TypeScript/React", "C/C++", "Kotlin"]} />
        <SkillGroup label="Tools & platforms" items={["Git / CI-CD", "Docker", "AWS", "REST APIs", "JUnit / Jest", "Jira / Agile"]} />
      </div>
    </div>
  );
}
