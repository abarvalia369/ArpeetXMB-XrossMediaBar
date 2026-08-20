import type { Metadata } from "next";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <main id="main">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <h1 className="text-3xl font-semibold sm:text-4xl">A shot list of what I&apos;ve been building.</h1>

        <p id="bio" className="mt-6 max-w-2xl scroll-mt-[calc(var(--xmb-band-h)+16px)] text-base leading-relaxed text-white/55">
          [BIO — 3–4 sentences about you: what drives you, what you&apos;re curious about outside
          of code and film, what you&apos;re looking for next. Placeholder copy.]
        </p>

        <div className="mt-16 grid gap-14 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <h2 id="experience" className="scroll-mt-[calc(var(--xmb-band-h)+16px)] text-xs uppercase tracking-widest text-white/40">
              Experience
            </h2>
            <ol className="mt-6 space-y-8 border-l border-white/15 pl-6">
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
              className="mt-12 inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm text-white/60"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M12 3v13m0 0l-4-4m4 4l4-4M5 21h14" />
              </svg>
              Download résumé (coming soon)
            </button>
          </div>

          <div className="space-y-10 lg:col-span-2">
            <div id="education" className="scroll-mt-[calc(var(--xmb-band-h)+16px)] rounded-xl border border-white/12 p-6">
              <h2 className="text-xs uppercase tracking-widest text-white/40">Education</h2>
              <p className="mt-4 font-semibold">Rutgers School of Arts and Sciences</p>
              <p className="text-sm text-white/50">Rutgers Honors College — New Brunswick, NJ</p>
              <p className="mt-2 text-sm">B.S. Computer Science &amp; Data Science</p>
              <p className="mt-1 font-mono text-xs text-white/40">GPA 3.7/4.0 · Expected May 2026</p>
            </div>

            <div id="skills" className="scroll-mt-[calc(var(--xmb-band-h)+16px)] rounded-xl border border-white/12 p-6">
              <h2 className="text-xs uppercase tracking-widest text-white/40">Skills</h2>
              <div className="mt-4 space-y-4 text-sm">
                <SkillGroup
                  label="Languages"
                  items={["Java (Spring Boot)", "Python", "SQL", "TypeScript/React", "C/C++", "Kotlin"]}
                />
                <SkillGroup label="Tools & platforms" items={["Git / CI-CD", "Docker", "AWS", "REST APIs", "JUnit / Jest", "Jira / Agile"]} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function ShotItem({ dates, role, body }: { dates: string; role: string; body: string }) {
  return (
    <li className="relative pl-7">
      <span className="absolute -left-[29px] top-1.5 h-2 w-2 rounded-full border-2 border-black bg-white/70" />
      <p className="font-mono text-xs tracking-wide text-white/40">{dates}</p>
      <p className="mt-1 font-semibold">{role}</p>
      <p className="mt-1 text-sm leading-relaxed text-white/55">{body}</p>
    </li>
  );
}

function SkillGroup({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="mb-2 text-white/50">{label}</p>
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
