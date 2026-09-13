import { ABOUT } from "@/content";

export function BioPanel() {
  return (
    <div>
      <h2 className="text-2xl font-semibold sm:text-3xl">{ABOUT.bioHeading}</h2>
      <p className="mt-5 max-w-md leading-relaxed text-white/55">{ABOUT.bio}</p>
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
      <h2 className="text-2xl font-semibold sm:text-3xl">{ABOUT.experienceHeading}</h2>
      <ol className="mt-6 space-y-7 border-l border-white/15 pl-6">
        {ABOUT.experience.map((entry) => (
          <ShotItem key={entry.role} dates={entry.dates} role={entry.role} body={entry.body} />
        ))}
      </ol>
    </div>
  );
}

export function EducationPanel() {
  return (
    <div>
      <h2 className="text-2xl font-semibold sm:text-3xl">{ABOUT.educationHeading}</h2>
      <p className="mt-5 font-semibold">{ABOUT.educationSchool}</p>
      <p className="text-sm text-white/50">{ABOUT.educationDepartment}</p>
      <div className="pl-4">
        {ABOUT.educationDegrees.map((degree) => (
          <div key={degree} className="mt-2">
            <p className="text-sm">{degree}</p>
            <p className="mt-0.5 font-mono text-xs text-white/40">{ABOUT.educationMeta}</p>
          </div>
        ))}
      </div>
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
      <h2 className="text-2xl font-semibold sm:text-3xl">{ABOUT.skillsHeading}</h2>
      <div className="mt-5 space-y-5">
        {ABOUT.skillGroups.map((group) => (
          <SkillGroup key={group.label} label={group.label} items={group.items} />
        ))}
      </div>
    </div>
  );
}
