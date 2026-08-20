export default function HomePage() {
  return (
    <main id="main">
      <section className="mx-auto max-w-3xl px-6 py-24 text-center sm:py-32">
        <p className="text-xs uppercase tracking-[0.2em] text-white/40">Arpeet Barvalia</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          [TAGLINE — one line about who you are]
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/55 sm:text-lg">
          B.S. Computer Science &amp; Data Science student at Rutgers Honors College, building
          data pipelines by day and cutting short films by night. Based in Clifton, NJ.
        </p>
        <p className="mt-10 text-xs uppercase tracking-widest text-white/30">
          Use the menu above — arrow keys, scroll, drag, or click
        </p>
      </section>
    </main>
  );
}
